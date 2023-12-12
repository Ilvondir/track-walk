import React, {useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {Activity} from "../models/Activity";
import * as SQLite from "expo-sqlite";
import TrackFirstActivity from "../components/TrackFirstActivity";
import {bestTime, meanTime, reformatDate, sumTime, timeBetween} from "../commons/commons";
import {BarChart} from "react-native-gifted-charts";


let activs: Activity[] = [];

const Stats = ({navigation}: any) => {
    const db = SQLite.openDatabase("trackwalk");
    const [activities, setActivities] = useState([] as Activity[]);
    const [sumDistance, setSumDistance] = useState(0);
    const [times, setTimes] = useState([] as string[]);
    const [chartPoints, setChartPoints] = useState([] as any[])

    const fetchDataFromDatabase = () => {
        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    "SELECT * FROM activities ORDER BY id ASC",
                    null,
                    (txObj: any, resultSet: any) => {
                        activs = resultSet.rows._array;

                        setActivities(activs);

                        let d = 0;
                        let tab = [] as string[];
                        let points = [] as any[];

                        activs.map((a: Activity, i: number) => {
                            d += a.distance;

                            let time = "";
                            time = timeBetween(Date.parse(reformatDate(a.end)) - Date.parse(reformatDate(a.start)));
                            tab.push(time);

                            setTimes(tab);

                            let point = {
                                value: a.distance / 1000,
                                topLabelComponent: () => (
                                    <Text style={{
                                        fontSize: 12,
                                    }}>{(a.distance / 1000).toFixed(2)}</Text>
                                ),
                            };
                            points.push(point);
                        });

                        setSumDistance(d);
                        setChartPoints(points);

                        activs = [];
                    },
                    (txObj: any, err: any) => console.error(err)
                );
            }
        );
    };

    useEffect(() => {
        fetchDataFromDatabase();
    }, []);

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
                    <Text>Here you can see metrics describing your activities!</Text>
                </View>

                {activities.length == 0 &&
                    <TrackFirstActivity navigation={navigation}/>
                }

                {activities.length > 0 &&
                    <>
                        <View style={styles.section}>

                            <View style={styles.span}>
                                <Text style={styles.info}>Total activities: </Text>
                                <Text style={styles.result}>{activities.length}</Text>
                            </View>

                        </View>

                        <View style={styles.section}>

                            <View style={styles.span}>
                                <Text style={styles.info}>Total time: </Text>
                                <Text style={styles.result}>{sumTime(times)}</Text>
                            </View>

                            <View style={styles.span}>
                                <Text style={styles.info}>Best time: </Text>
                                <Text
                                    style={styles.result}>
                                    {bestTime(times)}
                                </Text>
                            </View>

                            <View style={styles.span}>
                                <Text style={styles.info}>Average time: </Text>
                                <Text
                                    style={styles.result}>
                                    {meanTime(times)}
                                </Text>
                            </View>

                        </View>

                        <View style={styles.section}>

                            <View style={styles.span}>
                                <Text style={styles.info}>Total distance: </Text>
                                <Text style={styles.result}>
                                    {(sumDistance / 1000).toFixed(2)} km
                                </Text>
                            </View>

                            <View style={styles.span}>
                                <Text style={styles.info}>Best distance: </Text>
                                <Text
                                    style={styles.result}>
                                    {(Math.max(...activities.map((a: Activity) => a.distance)) / 1000).toFixed(2)} km
                                </Text>
                            </View>

                            <View style={styles.span}>
                                <Text style={styles.info}>Average distance: </Text>
                                <Text
                                    style={styles.result}>
                                    {((sumDistance / 1000) / activities.length).toFixed(2)} km
                                </Text>
                            </View>

                        </View>

                        <View style={[styles.section, {paddingTop: "3%"}]}>
                            <Text>Distance (km)</Text>
                            <BarChart
                                data={chartPoints}
                                showFractionalValues
                                showYAxisIndices
                                frontColor={'#FF474C'}
                                barWidth={25}
                                initialSpacing={5}
                                spacing={5}
                                maxValue={1.1 * Math.max(...chartPoints.map((p: any) => p.value))}
                                noOfSections={8}
                                width={270}
                            />

                        </View>
                    </>
                }


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
    section: {
        width: "100%",
        backgroundColor: "white",
        elevation: 1,
        marginBottom: "3%",
        paddingHorizontal: "3%",
        paddingVertical: "2%"
    },
    span: {
        flexDirection: "row",
        marginVertical: "1%"
    },
    info: {
        fontWeight: "700",
        alignSelf: "center"
    },
    result: {
        color: "#FF474C",
        fontWeight: "700",
        fontSize: 35,
        marginLeft: "1%"
    }
})