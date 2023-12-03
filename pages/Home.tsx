import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Wrapper from "../components/Wrapper";
import * as SQLite from 'expo-sqlite';
import {Point} from "../models/Point";
import MapView, {Polyline} from "react-native-maps";
import {Activity} from "../models/Activity";
import {reformatDate, speed, timeBetween} from "../commons/commons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faClockFour, faRoad, faTachometerAltFast} from "@fortawesome/free-solid-svg-icons";

let activs: Activity[] = [];
let handleActivs: { id: number, start: string, end: string, distance: number, points: Point[] }[] = [];

const Home = ({navigation}: any) => {
    const db = SQLite.openDatabase("trackwalk");
    const [activities, setActivities] = useState([] as {
        id: number,
        start: string,
        end: string,
        distance: number,
        points: Point[]
    }[]);


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
                null,
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
                    };

                    fetchPointsForActivities();

                    console.log(activities);

                },
                (txObj: any, error: any) => console.error(error));
        });

    }, []);

    return (
        <Wrapper navigation={navigation}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: "3%"}}
            >
                <Text>Dupa</Text>

                {activities.map((a: {
                    id: number,
                    start: string,
                    end: string,
                    distance: number,
                    points: Point[]
                }, i: number) => {

                    let mLon = 0;
                    let mLat = 0;
                    let minLon = Math.min(...a.points.map((p: Point) => p.longitude));
                    let maxLon = Math.max(...a.points.map((p: Point) => p.longitude));
                    let minLat = Math.min(...a.points.map((p: Point) => p.latitude));
                    let maxLat = Math.max(...a.points.map((p: Point) => p.latitude));

                    a.points.map((p: Point) => {
                        mLat += p.latitude;
                        mLon += p.longitude;
                    })

                    mLon /= a.points.length;
                    mLat /= a.points.length;

                    return (
                        <View key={i} style={styles.window}>

                            <View style={styles.window_section}>
                                <Text style={styles.headText}>#{i + 1}</Text>
                                <Text>{a.start}</Text>
                            </View>

                            <MapView
                                style={styles.map}
                                zoomEnabled={false}
                                zoomControlEnabled={false}
                                zoomTapEnabled={false}
                                scrollEnabled={false}
                                rotateEnabled={false}
                                initialRegion={{
                                    latitude: mLat,
                                    longitude: mLon,
                                    latitudeDelta: (maxLat - minLat) * 1.4,
                                    longitudeDelta: (maxLon - minLon) * 1.4,
                                }}
                            >

                                {a.points.map((p: Point, j: number) => {
                                    if (j > 0) {
                                        const prevPoint = a.points[j - 1];
                                        return (
                                            <Polyline
                                                key={j}
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

                            <View style={[styles.window_section, {flexDirection: "row"}]}>

                                <View style={styles.column}>
                                    <FontAwesomeIcon icon={faRoad} size={20}/>
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
                                    <FontAwesomeIcon icon={faClockFour} size={20}/>
                                    <Text style={styles.column_text}>
                                        {timeBetween(Date.parse(reformatDate(a.end)) - Date.parse(reformatDate(a.start)))}
                                    </Text>
                                </View>

                                <View style={styles.column}>
                                    <FontAwesomeIcon icon={faTachometerAltFast} size={20}/>
                                    <Text style={styles.column_text}>
                                        {speed(a).toFixed(2)} km/h
                                    </Text>
                                </View>

                            </View>

                        </View>
                    )
                })}


            </ScrollView>
        </Wrapper>
    );
};

export default Home;


const styles = StyleSheet.create({
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
        padding: "2%"
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
    }
})