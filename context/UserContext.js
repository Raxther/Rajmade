import { useState, useContext } from "react";
import { Clipboard, StyleSheet, ToastAndroid } from "react-native";
import { supabase } from "../utils/api";

import React from "react";
import ExplodingHeart from "../components/ExplodingHeart/ExplodingHeart";

export const AppStateContext = React.createContext();

export const AppStateProvider = props => {
    const [visibleFav, setVisibleFav] = useState(false);
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState("Jade");

    let lastTap = null;

    const writeToClipboard = async value => {
        await Clipboard.setString(value);
        setVisible(true);
        setVisible(false);
    };

    const likeNote = async value => {
        const { data, error } = await supabase.from("likes").upsert(
            {
                liked_by: user === "Rama" ? 1 : 2,
                note: value.id,
                identifier: value.id + (user === "Rama" ? 1 : 2),
            },
            { onConflict: ["identifier"] },
        );
        setVisibleFav(true);
        setTimeout(() => setVisibleFav(false), 1500);
    };

    const handleDoubleTap = item => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
            likeNote(item);
        } else {
            lastTap = now;
        }
    };

    const Toast = props => {
        if (props.visible) {
            ToastAndroid.showWithGravityAndOffset(props.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
            return null;
        }
        return null;
    };

    const contextValue = { handleDoubleTap, likeNote, writeToClipboard, visible, visibleFav, user, setUser };

    return (
        <AppStateContext.Provider value={contextValue}>
            {props.children}
            <ExplodingHeart status={visibleFav} containerStyle={styles.heart} width={visibleFav ? 200 : 0} />
            <Toast visible={visible} message="Message copié !" />
            <Toast visible={visibleFav} message="Ajouté au favoris" />
        </AppStateContext.Provider>
    );
};

export function useAppContext() {
    return useContext(AppStateContext);
}

const styles = StyleSheet.create({
    heart: {
        position: "absolute",
        top: "40%",
        left: "25%",
        zIndex: 9999,
    },
});
