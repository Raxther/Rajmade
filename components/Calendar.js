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
    TouchableHighlight,
    Clipboard,
    ScrollView,
} from "react-native";
import { supabase, getDayData } from "../utils/api";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment/moment";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/UserContext";

export const formatMessage = item => item.split("\\n").join("\n");

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

const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
};

const theme = {
    backgroundColor: "#2d4150",
    calendarBackground: "#2d4150",
    textSectionTitleColor: "#b6c1cd",
    monthTextColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#00adf5",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#00adf5",
    dayTextColor: "#b6c1cd",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    disabledArrowColor: "#d9e1e8",
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
};

export default function Notes() {
    const defaultNotes = [];
    const { user: isEnabled, setUser: setIsEnabled, visible, visibleFav } = useAppContext();
    const [markedDates, setMarkedDates] = useState({});
    const [dateSelected, setDateSelected] = useState(moment().format("YYYY-MM-DD"));
    const [text, setText] = useState("");
    const [notes, setNote] = useState(defaultNotes);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    const [smallLoading, setSmallLoading] = useState("");
    const toggleSwitch = () => {
        setIsEnabled(previousState => (previousState === "Jade" ? "Rama" : "Jade"));
    };
    const [width, setWidth] = useState("99%");

    const getData = async (start = new Date().toISOString()) => {
        let { data: messages, error } = await supabase
            .from("messages")
            .select(
                `
            message,
            date,
            id,
            author (
              name
            )
      `,
            )
            .order("date", { ascending: false })
            .lte("date", start);

        return { data: messages, error };
    };

    useEffect(() => {
        getMarked();
        refresh();
        const timer = setTimeout(() => {
            setWidth("auto");
        }, 100);
        return () => clearTimeout(timer);
    }, [width]);

    async function onNewNote() {
        setLoading(true);
        await supabase.from("messages").insert([
            {
                author: isEnabled === "Rama" ? 1 : 2,
                message: text,
                date: new Date(dateSelected),
            },
        ]);
        setText("");
        refresh(dateSelected);
    }

    async function onDelete(id) {
        setSmallLoading(id);
        await supabase.from("messages").delete().eq("id", id);
        await refresh(dateSelected);
        setSmallLoading("");
    }

    const formatDate = dateString => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    async function getMarked(month) {
        const date = month && moment([month.year, month.month - 1, month.day]);
        const rama = { key: "massage", color: "#25efdb" };
        const jade = { key: "workout", color: "#ffaa68" };
        let res = {};
        let start = moment(date).startOf("month").add(2, "month").format("YYYY-MM-DD");
        const { data: messages, error } = await getData(month ? start : undefined);
        const marked = (messages || []).reduce((acc, curr) => {
            const date = formatDate(curr.date);
            const authorName = curr.author.name;
            if (!acc[date]) {
                acc[date] = {};
            }
            if (!acc[date][authorName]) {
                acc[date][authorName] = [];
            }
            acc[date][authorName].push(curr);
            return acc;
        }, {});
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
            const { data: messages } = await getDayData(day);
            notes = messages;
        }
        setNote(notes || []);
        setLoading(false);
        setRefreshing(false);
    }

    return (
        <ScrollView style={styles.container}>
            <Calendar
                disableArrowLeft={refreshing}
                disableArrowRight={refreshing}
                theme={theme}
                hideExtraDays
                markingType={"multi-dot"}
                onMonthChange={async month => {
                    setRefreshing(true);
                    let start = moment(month).startOf("month");
                    setDateSelected(start.format("YYYY-MM-DD"));
                    await getMarked(month);
                    setRefreshing(false);
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
                <Text style={{ paddingLeft: 10, color: "white" }}>Rama</Text>
                <Switch
                    trackColor={{ false: "#ffaa68", true: "#25efdb" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="white"
                    onValueChange={toggleSwitch}
                    value={isEnabled === "Rama"}
                />
                <Text style={{ paddingRight: 10, color: "white" }}>Jade</Text>
            </View>
            <View style={{ width }}>
                <TextInput
                    style={{
                        height: 40,
                        paddingBottom: 10,
                        paddingLeft: 20,
                        color: "white",
                    }}
                    placeholder="Ecrivez votre note ici !"
                    placeholderTextColor="#F4F3F4FF"
                    onChangeText={text => setText(text)}
                    value={text}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                    color="green"
                    title="Nouvelle note"
                    onPress={() => onNewNote()}
                    disabled={loading || refreshing || !text}
                />
            </View>
            <View style={{ paddingBottom: 40 }}>
                <SectionListBasics
                    refreshing={refreshing}
                    setRefreshing={setRefreshing}
                    refresh={refresh}
                    smallLoading={smallLoading}
                    sections={notes}
                    onDelete={onDelete}
                />
            </View>
        </ScrollView>
    );
}

function SectionListBasics(props) {
    const {
        user: isEnabled,
        setUser: setIsEnabled,
        handleDoubleTap,
        likeNote,
        writeToClipboard,
        visible,
        visibleFav,
    } = useAppContext();

    var groupBy = function (xs, key, sub) {
        return xs.reduce(function (rv, x) {
            (rv[x[key][sub]] = rv[x[key][sub]] || []).push(x);
            return rv;
        }, []);
    };
    const sections = groupBy(props.sections, "author", "name");

    let data = Object.keys(sections).map((author, i) => {
        return { title: author, data: sections[author].map(note => note) };
    });

    return (
        <SwipeListView
            refreshControl={props.refreshControl}
            useSectionList
            sections={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
                item.id === props.smallLoading ? (
                    <ActivityIndicator style={{ paddingBottom: 10 }} size="large" color="#0000ff" />
                ) : (
                    <TouchableHighlight
                        onPress={() => handleDoubleTap(item)}
                        onLongPress={() => {
                            writeToClipboard(formatMessage(item.message));
                        }}
                    >
                        <View style={styles.rowFront}>
                            <Text style={styles.item}>{formatMessage(item.message)}</Text>
                        </View>
                    </TouchableHighlight>
                )
            }
            renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowBack}>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => {
                            closeRow(rowMap, data.item.id);
                            writeToClipboard(formatMessage(data.item.message));
                        }}
                    >
                        <Ionicons name="clipboard" color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => {
                            closeRow(rowMap, data.item.id);
                            props.onDelete(data.item.id);
                        }}
                    >
                        <Ionicons name="trash" color="white" />
                    </TouchableOpacity>
                    <Text>
                        <Ionicons size={18} name="heart" type="font-awesome" color="red" />
                    </Text>
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
        alignItems: "center",
    },
    container: {
        flex: 1,
        paddingTop: 22,
        paddingBottom: 16,
        backgroundColor: "#2d4150",
    },
    sectionHeader: {
        paddingTop: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
    },
    item: {
        justifyContent: "flex-start",
        padding: 8,
        fontSize: 16,
        minHeight: 44,
        maxWidth: "94%",
        color: "white",
    },
    deleteItem: {
        overflow: "visible",
        alignSelf: "center",
    },
    backTextWhite: {
        color: "#2d4150",
    },
    rowFront: {
        paddingBottom: 8,
        backgroundColor: "#2d4150",
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
    heart: {
        position: "absolute",
        top: "40%",
        left: "25%",
        zIndex: 9999,
    },
});
