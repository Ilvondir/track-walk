import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

const Header = ({navigation}: any) => {
    return (
        <View style={styles.header}>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={styles.backArrow}
                    size={30}
                />
            </TouchableOpacity>

            <Text
                style={styles.brand}
            >
                TrackWalk
            </Text>


        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#FF474C",
        height: "15%",
        paddingHorizontal: 15,
        marginTop: 30,
        flexDirection: "row",
    },
    backArrow: {
        color: "white",
        marginTop: "auto",
        marginBottom: "auto"
    },
    brand: {
        color: "white",
        fontSize: 23,
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: 10,
        fontWeight: "700"
    }
})