import React from "react";
import { Text, TouchableHighlight, View } from "react-native";
import moment from "moment/moment";
import { formatMessage } from "../../Calendar";
import { useAppContext } from "../../../context/UserContext";

const AdditionalStats = props => {
    const { name, description, nodate } = props;
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
                    {name + (description && !nodate ? " ( le " + moment(description.date).format("DD/MM/YY") + " )" : "")}
                </Text>
                <TouchableHighlight
                    onPress={() => handleDoubleTap(description)}
                    onLongPress={() => {
                        writeToClipboard(formatMessage(description.message));
                    }}
                >
                    <Text style={{ color: "#9a9ba1", fontSize: 15, marginBottom: 20 }}>
                        {description && description.message ? description.message : "Chargement en cours ..."}
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default AdditionalStats;
