import React, { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const ExplodingHeart = ({ onChange, status, width, containerStyle }) => {
    const [isFavorite, setFavorite] = useState(false);
    const [animation, setAnimation] = useState(null);

    useEffect(() => {
        animation?.play();
    }, [status, animation]);

    return (
        <View style={containerStyle}>
            <LottieView
                autoPlay={false}
                loop={true}
                resizeMode="contain"
                style={{ width }}
                ref={animation => setAnimation(animation)}
                source={require("./assets/heart.json")}
                onAnimationFinish={() => animation?.reset()}
            />
        </View>
    );
};

export default ExplodingHeart;

ExplodingHeart.propTypes = {
    onChange: PropTypes.func,
    containerStyle: PropTypes.object,
    status: PropTypes.bool,
    width: PropTypes.number,
};

ExplodingHeart.defaultProps = {
    status: false,
    onChange: null,
    width: 60,
    containerStyle: null,
};
