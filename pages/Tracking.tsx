import React, {useEffect, useRef, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import MapView, {Polyline} from "react-native-maps";
import * as Location from 'expo-location'
import {LocationSubscription} from 'expo-location'
import {Point} from "../models/Point";
import {Activity} from "../models/Activity";
import * as SQLite from 'expo-sqlite';
import {distance, getNow, reformatDate, speed, timeBetween} from "../commons/commons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faClockFour, faRoad, faTachometerAltFast} from "@fortawesome/free-solid-svg-icons";

let activ: Activity = new Activity();
let currentPosition: any = {};
let sumDistance = 0;
let lastMarker: Point = new Point();
let pointNum = 1;
let handleMarkers: Point[] = [];
let handleMarkers2: Point[] = [];
let handleInWork = false;

const Tracking = ({navigation}: any) => {
    const map = useRef<MapView>(null);
    const [markers, setMarkers] = useState([] as Point[]);
    const [inWork, setInWork] = useState(false as boolean);
    const [now, setNow] = useState(getNow() as string);
    let intervalID: any;

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .then(res => {

                if (!res.granted) {
                    ToastAndroid.showWithGravity(
                        "App doesn't have permissions to do that.",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                    navigation.navigate("Home", {add: Math.random()});
                } else {

                    Location.getCurrentPositionAsync()
                        .then((loc: any) => {
                            if (map.current)
                                map.current.animateToRegion({
                                    latitudeDelta: .009, longitudeDelta: .009,
                                    latitude: loc.coords.latitude,
                                    longitude: loc.coords.longitude
                                });
                        });

                }

            })
            .catch(() => navigation.navigate("Home", {add: Math.random()}));

    }, []);

    const setNewNow = () => {
        setNow(getNow());
    }

    const start = () => {

        sumDistance = 0;
        handleMarkers = [];
        handleMarkers2 = [];

        Location.requestForegroundPermissionsAsync()
            .then(res => {

                if (!res.granted) {
                    ToastAndroid.showWithGravity(
                        "App doesn't have permissions to do that.",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                    navigation.navigate("Home", {add: Math.random()})
                } else {

                    Location.getCurrentPositionAsync()
                        .then(suc => {

                            currentPosition = suc.coords;

                            if (map.current)
                                map.current.animateToRegion({
                                    latitudeDelta: .009, longitudeDelta: .009,
                                    latitude: suc.coords.latitude,
                                    longitude: suc.coords.longitude
                                });

                            const first = new Point(0, pointNum, suc.coords.longitude, suc.coords.latitude, 0);
                            activ.start = getNow();

                            setNewNow();
                            intervalID = setInterval(() => setNewNow(), 1000);

                            lastMarker = first;
                            handleMarkers.push(first);
                            handleMarkers2.push(first);
                            setMarkers(handleMarkers);

                            setInWork(true);
                            handleInWork = true;
                            pointNum++;

                            Location.watchPositionAsync({
                                accuracy: Location.Accuracy.BestForNavigation
                            }, (loc) => {

                                const dist = distance(loc.coords, lastMarker);

                                if (dist > 10) {
                                    const nP = new Point(0, pointNum, loc.coords.longitude, loc.coords.latitude, 0);

                                    sumDistance += dist;

                                    pointNum++;
                                    handleMarkers.push(nP);
                                    handleMarkers2.push(nP);
                                    setMarkers([...handleMarkers]);
                                    lastMarker = nP;
                                }

                                currentPosition = loc.coords as any;

                            })
                                .then(res => {
                                    let id: any;

                                    id = setInterval(() => removeSub(res, id), 5000)
                                });
                        })
                }
            })
            .catch(() => navigation.navigate("Home", {add: Math.random()}));
    }

    const removeSub = (res: LocationSubscription, id: any) => {
        if (!handleInWork) {
            clearInterval(id)
            res.remove();
        }
    }

    const stop = () => {

        clearInterval(intervalID);

        setInWork(false);
        handleInWork = false;

        const last = new Point(0, pointNum, currentPosition.longitude, currentPosition.latitude, 0);

        sumDistance += distance(lastMarker, last);

        handleMarkers.push(last);
        handleMarkers2.push(last);
        setMarkers(handleMarkers);

        const db = SQLite.openDatabase("trackwalk");

        let id = 0 as any;

        db.transaction((tx: any) => {
            tx.executeSql("INSERT INTO activities (start, end, distance) VALUES (?, ?, ?)",
                [activ.start, getNow(), sumDistance],
                (txObj: any, resultSet: any) => {
                    id = resultSet.insertId
                },
                (txObj: any, error: any) => console.error(error)
            );
        });

        handleMarkers2.forEach((m: Point) => {
            db.transaction((tx: any) => {
                tx.executeSql("INSERT INTO points (num, latitude, longitude, activity_id) VALUES (?, ?, ?, ?)",
                    [m.num, m.latitude, m.longitude, id]
                );
            });
        });


        pointNum = 1;
        setMarkers([]);

        navigation.navigate("Submit", {
            dist: sumDistance,
            start: activ.start,
            end: getNow()
        });
    }


    return (
        <Wrapper navigation={navigation} title={"Tracking"}>

            <View
                style={{height: "79.3%"}}
            >

                <MapView
                    ref={map}
                    style={styles.map}
                    showsUserLocation={true}
                >
                    <Polyline
                        coordinates={markers.map((p: Point) => ({
                            latitude: p.latitude,
                            longitude: p.longitude,
                        }))}
                        strokeWidth={2}
                        strokeColor={"#FF474C"}
                        strokeColors={["#FF474C"]}
                    />
                </MapView>

                <View
                    style={{marginHorizontal: "3%"}}
                >

                    <View style={styles.window}>

                        <View style={[styles.window_section, {flexDirection: "row"}]}>

                            <View style={styles.column}>
                                <FontAwesomeIcon icon={faRoad} size={20} style={{color: "#FF474C"}}/>
                                {!inWork &&
                                    <Text style={styles.column_text}>
                                        {"0.00"} m
                                    </Text>
                                }

                                {sumDistance < 1000 && inWork &&
                                    <Text style={styles.column_text}>
                                        {sumDistance.toFixed(2)} m
                                    </Text>
                                }

                                {sumDistance >= 1000 && inWork &&
                                    <Text style={styles.column_text}>
                                        {(sumDistance / 1000).toFixed(2)} km
                                    </Text>
                                }
                            </View>

                            <View style={styles.column}>
                                <FontAwesomeIcon icon={faClockFour} size={20} style={{color: "#FF474C"}}/>
                                <Text style={styles.column_text}>
                                    {!inWork &&
                                        "00:00:00"
                                    }

                                    {inWork &&
                                        timeBetween(Date.parse(reformatDate(now)) - Date.parse(reformatDate(activ.start)))
                                    }
                                </Text>
                            </View>

                            <View style={styles.column}>
                                <FontAwesomeIcon
                                    icon={faTachometerAltFast}
                                    size={20}
                                    style={{color: "#FF474C"}}
                                />

                                <Text style={styles.column_text}>
                                    {inWork &&
                                        speed(new Activity(0, activ.start, now, sumDistance)).toFixed(2) + " km/h"
                                    }

                                    {!inWork &&
                                        "0.00 km/h"
                                    }
                                </Text>
                            </View>

                        </View>

                        {!inWork &&
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.button}
                                onPress={() => start()}
                            >
                                <Text style={styles.btext}>
                                    Start tracking
                                </Text>
                            </TouchableOpacity>
                        }

                        {inWork &&
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.button}
                                onPress={() => stop()}
                            >
                                <Text style={styles.btext}>
                                    Save activity
                                </Text>
                            </TouchableOpacity>
                        }

                    </View>

                </View>


            </View>

        </Wrapper>
    );
};

export default Tracking;

const styles = StyleSheet.create({
    map: {
        width: "100%",
        aspectRatio: 1
    },
    button: {
        backgroundColor: "#FF474C",
        padding: "3%",
        width: "50%",
        marginStart: "auto",
        marginEnd: "auto",
        marginBottom: "3%",
        marginTop: "3%",
        borderRadius: 15
    },
    btext: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        fontWeight: "700"
    },
    window: {
        width: "100%",
        backgroundColor: "white",
        elevation: 1,
        marginTop: "3%",
        marginBottom: "3%",
        paddingTop: "3%"
    },
    window_section: {
        width: "100%",
        padding: "2%",
        flexDirection: "row"
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
});