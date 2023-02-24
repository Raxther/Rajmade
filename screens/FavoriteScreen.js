import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { formatMessage } from "../components/Calendar";

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([
        {
            id: "1",
            name: "J'aime beaucoup les pizzas c'est un truc de ouf j'adore",
            author: "John Doe",
            date: "2023-02-24",
        },
        { id: "2", name: "Ice cream", author: "Jane Smith", date: "2023-02-22" },
        { id: "3", name: "Tacos", author: "Bob Johnson", date: "2023-02-20" },
        { id: "4", name: "Sushi", author: "Alice Lee", date: "2023-02-18" },
    ]);
    const [newFavorite, setNewFavorite] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newDate, setNewDate] = useState("");

    const handleAddFavorite = () => {
        if (newFavorite !== "" && newAuthor !== "" && newDate !== "") {
            const newId = favorites.length + 1;
            const newFavoriteItem = {
                id: newId.toString(),
                name: newFavorite,
                author: newAuthor,
                date: newDate,
            };
            setFavorites([...favorites, newFavoriteItem]);
            setNewFavorite("");
            setNewAuthor("");
            setNewDate("");
        }
    };

    const handleDeleteFavorite = id => {
        const updatedFavorites = favorites.filter(favorite => favorite.id !== id);
        setFavorites(updatedFavorites);
    };

    const getData = async () => {
        let { data: messages, error } = await supabase.from("likes").select(
            `
            note(*)
      `,
        );
        setFavorites(
            messages
                .filter((obj, index, self) => {
                    return index === self.findIndex(o => o.note.message === obj.note.message);
                })
                .map((message, i) => {
                    return { ...message.note, id: i };
                }),
        );
    };
    useEffect(() => {
        getData();
    }, []);
    console.log(favorites);
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleDeleteFavorite(item.id)}>
            <View style={styles.leftContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.itemText}>{item.author === 2 ? "Jade" : "Rama"}</Text>
                    <Text style={styles.authorText}>{formatMessage(item.message)}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.dateText}>{item.date.split("T")[0]}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Favoris</Text>
                <TouchableOpacity onPress={getData}>
                    <Ionicons name="refresh" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#282828",
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
        backgroundColor: "#1c1c1c",
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
    textContainer: {
        flexDirection: "column",
        width: "88%",
    },
    itemText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
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
