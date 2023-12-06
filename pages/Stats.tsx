import React, {useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {Activity} from "../models/Activity";
import * as SQLite from "expo-sqlite";
import TrackFirstActivity from "../components/TrackFirstActivity";
import {reformatDate, sumTime, timeBetween} from "../commons/commons";
import {Area, Chart, Line, VerticalAxis} from "react-native-responsive-linechart";


let activs: Activity[] = [];

const Stats = ({navigation}: any) => {
    const db = SQLite.openDatabase("trackwalk");
    const [activities, setActivities] = useState([] as Activity[]);
    const [sumDistance, setSumDistance] = useState(0);
    const [times, setTimes] = useState([] as string[]);
    const [chartPoints, setChartPoints] = useState([] as {
        x: number,
        y: number
    }[])

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

                            let point = {x: i, y: a.distance};
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

                        {chartPoints.length >= 2 &&
                            <View style={[styles.section, {paddingVertical: "3%"}]}>

                                <Chart
                                    style={{height: 200, width: '100%', backgroundColor: 'white'}}
                                    xDomain={{min: 0, max: chartPoints.length - 1}}
                                    yDomain={{min: 0, max: 1.2 * Math.max(...chartPoints.map((a: any) => a.y))}}
                                    padding={{left: 35, bottom: 5, top: 5, right: 10}}
                                    data={chartPoints}
                                >
                                    <VerticalAxis
                                        tickCount={6}
                                        theme={{
                                            labels: {
                                                formatter: (v) => (v / 1000).toFixed(2),
                                            },
                                            ticks: {stroke: {color: '#AAAAAA', width: 1.4}},
                                        }}
                                    />

                                    <Area
                                        theme={{
                                            gradient: {
                                                from: {color: '#FF474C', opacity: 0.8},
                                                to: {color: '#FF474C', opacity: 0.2}
                                            }
                                        }}
                                    />

                                    <Line
                                        theme={{
                                            stroke: {color: '#FF474C', width: 2},
                                            scatter: {default: {width: 8, height: 8, rx: 10, color: '#FF474C'}}
                                        }}
                                    />
                                </Chart>

                            </View>
                        }
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