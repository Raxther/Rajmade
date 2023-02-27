import React, { useRef } from "react";
import { View, Dimensions, Animated } from "react-native";
import * as d3Shape from "d3-shape";
import randomColor from "randomcolor";
import Svg, { G, Text, TSpan, Path } from "react-native-svg";
import { PanGestureHandler, State } from "react-native-gesture-handler";
const { width } = Dimensions.get("screen");
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const oneTurn = 360;
const knobFill = randomColor({ hue: "purple" });

const numberOfsegment = characters.length;
const makeWheel = () => {
    const data = Array.from({ length: numberOfsegment }).fill(1);
    const arcs = d3Shape.pie()(data);

    return arcs.map((arc, index) => {
        const instance = d3Shape
            .arc()
            .padAngle(0.01)
            .outerRadius(width / 2)
            .innerRadius(20);

        return {
            path: instance(arc),
            value: Math.round(Math.random() * 10 + 1) % 200,
            centroid: instance.centroid(arc),
        };
    });
};

export default function Wheel(props) {
    let wheel = makeWheel();
    const angle = useRef(new Animated.Value(0)).current;

    let onPan = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            const { velocityY, absoluteX } = nativeEvent;
            let direction = -1;
            if (absoluteX > width / 2) {
                direction = 1;
            }
            Animated.decay(angle, {
                velocity: (direction * velocityY * (Math.random() + 1)) / 2000,
                deceleration: 0.999,
                useNativeDriver: true,
            }).start();
        }
    };

    let renderKnob = () => {
        const knobSize = 30;
        // [0, numberOfSegments]
        const YOLO = Animated.modulo(
            Animated.divide(
                Animated.modulo(Animated.add(angle, -(360 / (numberOfsegment * 2))), -oneTurn),
                new Animated.Value(360 / numberOfsegment),
            ),
            -1,
        );

        return (
            <Animated.View
                style={{
                    width: knobSize,
                    height: knobSize * 2,
                    justifyContent: "flex-end",
                    zIndex: 1,
                    transform: [
                        {
                            rotate: YOLO.interpolate({
                                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                                outputRange: ["0deg", "0deg", "35deg", "-35deg", "0deg", "0deg"],
                            }),
                        },
                    ],
                }}
            >
                <Svg
                    width={knobSize}
                    height={(knobSize * 100) / 57}
                    viewBox={`0 0 57 100`}
                    style={{ transform: [{ translateY: 8 }] }}
                >
                    <Path
                        d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
                        fill={knobFill}
                    />
                </Svg>
            </Animated.View>
        );
    };

    let renderSvgWheel = () => {
        return (
            <View
                style={{
                    alignItems: "center",
                }}
            >
                {renderKnob()}
                <Animated.View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        transform: [
                            {
                                rotate: angle.interpolate({
                                    inputRange: [-oneTurn, 0, oneTurn],
                                    outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
                                }),
                            },
                        ],
                    }}
                >
                    <Svg
                        width={width * 0.9}
                        height={width * 0.9}
                        viewBox={`0 0 ${width} ${width}`}
                        style={{
                            transform: [{ rotate: `-${360 / (numberOfsegment * 2)}deg` }],
                        }}
                    >
                        <G y={width / 2} x={width / 2}>
                            {wheel.map((arc, i) => {
                                const [x, y] = arc.centroid;

                                return (
                                    <G key={"arc" + i} origin={`${x}, ${y}`}>
                                        <Path d={arc.path} fill={randomColor()} />
                                        <G
                                            originX={x}
                                            originY={y}
                                            rotation={i * (360 / numberOfsegment) + 360 / (numberOfsegment * 2)}
                                        >
                                            <Text x={x} y={y - 56} fill="white" textAnchor="middle">
                                                <TSpan x={x} dy={5}>
                                                    {characters[i]}
                                                </TSpan>
                                            </Text>
                                        </G>
                                    </G>
                                );
                            })}
                        </G>
                    </Svg>
                </Animated.View>
            </View>
        );
    };

    return (
        <PanGestureHandler onHandlerStateChange={onPan}>
            <View>{renderSvgWheel()}</View>
        </PanGestureHandler>
    );
}
