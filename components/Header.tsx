import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faLightbulb} from "@fortawesome/free-solid-svg-icons";
import {Camera, FlashMode} from "expo-camera";

const Header = (props: { navigation: any }) => {
    const navigation = props.navigation;
    const [flashlight, setFlashlight] = useState(false as boolean);


    const handleFlash = () => {
        Camera.requestCameraPermissionsAsync()
            .then(suc => {
                console.log(suc);
                setFlashlight(!flashlight);
                console.log(!flashlight)
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
                TrackWalk
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
                    style={{width: 1, height: 1, position: "absolute"}}
                    flashMode={FlashMode.torch}
                />
            }


        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#FF474C",
        height: "15%",
        paddingHorizontal: 15,
        marginTop: 37,
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
        fontSize: 23,
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