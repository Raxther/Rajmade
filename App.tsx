import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import { Header, ThemeProvider } from "react-native-elements";
import { BottomNavigation } from "react-native-paper";
import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import StatsScreen from "./screens/StatsScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import { AppStateProvider } from "./context/UserContext";
import { registerRootComponent } from "expo";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { supabase } from "./utils/api";

export default function App() {
    const isLoadingComplete = useCachedResources();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "album", title: "Roue", icon: "bullseye-arrow", color: "#6200ee" },
        {
            key: "library",
            title: "Bloc note partagé",
            icon: "calendar-month",
            color: "#2962ff",
        },
        {
            key: "purchased",
            title: "Résumé",
            icon: "history",
            color: "#c51162",
        },
        {
            key: "favorite",
            title: "Favoris",
            icon: "heart",
            color: "#D671AD",
        },
    ]);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: true,
        }),
    });

    async function getNotificationPermission() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (Constants.isDevice && status === "granted") {
            console.log("Notification permissions granted.");
        }
    }

    async function clearNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.dismissAllNotificationsAsync();
        console.log("Notification cleared.");
    }

    async function setNotification() {
        const { data: message, error } = await supabase
            .from("notification")
            .select(
                `
                message
      `,
            )
            .single();
        const trigger = new Date(Date.now() + 8 * 60 * 60 * 1000);
        trigger.setMinutes(0);
        trigger.setSeconds(0);

        Notifications.scheduleNotificationAsync({
            content: {
                title: message.message || "Viens ecrire une nouvelle note stp :)",
            },
            trigger,
        });
        console.log("Notification setted.");

    }

    getNotificationPermission();
    clearNotifications();
    setNotification();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <AppStateProvider>
                    <ThemeProvider>
                        <Header centerComponent={{ text: "RAJMADE", style: { color: "#fff" } }} />
                        <BottomNavigation
                            navigationState={{ index, routes }}
                            onIndexChange={index => setIndex(index)}
                            renderScene={BottomNavigation.SceneMap({
                                album: HomeScreen,
                                library: CalendarScreen,
                                purchased: StatsScreen,
                                favorite: FavoriteScreen,
                            })}
                            shifting={true}
                        />
                    </ThemeProvider>
                </AppStateProvider>
            </SafeAreaProvider>
        );
    }
}
