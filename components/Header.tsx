import React, {useState} from 'react';
import {StyleSheet, Text, ToastAndroid, TouchableOpacity, Vibration, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faLightbulb} from "@fortawesome/free-solid-svg-icons";
import {Camera, FlashMode} from "expo-camera";

const Header = (props: { navigation: any, title: string }) => {
    const navigation = props.navigation;
    const [flashlight, setFlashlight] = useState(false as boolean);


    const handleFlash = () => {
        Camera.requestCameraPermissionsAsync()
            .then(res => {

                if (!res.granted) {
                    ToastAndroid.showWithGravity(
                        "App doesn't have permissions to do that.",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                } else {
                    Vibration.vibrate(0.15 * 1000);
                    setFlashlight(!flashlight);
                }


            })
            .catch(err => {
                console.error(err);
            })
    }

    return (
        <View style={styles.header}>

            {navigation.canGoBack() &&

                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        style={[styles.icon, styles.back]}
                        size={30}
                    />
                </TouchableOpacity>

            }

            <Text
                style={styles.brand}
            >
                {props.title}
            </Text>

            <TouchableOpacity
                onPress={() => handleFlash()}
                activeOpacity={0.6}
                style={styles.bulb}
            >
                <FontAwesomeIcon
                    icon={faLightbulb}
                    style={styles.icon}
                    size={25}
                />
            </TouchableOpacity>

            {flashlight &&
                <Camera
                    style={{width: 1, height: 1, position: "absolute", top: -10}}
                    flashMode={flashlight ? FlashMode.torch : FlashMode.off}
                />
            }


        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#FF474C",
        height: "8%",
        paddingHorizontal: 15,
        marginTop: "10%",
        flexDirection: "row",
        width: "100%"
    },
    icon: {
        color: "white",
        marginTop: "auto",
        marginBottom: "auto"
    },
    brand: {
        color: "white",
        fontSize: 25,
        marginTop: "auto",
        marginBottom: "auto",
        fontWeight: "700"
    },
    bulb: {
        marginLeft: "auto"
    },
    back: {
        marginRight: 10,
    }
})