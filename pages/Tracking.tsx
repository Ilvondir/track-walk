import React, {useEffect, useRef, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MapView, {Polyline} from "react-native-maps";
import * as Location from 'expo-location'
import {Point} from "../models/Point";
import {Activity} from "../models/Activity";
import * as SQLite from 'expo-sqlite';

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

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .catch(() => navigation.navigate("Home"));

    }, []);


    const start = () => {

        Location.requestForegroundPermissionsAsync()
            .then(() => {

                Location.getCurrentPositionAsync()
                    .then(suc => {

                        // console.log(suc);
                        currentPosition = suc.coords;

                        if (map.current)
                            map.current.animateToRegion({
                                latitudeDelta: .009, longitudeDelta: .009,
                                latitude: suc.coords.latitude,
                                longitude: suc.coords.longitude
                            });

                        const first = new Point(0, pointNum, suc.coords.longitude, suc.coords.latitude, 0);
                        activ.start = new Date().toLocaleString('en-US', {timeZone: "Europe/Warsaw", hour12: false})

                        lastMarker = first;
                        handleMarkers.push(first);
                        handleMarkers2.push(first);
                        setMarkers(handleMarkers);

                        handleInWork = true;
                        setInWork(true);
                        pointNum++;

                        Location.watchPositionAsync({
                            accuracy: Location.Accuracy.BestForNavigation
                        }, (loc) => {
                            // console.log(loc);

                            if (handleInWork) {
                                const dist = distance(loc.coords, lastMarker);

                                console.log(dist);

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
                                console.log(currentPosition);
                            }

                        })
                            .then(() => {
                            })
                            .catch(err => console.error(err))
                    })
            })
    }

    const stop = () => {

        handleInWork = false
        setInWork(false);

        const last = new Point(0, pointNum, currentPosition.longitude, currentPosition.latitude, 0);

        sumDistance += distance(currentPosition, last);

        handleMarkers.push(last);
        handleMarkers2.push(last);
        setMarkers(handleMarkers);

        const db = SQLite.openDatabase("trackwalk");

        let id = 0 as any;

        db.transaction((tx: any) => {
            tx.executeSql("INSERT INTO activities (start, end, distance) VALUES (?, ?, ?)",
                [activ.start,
                    new Date().toLocaleString('en-US', {
                        timeZone: "Europe/Warsaw",
                        hour12: false
                    }), sumDistance],
                (txObj: any, resultSet: any) => {
                    id = resultSet.insertId
                },
                (txObj: any, error: any) => console.error(error)
            );
        });

        handleMarkers2.forEach((m: Point) => {
            db.transaction((tx: any) => {
                tx.executeSql("INSERT INTO points (num, latitude, longitude, activity_id) VALUES (?, ?, ?, ?)",
                    [m.num, m.latitude, m.longitude, id],
                    (txObj: any, resultSet: any) => console.log(resultSet),
                    (txObj: any, error: any) => console.error(error)
                );
            });
        });


        pointNum = 1;
        setMarkers([]);
        handleMarkers = [];
    }


    return (
        <Wrapper navigation={navigation}>

            <View
                style={{height: "79.1%"}}
            >

                <MapView
                    ref={map}
                    style={styles.map}
                    showsUserLocation={true}
                >
                    {markers.map((p: Point, i: number) => {
                        if (i > 0) {
                            const prevPoint = markers[i - 1];
                            return (
                                <Polyline
                                    key={i}
                                    coordinates={[
                                        {
                                            latitude: prevPoint.latitude,
                                            longitude: prevPoint.longitude,
                                        },
                                        {
                                            latitude: p.latitude,
                                            longitude: p.longitude,
                                        },
                                    ]}
                                    strokeWidth={2}
                                    strokeColor={"#FF474C"}
                                    strokeColors={["#FF474C"]}
                                />
                            );
                        }
                    })}
                </MapView>

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

        </Wrapper>
    );
};

export default Tracking;

const distance = (m1: any, m2: Point) => {
    let lat1 = m1.latitude;
    let lon1 = m1.longitude
    let lat2 = m2.latitude;
    let lon2 = m2.longitude;
    const earthRadius = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (earthRadius * c) * 1000;
}

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
        borderRadius: 15,
        marginTop: "3%"
    },
    btext: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        fontWeight: "700"
    }
});