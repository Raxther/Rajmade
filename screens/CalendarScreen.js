import * as React from "react";
import { StyleSheet, View } from "react-native";
import Calendar from "../components/Calendar";

export default function CalendarScreen() {
    return (
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Calendar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    contentContainer: {
        paddingTop: 15,
    },
});
