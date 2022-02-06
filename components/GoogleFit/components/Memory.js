import React from "react";
import { Text, View } from "react-native";
import moment from "moment/moment";

const Memory = props => {
    const { name, description } = props;
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
                        <Text key={note.message} style={{ color: "#9a9ba1", fontSize: 15, marginBottom: 20 }}>
                            {note.message + " (" + note.author + " )"}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
};

export default Memory;
