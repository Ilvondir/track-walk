import React from 'react';
import Wrapper from "../components/Wrapper";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";

const Stats = ({navigation}: any) => {
    return (
        <Wrapper navigation={navigation}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: "3%"}}
            >

                <View style={styles.root}>
                    <Image
                        style={styles.story}
                        source={require("../resources/img/stats.png")}
                    />
                    <Text style={styles.header}>Statistics</Text>
                    <Text>Here you can see rcharts describing your activities!</Text>
                </View>

            </ScrollView>
        </Wrapper>
    );
};

export default Stats;

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
    header: {
        color: "#FF474C",
        fontWeight: "700",
        fontSize: 25,
        marginBottom: "3%"
    },
})