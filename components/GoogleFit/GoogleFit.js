import React from "react";
import { View, Dimensions, ScrollView, RefreshControl, TouchableHighlight, Text } from "react-native";
import FitImage from "./components/FitImage";
import FitHealthStat from "./components/FitHealthStat";
import AdditionalStats from "./components/AdditionalStats";
import Memory from "./components/Memory";

const { width } = Dimensions.get("screen");

const GoogleFit = props => {
    return (
        <ScrollView
            style={{ backgroundColor: "#1f2026" }}
            refreshControl={
                <RefreshControl
                    refreshing={props.loading}
                    onRefresh={() => {
                        props.refresh();
                    }}
                />
            }
        >
            {props.loading ? (
                <View style={{ paddingTop: 200 }}></View>
            ) : (
                <View>
                    <TouchableHighlight underlaycolor="transparent">
                        <FitImage data={props.data} />
                    </TouchableHighlight>
                </View>
            )}
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    marginLeft: width * 0.15,
                    marginRight: width * 0.15,
                    marginBottom: width * 0.05,
                }}
            >
                <FitHealthStat
                    iconBackgroundColor="#183b57"
                    iconColor="#0e8df2"
                    actual={props.data.totalRama}
                    over={"/" + props.data.total}
                    type="Rama"
                />
                <FitHealthStat
                    iconBackgroundColor="#124b41"
                    iconColor="#03ddb3"
                    actual={props.data.totalJade}
                    over={"/" + props.data.total}
                    type="Jade"
                />
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <AdditionalStats name="Note aléatoire" description={props.data.randomMessage[0]} />
            </View>
            {props.data.memories?.map(memory => {
                if(memory.messages?.length <= 0) return null
                return (<View key={memory.year} style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Memory name={`En ${memory.year}`} description={memory.messages} />
                </View>)
            })}
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Text
                    style={{
                        color: "#e6e7ec",
                        fontSize: 6,
                        fontWeight: "100",
                        marginBottom: 5,
                    }}
                >
                    v1.4.2
                </Text>
            </View>
        </ScrollView>
    );
};

export default GoogleFit;
