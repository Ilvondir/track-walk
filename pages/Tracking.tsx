import React, {useEffect, useRef, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from 'expo-location'
import {Point} from "../models/Point";
import {Activity} from "../models/Activity";
import * as SQLite from 'expo-sqlite';
import {ResultSet} from 'expo-sqlite';

const Tracking = ({navigation}: any) => {
    const map = useRef<MapView>(null);
    const [activ, setActiv] = useState(new Activity() as Activity);
    const [currentPosition, setCurrentPosition] = useState({} as any);
    const [markers, setMarkers] = useState([] as Point[]);
    const [lastMarker, setLastMarker] = useState(new Point() as Point);
    const [position, setPosition] = useState(1 as number);
    const [inWork, setInWork] = useState(false as boolean);

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .then(suc => {
            })

    }, []);


    const start = () => {

        Location.requestForegroundPermissionsAsync()
            .then(suc2 => {

                Location.getCurrentPositionAsync()
                    .then(suc => {
                        // console.log(suc);
                        setCurrentPosition(suc.coords);

                        if (map.current)
                            map.current.animateToRegion({
                                latitudeDelta: .009, longitudeDelta: .009,
                                latitude: suc.coords.latitude,
                                longitude: suc.coords.longitude
                            });

                        const first = new Point(0, position, suc.coords.longitude, suc.coords.latitude, 0);
                        const activity = new Activity(0, new Date().toISOString(), "");

                        setActiv(activity);
                        setInWork(true);
                        setLastMarker(first);
                        setMarkers([first]);
                        markers.map((p: any) => console.log(p.position))
                        setPosition(position + 1);

                        Location.watchPositionAsync({
                            accuracy: Location.Accuracy.High
                        }, (loc) => {
                            // console.log(loc);

                            const dist = distance(loc.coords, lastMarker);

                            console.log(dist);

                            if (dist > 10) {
                                const nP = new Point(0, position, loc.coords.longitude, loc.coords.latitude, 0);

                                setPosition(position + 1);
                                setMarkers([...markers, nP])
                                setLastMarker(nP);
                            }

                            setCurrentPosition(loc.coords as any);

                        })
                            .then(() => {
                            })
                            .catch(err => console.error(err))
                    })
            })
    }

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
        const distance = (earthRadius * c) * 1000;

        return distance;
    }

    const stop = () => {
        setInWork(false);

        markers.push(new Point(0, position, currentPosition.longitude, currentPosition.latitude, 0));

        const db = SQLite.openDatabase("trackwalk");

        let id = 0 as any;

        db.transaction((tx: any) => {
            tx.executeSql("INSERT INTO activities (start, end) VALUES (?, ?)",
                [activ.start, new Date().toISOString()],
                (txObj: any, resultSet: ResultSet) => {
                    id = resultSet.insertId
                },
                (txObj: any, error: any) => console.error(error)
            );
        });

        db.transaction((tx: any) => {
            markers.map((m: Point) => {
                tx.executeSql("INSERT INTO markers (position, latitude, longitude, activity_id) VALUES (?, ?, ?, ?)",
                    [m.position, m.latitude, m.longitude, id],
                    (txObj: any, resultSet: ResultSet) => console.log(resultSet),
                    (txObj: any, error: any) => console.error(error)
                );
            });
        });

        setPosition(1);
        setMarkers([]);
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
                    {markers.map((p: Point) => {
                        return (
                            <Marker
                                key={p.position}
                                coordinate={{
                                    latitude: p.latitude,
                                    longitude: p.longitude
                                }}
                                title={String(p.position)}
                            />
                        );
                    })}
                </MapView>
                <Text>{currentPosition.latitude} x {currentPosition.longitude}</Text>

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