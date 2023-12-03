import React, {useEffect} from 'react';
import Wrapper from "../components/Wrapper";
import {Image, StyleSheet, Text, Vibration, View} from "react-native";

const Submit = ({navigation}: any) => {

    useEffect(() => {
        Vibration.vibrate(0.5 * 1000);
    }, []);

    return (
        <Wrapper navigation={navigation}>
            <View
                style={{height: "79.1%", paddingHorizontal: "3%"}}
            >


                <View style={styles.root}>
                    <Image
                        style={styles.story}
                        source={require("../resources/img/submit.png")}
                    />

                    <Text style={styles.h1}>
                        You record next activity!
                    </Text>
                </View>


            </View>
        </Wrapper>
    );
};

export default Submit;

const styles = StyleSheet.create({
    root: {
        width: "100%",
        backgroundColor: "white",
        marginTop: "3%",
        marginBottom: "3%",
        elevation: 1,
        padding: "3%"
    },
    story: {
        width: 250,
        height: 200,
        marginRight: "auto",
        marginLeft: "auto"
    },
    h1: {
        fontWeight: "700",
        color: "#FF474C",
        fontSize: 30,
        marginTop: "3%",
        textAlign: "center"
    },
    column: {
        width: "33.3%",
        alignItems: "center",
        justifyContent: "center"
    },
    column_text: {
        fontWeight: "700",
        fontSize: 18,
        marginTop: "3%"
    }
})