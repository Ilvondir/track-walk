import React, {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Wrapper from "../components/Wrapper";
import * as SQLite from 'expo-sqlite';
import {Point} from "../models/Point";
import MapView, {Polyline} from "react-native-maps";
import {Activity} from "../models/Activity";
import {reformatDate, speed, timeBetween} from "../commons/commons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faClockFour, faRoad, faTachometerAltFast, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useRoute} from "@react-navigation/native";
import TrackFirstActivity from "../components/TrackFirstActivity";
import * as LocalAuthentication from "expo-local-authentication";

let activs: Activity[] = [];
let handleActivs: any[] = [];

const Home = ({navigation}: any) => {
    const db = SQLite.openDatabase("trackwalk");
    const route = useRoute();
    const [refresh, setRefresh] = useState(false as boolean);
    const [activities, setActivities] = useState([] as any[]);


    useEffect(() => {
        // @ts-ignore
        if (route.params?.add !== undefined) {
            setActivities([]);
            setRefresh(!refresh);
        }
        // @ts-ignore
    }, [route.params?.add]);


    useEffect(() => {

        // db.transaction((tx: any) => {
        //     tx.executeSql("DROP TABLE points");
        // });
        //
        // db.transaction((tx: any) => {
        //     tx.executeSql("DROP TABLE activities");
        // });

        db.transaction((tx: any) => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, end TEXT, distance INTEGER)");
        });

        db.transaction((tx: any) => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT, num INTEGER, longitude REAL, latitude REAL, activity_id INTEGER, FOREIGN KEY(activity_id) REFERENCES activities(id))")
        });

        db.transaction((tx: any) => {
            tx.executeSql("SELECT * FROM activities ORDER BY id desc",
                [],
                (txObj: any, resultSet: any) => {
                    activs = resultSet.rows._array

                    const fetchPointsForActivities = async () => {
                        for (const a of activs) {
                            const points = await new Promise((resolve, reject) => {
                                db.transaction((tx: any) => {
                                    tx.executeSql("SELECT * FROM points WHERE activity_id=? ORDER BY num ASC",
                                        [a.id],
                                        (txObj: any, resultSet: any) => {
                                            resolve(resultSet.rows._array);
                                        },
                                        (txObj: any, error: any) => {
                                            reject(error);
                                        });
                                });
                            });

                            handleActivs.push({
                                id: a.id,
                                start: a.start,
                                end: a.end,
                                distance: a.distance,
                                points: points as Point[]
                            });
                        }

                        setActivities(handleActivs);
                        activs = [];
                        handleActivs = []
                    };

                    fetchPointsForActivities().then(r => r);

                },
                (txObj: any, error: any) => console.error([error, txObj]));
        });

    }, [refresh]);

    const remove = (id: number) => {

        Alert.alert(
            'Confirm your decision',
            'Are you sure you want to delete this activity?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {

                        LocalAuthentication.isEnrolledAsync()
                            .then(check => {

                                if (check) {

                                    LocalAuthentication.authenticateAsync({promptMessage: "Please authenticate first."})
                                        .then(res => {

                                            if (res.success) {
                                                db.transaction((tx: any) => {
                                                    tx.executeSql("DELETE FROM points WHERE activity_id=?", [id]);
                                                });
                                                db.transaction((tx: any) => {
                                                    tx.executeSql("DELETE FROM activities WHERE id=?", [id]);
                                                });

                                                setActivities([]);
                                                setRefresh(!refresh);
                                            }
                                        })
                                        .catch(err => console.error(err))

                                } else {

                                    db.transaction((tx: any) => {
                                        tx.executeSql("DELETE FROM points WHERE activity_id=?", [id]);
                                    });
                                    db.transaction((tx: any) => {
                                        tx.executeSql("DELETE FROM activities WHERE id=?", [id]);
                                    });

                                    setActivities([]);
                                    setRefresh(!refresh);
                                }


                            })
                            .catch(err => console.error(err));
                    },
                    style: 'destructive',
                }
            ],
        );
    }

    return (
        <Wrapper navigation={navigation} title={"Home"}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: "3%"}}
            >

                <View style={styles.root}>
                    <Image
                        style={styles.story}
                        source={require("../resources/img/home.png")}
                    />
                    <Text style={styles.header}>Home</Text>
                    <Text>Here you can see all your activities!</Text>
                </View>

                {activities.length == 0 &&
                    <TrackFirstActivity navigation={navigation}/>
                }

                {activities.map((a: {
                    id: number,
                    start: string,
                    end: string,
                    distance: number,
                    points: Point[]
                }, i: number) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            style={styles.window}
                            activeOpacity={1}
                            onPress={() => navigation.navigate("Map", {show: a.id, add: Math.random()})}
                        >

                            <View style={styles.window_section}>
                                <View>
                                    <Text style={styles.headText}>#{i + 1}</Text>
                                    <Text>{a.start}</Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.remove_button}
                                    onPress={() => remove(a.id)}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} size={25}
                                                     style={{color: "#AAA", marginRight: "2%"}}/>
                                </TouchableOpacity>
                            </View>

                            <MapView
                                style={styles.map}
                                zoomEnabled={false}
                                zoomControlEnabled={false}
                                zoomTapEnabled={false}
                                scrollEnabled={false}
                                rotateEnabled={false}
                                initialRegion={{
                                    latitude: (Math.max(...a.points.map((p: Point) => p.latitude)) + Math.min(...a.points.map((p: Point) => p.latitude))) / 2,
                                    longitude: (Math.max(...a.points.map((p: Point) => p.longitude)) + Math.min(...a.points.map((p: Point) => p.longitude))) / 2,
                                    latitudeDelta: (Math.max(...a.points.map((p: Point) => p.latitude)) - Math.min(...a.points.map((p: Point) => p.latitude))) * 1.4,
                                    longitudeDelta: (Math.max(...a.points.map((p: Point) => p.longitude)) - Math.min(...a.points.map((p: Point) => p.longitude))) * 1.4,
                                }}
                            >
                                <Polyline
                                    key={i}
                                    coordinates={a.points.map((p: Point) => ({
                                        latitude: p.latitude,
                                        longitude: p.longitude,
                                    }))}
                                    strokeWidth={2}
                                    strokeColor={"#FF474C"}
                                    strokeColors={["#FF474C"]}
                                />

                            </MapView>

                            <View style={[styles.window_section, {flexDirection: "row"}]}>

                                <View style={styles.column}>
                                    <FontAwesomeIcon icon={faRoad} size={20} style={{color: "#FF474C"}}/>
                                    {a.distance < 1000 &&
                                        <Text style={styles.column_text}>
                                            {a.distance.toFixed(2)} m
                                        </Text>
                                    }

                                    {a.distance >= 1000 &&
                                        <Text style={styles.column_text}>
                                            {(a.distance / 1000).toFixed(2)} km
                                        </Text>
                                    }
                                </View>

                                <View style={styles.column}>
                                    <FontAwesomeIcon icon={faClockFour} size={20} style={{color: "#FF474C"}}/>
                                    <Text style={styles.column_text}>
                                        {timeBetween(Date.parse(reformatDate(a.end)) - Date.parse(reformatDate(a.start)))}
                                    </Text>
                                </View>

                                <View style={styles.column}>
                                    <FontAwesomeIcon icon={faTachometerAltFast} size={20} style={{color: "#FF474C"}}/>
                                    <Text style={styles.column_text}>
                                        {speed(a).toFixed(2)} km/h
                                    </Text>
                                </View>

                            </View>

                        </TouchableOpacity>
                    )
                })}


            </ScrollView>
        </Wrapper>
    );
};

export default Home;


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
    window: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "white",
        marginBottom: "3%",
        elevation: 1
    },
    window_section: {
        width: "100%",
        height: "20%",
        padding: "2%",
        flexDirection: "row"
    },
    map: {
        width: "100%",
        height: "60%"
    },
    headText: {
        fontWeight: "700",
        color: "#FF474C",
        fontSize: 24
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
    remove_button: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto"
    }
})