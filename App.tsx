import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import { Header, ThemeProvider } from "react-native-elements";
import { BottomNavigation } from "react-native-paper";
import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import StatsScreen from "./screens/StatsScreen";

export default function App() {
    const isLoadingComplete = useCachedResources();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "album", title: "Roue", icon: "ship-wheel", color: "#6200ee" },
        {
            key: "library",
            title: "Bloc note partagé",
            icon: "calendar-month",
            color: "#2962ff",
        },
        {
            key: "purchased",
            title: "Résumé",
            icon: "counter",
            color: "#c51162",
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
                        })}
                        sceneAnimationEnabled={false}
                    />
                </ThemeProvider>
            </SafeAreaProvider>
        );
    }
}
