import React, { useState, useEffect } from "react";
import {
    ToastAndroid,
    Switch,
    Text,
    TextInput,
    View,
    Button,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Clipboard,
} from "react-native";
import { get, send } from "../utils/api";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment/moment";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";

LocaleConfig.locales["fr"] = {
    monthNames: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ],
    monthNamesShort: [
        "Janv.",
        "Févr.",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juil.",
        "Août",
        "Sept.",
        "Oct.",
        "Nov.",
        "Déc.",
    ],
    dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
    today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

const Toast = props => {
    if (props.visible) {
        ToastAndroid.showWithGravityAndOffset(props.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        return null;
    }
    return null;
};

const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
};

export default function Notes() {
    const defaultNotes = [];
    const [markedDates, setMarkedDates] = useState({});
    const [dateSelected, setDateSelected] = useState(moment().format("YYYY-MM-DD"));
    const [text, setText] = useState("");
    const [notes, setNote] = useState(defaultNotes);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    const [smallLoading, setSmallLoading] = useState("");
    const [isEnabled, setIsEnabled] = useState("Jade");
    const [visible, setVisible] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => (previousState === "Jade" ? "Rama" : "Jade"));
    };
    const [width, setWidth] = useState("99%");

    useEffect(() => {
        getMarked();
        refresh();
        const timer = setTimeout(() => {
            setWidth("auto");
        }, 100);
        return () => clearTimeout(timer);
    }, [width]);

    function handleButtonPress() {
        setVisible(true);
        setVisible(false);
    }

    async function onNewNote() {
        setLoading(true);
        await send("", {
            author: isEnabled,
            message: text,
            date: new Date(dateSelected),
        });
        setText("");
        refresh(dateSelected);
    }

    async function onDelete(id) {
        setSmallLoading(id);
        await send("/" + id, {}, "DELETE");
        await refresh(dateSelected);
        setSmallLoading("");
    }

    async function getMarked(month) {
        const date = month && moment([month.year, month.month - 1, month.day]);
        const rama = { key: "massage", color: "blue" };
        const jade = { key: "workout", color: "red" };
        let res = {};
        let start = moment(date).startOf("month").add(-6, "month");
        let marked = await get(
            '?q={"date":{"$gte":{"$date":"' +
                start.format("YYYY-MM-DD") +
                '"},"$lte":{"$date":"' +
                start.add(24, "month").format("YYYY-MM-DD") +
                '"}}}&h={"$groupby":["$DATE.YYYY-MM-DD:date", "author"]}',
        );
        Object.keys(marked).map(date => {
            let dots = [];
            let dates = Object.keys(marked[date]);
            if (dates.includes("Rama")) {
                dots.push(rama);
            }
            if (dates.includes("Jade")) {
                dots.push(jade);
            }
            res[date] = { dots, activeOpacity: 0 };
        });
        setMarkedDates(res);
    }

    async function refresh(day) {
        let notes;
        if (!day) {
            day = dateSelected;
        }
        if (dateSelected) {
            notes = await get(
                '?q={"date":{"$gte":{"$date":"' +
                    day +
                    '"},"$lt":{"$date":"' +
                    moment(day).add(1, "d").format("YYYY-MM-DD") +
                    '"}}}&h={"$orderby": {"date": -1}}',
            );
        }
        setNote(notes || []);
        setLoading(false);
        setRefreshing(false);
    }

    return (
        <View style={styles.container}>
            <Toast visible={visible} message="Message copié !" />
            <Calendar
                disableArrowLeft={refreshing}
                disableArrowRight={refreshing}
                hideExtraDays
                markingType={"multi-dot"}
                onMonthChange={month => {
                    let start = moment(month).startOf("month");
                    setDateSelected(start.format("YYYY-MM-DD"));
                    getMarked(month);
                }}
                onDayPress={day => {
                    setRefreshing(true);
                    setDateSelected(day.dateString);
                    refresh(day.dateString);
                }}
                onDayLongPress={day => {
                    setRefreshing(true);
                    setDateSelected(day.dateString);
                    refresh(day.dateString);
                }}
                markedDates={Object.assign({}, markedDates, {
                    [dateSelected]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedDotColor: "orange",
                    },
                })}
            />
            <View style={styles.switch}>
                <Text style={{ paddingLeft: 10 }}>Rama</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled === "Rama"}
                />
                <Text style={{ paddingRight: 10 }}>Jade</Text>
            </View>
            <View style={{ width }}>
                <TextInput
                    style={{ height: 40, paddingBottom: 10, paddingLeft: 20 }}
                    placeholder="Ecrivez votre note ici !"
                    onChangeText={text => setText(text)}
                    value={text}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <View />
                <Button
                    color="green"
                    title="Nouvelle note"
                    onPress={() => onNewNote()}
                    disabled={loading || refreshing}
                />
                <Button containerStyle={{ padding: "10px", flex: "auto" }} title="Envoyer une Notification" disabled />
                <View />
            </View>

            <SectionListBasics
                handle={handleButtonPress}
                refreshing={refreshing}
                setRefreshing={setRefreshing}
                refresh={refresh}
                smallLoading={smallLoading}
                sections={notes}
                onDelete={onDelete}
            />
        </View>
    );
}

