import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

const TrackFirstActivity = (props: { navigation: any }) => {
    const navigation = props.navigation;

    return (
        <View style={styles.notif}>
            <Text>You don't have any activities yet. Track the first one!</Text>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={() => navigation.navigate("Tracking")}
            >
                <Text style={styles.btext}>Track</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TrackFirstActivity;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FF474C",
        padding: "3%",
        width: "50%",
        marginStart: "auto",
        marginEnd: "auto",
        marginBottom: "3%",
        marginTop: "5%",
        borderRadius: 15
    },
    btext: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        fontWeight: "700"
    },
    notif: {
        width: "100%",
        backgroundColor: "white",
        elevation: 1,
        marginTop: "3%",
        marginBottom: "3%",
        paddingTop: "3%",
        paddingHorizontal: "3%"
    }
});