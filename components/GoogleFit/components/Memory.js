import React from "react";
import { Text, TouchableHighlight, View } from "react-native";
import moment from "moment/moment";
import { formatMessage } from "../../Calendar";
import { useAppContext } from "../../../context/UserContext";

const Memory = props => {
    const { name, description } = props;
    const { handleDoubleTap, writeToClipboard } = useAppContext();
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
                <Text
                    style={{
                        color: "#e6e7ec",
                        fontSize: 20,
                        fontWeight: "500",
                        marginBottom: 5,
                    }}
                >
                    {name + " ( le " + moment(description[0].date).format("DD/MM") + " )"}
                </Text>
                {description.map(note => {
                    return (
                        <TouchableHighlight
                            key={note.id}
                            onPress={() => handleDoubleTap(note)}
                            onLongPress={() => {
                                writeToClipboard(formatMessage(note.message));
                            }}
                        >
                            <Text style={{ color: "#9a9ba1", fontSize: 15, marginBottom: 20 }}>
                                {formatMessage(note.message) + " ( " + note.author.name + " )"}
                            </Text>
                        </TouchableHighlight>
                    );
                })}
            </View>
        </View>
    );
};

export default Memory;
