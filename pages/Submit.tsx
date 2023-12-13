import React, {useEffect} from 'react';
import Wrapper from "../components/Wrapper";
import {Image, StyleSheet, Text, TouchableOpacity, Vibration, View} from "react-native";
import {useRoute} from "@react-navigation/native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faClockFour,
    faHourglassEnd,
    faHourglassStart,
    faRoad,
    faTachometerAltFast
} from "@fortawesome/free-solid-svg-icons";
import {reformatDate, speed, timeBetween} from "../commons/commons";
import {Activity} from "../models/Activity";

const Submit = ({navigation}: any) => {
    const route = useRoute();
    // @ts-ignore
    let {dist = 0, start = '', end = ''} = route?.params;

    useEffect(() => {
        Vibration.vibrate(0.6 * 1000);
    }, []);

    return (
        <Wrapper navigation={navigation} title={"Overview"}>
            <View
                style={{height: "79.1%", paddingHorizontal: "3%"}}
            >


                <View style={styles.root}>
                    <Image
                        style={styles.story}
                        source={require("../resources/img/submit.png")}
                    />

                    <Text style={styles.h1}>
                        You recorded next activity!
                    </Text>

                    <View style={styles.window_section}>
                        <View style={styles.couple}>
                            <FontAwesomeIcon icon={faHourglassStart} size={20} style={{color: "#FF474C"}}/>
                            <Text style={styles.column_text}>
                                {start.slice(12, 20)}
                            </Text>
                        </View>

                        <View style={styles.couple}>
                            <FontAwesomeIcon icon={faHourglassEnd} size={20} style={{color: "#FF474C"}}/>
                            <Text style={styles.column_text}>
                                {end.slice(12, 20)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.window_section}>

                        <View style={styles.column}>
                            <FontAwesomeIcon icon={faRoad} size={20} style={{color: "#FF474C"}}/>
                            {dist < 1000 &&
                                <Text style={styles.column_text}>
                                    {dist.toFixed(2)} m
                                </Text>
                            }

                            {dist >= 1000 &&
                                <Text style={styles.column_text}>
                                    {(dist / 1000).toFixed(2)} km
                                </Text>
                            }
                        </View>

                        <View style={styles.column}>
                            <FontAwesomeIcon icon={faClockFour} size={20} style={{color: "#FF474C"}}/>
                            <Text style={styles.column_text}>
                                {timeBetween(Date.parse(reformatDate(end)) - Date.parse(reformatDate(start)))}
                            </Text>
                        </View>

                        <View style={styles.column}>
                            <FontAwesomeIcon icon={faTachometerAltFast} size={20} style={{color: "#FF474C"}}/>
                            <Text style={styles.column_text}>
                                {speed(new Activity(0, start, end, dist)).toFixed(2)} km/h
                            </Text>
                        </View>

                    </View>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={styles.button}
                        onPress={() => navigation.navigate("Home", {add: Math.random()})}
                    >
                        <Text style={styles.btext}>
                            Go to home
                        </Text>
                    </TouchableOpacity>

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
        marginVertical: "10%",
        textAlign: "center"
    },
    window_section: {
        width: "100%",
        padding: "2%",
        flexDirection: "row"
    },
    couple: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
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
    },
    button: {
        backgroundColor: "#FF474C",
        padding: "3%",
        width: "50%",
        marginStart: "auto",
        marginEnd: "auto",
        borderRadius: 15,
        marginTop: "7%",
        marginBottom: "2%"
    },
    btext: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        fontWeight: "700"
    }
})