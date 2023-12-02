import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHome, faStopwatch} from "@fortawesome/free-solid-svg-icons";

const Navbar = (props: { navigation: any }) => {
    const navigation = props.navigation;

    return (
        <View style={styles.navbar}>

            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.link}
                onPress={() => navigation.navigate("Home")}
            >
                <FontAwesomeIcon
                    style={styles.text}
                    icon={faHome}
                    size={20}
                />

                <Text style={[styles.text, {marginTop: "2%"}]}>
                    Home
                </Text>

            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.link}
                onPress={() => navigation.navigate("Tracking")}
            >
                <FontAwesomeIcon
                    icon={faStopwatch}
                    size={20}
                    style={styles.text}
                />

                <Text style={[styles.text, {marginTop: "2%"}]}>
                    Tracking
                </Text>

            </TouchableOpacity>


        </View>
    );
};

export default Navbar;

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#FF474C",
        height: "8%",
        flexDirection: "row",
    },
    link: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
    },
    text: {
        color: "white",
        fontSize: 16
    }
})