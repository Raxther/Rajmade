import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { formatMessage } from "../components/Calendar";
import { useAppContext } from "../context/UserContext";

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [newDate, setNewDate] = useState("");
    const { user, setUser } = useAppContext();

    const handleDeleteFavorite = async id => {
        await deleteFavorite(id);
        const updatedFavorites = favorites.filter(favorite => favorite.identifier !== id);
        setFavorites(updatedFavorites);
    };

    const deleteFavorite = async identifier => {
        const { data, error } = await supabase.from("likes").delete().eq("identifier", identifier);
    };

    const getData = async () => {
        let { data: messages, error } = await supabase
            .from("likes")
            .select(
                `
                identifier,
                note(*)
      `,
            )
            .eq("liked_by", user === "Rama" ? 1 : 2);
        setFavorites(
            messages
                .filter((obj, index, self) => {
                    return index === self.findIndex(o => o.note.message === obj.note.message);
                })
                .map((message, i) => {
                    return { ...message.note, identifier: message.identifier };
                }),
        );
    };
    useEffect(() => {
        getData();
    }, [user]);
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.leftContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.itemText}>{item.author === 2 ? "Jade" : "Rama"}</Text>
                    <Text style={styles.authorText}>{formatMessage(item.message)}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.dateText}>{item.date.split("T")[0]}</Text>
            </View>
            <TouchableOpacity style={styles.cross} onPress={() => handleDeleteFavorite(item.identifier)}>
                <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Favoris</Text>
                <View style={styles.switch}>
                    <Text style={{ paddingLeft: 10, color: "white" }}>Rama</Text>
                    <Switch
                        trackColor={{ false: "#ffaa68", true: "#25efdb" }}
                        thumbColor={user ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="white"
                        onValueChange={() => setUser(previousState => (previousState === "Jade" ? "Rama" : "Jade"))}
                        value={user === "Rama"}
                    />
                    <Text style={{ paddingRight: 10, color: "white" }}>Jade</Text>
                </View>
                <TouchableOpacity onPress={getData}>
                    <Ionicons name="refresh" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={item => item.identifier}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    switch: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#0D1821",
        padding: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    listContainer: {
        flexGrow: 1,
        marginTop: 20,
    },
    item: {
        backgroundColor: "#344966",
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    cross: {
        right: -5,
        top: -35,
    },
    textContainer: {
        flexDirection: "column",
        width: "88%",
    },
    itemText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#D671AD",
        marginBottom: 5,
    },
    authorText: {
        fontSize: 14,
        color: "#fff",
        flex: 1, // This line makes sure the text takes up the maximum available width
        flexWrap: "wrap",
        flexShrink: 1,
    },
    rightContainer: {
        alignItems: "flex-end",
    },
    dateText: {
        fontSize: 12,
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    input: {
        flex: 1,
        backgroundColor: "#1c1c1c",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: "#1db954",
        padding: 10,
        borderRadius: 10,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default FavoriteScreen;