function SectionListBasics(props) {
    var writeToClipboard = async value => {
        await Clipboard.setString(value);
        props.handle();
    };

    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, []);
    };
    var sections = groupBy(props.sections, "author");
    let data = Object.keys(sections).map(author => {
        return { title: author, data: sections[author].map(note => note) };
    });

    return (
        <SwipeListView
            refreshControl={props.refreshControl}
            useSectionList
            sections={data}
            keyExtractor={item => item._id}
            renderItem={({ item }) =>
                item._id === props.smallLoading ? (
                    <ActivityIndicator style={{ paddingBottom: 10 }} size="large" color="#0000ff" />
                ) : (
                    <View style={styles.rowFront}>
                        <Text style={styles.item}>{item.message}</Text>
                    </View>
                )
            }
            renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowBack}>
                    <Text>
                        <Ionicons size={18} name="heart" type="font-awesome" color="red" />
                    </Text>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => {
                            closeRow(rowMap, data.item._id);
                            writeToClipboard(data.item.message);
                        }}
                    >
                        <Ionicons name="clipboard" color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => {
                            closeRow(rowMap, data.item._id);
                            props.onDelete(data.item._id);
                        }}
                    >
                        <Ionicons name="trash" color="white" />
                    </TouchableOpacity>
                </View>
            )}
            renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title + " ( " + section.data.length + " )"}</Text>
            )}
            leftOpenValue={0}
            rightOpenValue={-100}
            previewRowKey={"0"}
            previewOpenValue={-30}
            previewOpenDelay={3000}
        />
    );
}

const styles = StyleSheet.create({
    switch: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
    },
    container: {
        flex: 1,
        paddingTop: 22,
        paddingBottom: 16,
        backgroundColor: "white",
    },
    sectionHeader: {
        paddingTop: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: "bold",
    },
    item: {
        justifyContent: "flex-start",
        padding: 8,
        fontSize: 16,
        minHeight: 44,
        maxWidth: "94%",
    },
    deleteItem: {
        overflow: "visible",
        alignSelf: "center",
    },
    backTextWhite: {
        color: "#FFF",
    },
    rowFront: {
        paddingBottom: 8,
        backgroundColor: "white",
        justifyContent: "flex-start",
        minHeight: 44,
    },
    rowBack: {
        alignItems: "center",
        backgroundColor: "white",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: "center",
        bottom: 0,
        justifyContent: "center",
        position: "absolute",
        top: 0,
        width: 50,
    },
    backRightBtnLeft: {
        backgroundColor: "#2962ff",
        right: 50,
    },
    backRightBtnRight: {
        backgroundColor: "#c51162",
        right: 0,
    },
});
