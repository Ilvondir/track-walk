import React, {useEffect, useRef, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {StyleSheet} from "react-native";
import MapView, {Polyline} from "react-native-maps";
import * as Location from "expo-location";
import {Activity} from "../models/Activity";
import {Point} from "../models/Point";
import * as SQLite from "expo-sqlite";
import {useRoute} from "@react-navigation/native";

let activs: Activity[] = [];

const Map = ({navigation}: any) => {
    const mapRef = useRef<MapView>(null);
    const db = SQLite.openDatabase("trackwalk");
    const [refresh, setRefresh] = useState(false as boolean);
    const [activities, setActivities] = useState([] as {
        id: number,
        start: string,
        end: string,
        distance: number,
        points: Point[]
    }[]);
    const route = useRoute();
    const [show, setShow] = useState(-1 as number);

    useEffect(() => {
        // @ts-ignore
        if (route.params?.add !== undefined) {
            setActivities([]);
            // @ts-ignore
            setShow(route.params?.show);
            setRefresh(!refresh);
        }
        // @ts-ignore
    }, [route.params?.add]);

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .then(() => {

                Location.getCurrentPositionAsync()
                    .then((loc: any) => {
                        if (mapRef.current)
                            mapRef.current.animateToRegion({
                                latitudeDelta: .03, longitudeDelta: .03,
                                latitude: loc.coords.latitude,
                                longitude: loc.coords.longitude
                            });
                    });

            });

        db.transaction((tx: any) => {
            tx.executeSql("SELECT * FROM activities ORDER BY id DESC",
                null,
                async (txObj: any, resultSet: any) => {
                    activs = resultSet.rows._array;

                    const fetchPointsForActivities = async () => {
                        const activitiesData = [];

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

                            activitiesData.push({
                                id: a.id,
                                start: a.start,
                                end: a.end,
                                distance: a.distance,
                                points: points as Point[]
                            });
                        }

                        setActivities(activitiesData);
                    };

                    fetchPointsForActivities().then(r => r);
                },
                (txObj: any, error: any) => console.error([error, txObj]));
        });
    }, [refresh]);

    return (
        <Wrapper navigation={navigation} title={"Map"}>
            <MapView
                ref={mapRef}
                style={styles.map}
            >
                {activities.map((a: any, i: number) => (
                    <Polyline
                        key={i}
                        coordinates={a.points.map((p: Point) => ({
                            latitude: p.latitude,
                            longitude: p.longitude,
                        }))}
                        strokeWidth={2}
                        strokeColor={a.id === show ? "#75B758FF" : "#FF474C50"}
                    />
                ))}
            </MapView>
        </Wrapper>
    );
};

export default Map;

const styles = StyleSheet.create({
    map: {
        height: "79.3%",
    }
})