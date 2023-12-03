import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faChartBar, faHome, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {useRoute} from "@react-navigation/native";

const Navbar = (props: { navigation: any }) => {
    const navigation = props.navigation;
    const route = useRoute();

    return (
        <View style={styles.navbar}>

            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.link, route.name == "Home" ? {opacity: 1} : {opacity: 0.7}]}
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
                style={[styles.link, route.name == "Stats" ? {opacity: 1} : {opacity: 0.7}]}
                onPress={() => navigation.navigate("Stats")}
            >
                <FontAwesomeIcon
                    style={styles.text}
                    icon={faChartBar}
                    size={20}
                />

                <Text style={[styles.text, {marginTop: "2%"}]}>
                    Stats
                </Text>

            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.link, route.name == ("Tracking" || "Submit") ? {opacity: 1} : {opacity: 0.7}]}
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
        width: "33.3%",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
    },
    text: {
        color: "white",
        fontSize: 16
    }
})