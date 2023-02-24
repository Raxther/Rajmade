import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import { Header, ThemeProvider } from "react-native-elements";
import { BottomNavigation } from "react-native-paper";
import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import StatsScreen from "./screens/StatsScreen";
import FavoriteScreen from "./screens/FavoriteScreen";

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
            color: "darkgreen",
        },
    ]);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
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
            </SafeAreaProvider>
        );
    }
}
