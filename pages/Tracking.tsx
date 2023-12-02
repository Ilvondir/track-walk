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
    let sub = null as any;

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .then(suc => {
            })

    }, []);


    const start = () => {

        Location.requestForegroundPermissionsAsync()
            .then(suc => {

                Location.getCurrentPositionAsync()
                    .then(suc => {
                        console.log(suc);
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
                        setMarkers([...markers, first] as Point[]);
                        setPosition(position + 1);

                        sub = Location.watchPositionAsync({
                            accuracy: Location.Accuracy.High,
                            timeInterval: 3000
                        }, (loc) => {
                            setCurrentPosition(loc.coords as any);


                        })
                            .then(() => {
                            })
                            .catch(err => console.error(err))
                    })
            })
    }


    const stop = () => {
        setInWork(false);

        setMarkers([...markers, new Point(0, position, currentPosition.longitude, currentPosition.latitude, 0)]);

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