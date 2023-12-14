import React, {useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Activity} from "../models/Activity";
import * as SQLite from "expo-sqlite";
import TrackFirstActivity from "../components/TrackFirstActivity";
import {
    bestActivity,
    bestTime,
    getMilis,
    meanTime,
    reformatDate,
    speed,
    sumTime,
    timeBetween,
    timeToChart
} from "../commons/commons";
import {BarChart} from "react-native-gifted-charts";
import MapView, {Polyline} from "react-native-maps";
import {Point} from "../models/Point";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faClockFour, faRoad, faTachometerAltFast} from "@fortawesome/free-solid-svg-icons";


let activs: Activity[] = [];

const Stats = ({navigation}: any) => {
    const db = SQLite.openDatabase("trackwalk");
    const [activities, setActivities] = useState([] as Activity[]);
    const [sumDistance, setSumDistance] = useState(0);
    const [times, setTimes] = useState([] as string[]);
    const [distanceChartPoints, setDistanceChartPoints] = useState([] as any[]);
    const [timeChartPoints, setTimeChartPoints] = useState([] as any[]);
    const [a, setA] = useState({} as any);

    const fetchDataFromDatabase = () => {
        db.transaction(
            (tx: any) => {
                tx.executeSql(
                    "SELECT * FROM activities ORDER BY id ASC",
                    [],
                    (txObj: any, resultSet: any) => {
                        activs = resultSet.rows._array;

                        setActivities(activs);

                        let d = 0;
                        let tab = [] as string[];
                        let distancePoints = [] as any[];
                        let timePoints = [] as any[];

                        activs.map((a: Activity) => {
                            d += a.distance;

                            let time = "";
                            time = timeBetween(Date.parse(reformatDate(a.end)) - Date.parse(reformatDate(a.start)));
                            tab.push(time);

                            setTimes(tab);

                            let timePoint = {
                                value: getMilis(time),
                                topLabelComponent: () => (
                                    <Text style={{
                                        fontSize: 8,
                                    }}>{timeToChart(time)}</Text>
                                ),
                            }

                            let distPoint = {
                                value: a.distance / 1000,
                                topLabelComponent: () => (
                                    <Text style={{
                                        fontSize: 10,
                                    }}>{(a.distance / 1000).toFixed(2)}</Text>
                                ),
                            };
                            distancePoints.push(distPoint);
                            timePoints.push(timePoint);
                        });

                        setSumDistance(d);
                        setDistanceChartPoints(distancePoints);
                        setTimeChartPoints(timePoints);

                        bestActivity(activs)
                            .then((result: any) => {
                                console.log(result);
                                setA(result);
                            })
                            .catch((error: any) => {
                                console.error(error);
                            });

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
        <Wrapper navigation={navigation} title={"Statistics"}>
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

                        <TouchableOpacity
                            style={styles.window}
                            activeOpacity={1}
                            onPress={() => navigation.navigate("Map", {show: a.id, add: Math.random()})}
                        >

                            <View style={styles.window_section}>
                                <View>
                                    <Text style={styles.headText}>Best activity</Text>
                                    <Text>{a.start}</Text>
                                </View>
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

                        <View style={styles.section}>

                            <View style={styles.span}>
                                <Text style={styles.info}>Total time:</Text>
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

                        <View style={[styles.section, {paddingTop: "3%"}]}>
                            <Text>Time (MM:SS)</Text>
                            <BarChart
                                data={timeChartPoints}
                                frontColor={'#FF474C'}
                                barWidth={25}
                                initialSpacing={5}
                                spacing={5}
                                maxValue={1.1 * Math.max(...timeChartPoints.map((p: any) => p.value))}
                                noOfSections={6}
                                width={270}
                                scrollToEnd={true}
                                isAnimated={true}
                                hideYAxisText={true}
                            />

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
                                data={distanceChartPoints}
                                showFractionalValues={true}
                                frontColor={'#FF474C'}
                                barWidth={25}
                                initialSpacing={5}
                                spacing={5}
                                maxValue={1.1 * Math.max(...distanceChartPoints.map((p: any) => p.value))}
                                noOfSections={6}
                                width={270}
                                scrollToEnd={true}
                                isAnimated={true}
                                hideYAxisText={true}
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
    }
})