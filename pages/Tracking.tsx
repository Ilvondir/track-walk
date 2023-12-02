import React, {useEffect, useRef, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from 'expo-location'
import {Point} from "../models/Point";
import {Activity} from "../models/Activity";

const Tracking = ({navigation}: any) => {
    const map = useRef<MapView>(null);
    const [activ, setActiv] = useState(new Activity() as Activity);
    const [currentPosition, setCurrentPosition] = useState({} as any);
    const [markers, setMarkers] = useState([] as Point[]);
    const [lastMarker, setLastMarker] = useState(new Point() as Point);
    const [position, setPosition] = useState(1 as number);

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .then(suc => {
            })

    }, []);

    const start = () => {

        Location.requestForegroundPermissionsAsync()
            .then(suc => {

                Location.watchPositionAsync({
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000
                }, (loc) => {
                    setCurrentPosition(loc.coords as any);
                    console.log(currentPosition);
                })
                    .then(() => {
                        if (map.current)
                            map.current.animateToRegion({
                                latitudeDelta: 1, longitudeDelta: 1,
                                latitude: lastMarker.latitude,
                                longitude: lastMarker.longtitude
                            });

                        const first = new Point(0, position, currentPosition.longitude, currentPosition.latitude, 0);
                        setLastMarker(first);
                        setMarkers([...markers, first] as Point[]);

                        setPosition(position + 1);
                    })
                    .catch(err => console.error(err))

            })
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
                    followsUserLocation={true}
                >
                    {markers.map((p: Point) => {
                        return (
                            <Marker
                                key={p.position}
                                coordinate={{
                                    latitude: p.latitude,
                                    longitude: p.longtitude
                                }}
                            />
                        );
                    })}
                </MapView>

                <Text>{currentPosition?.altitude} x {currentPosition?.latitude}</Text>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.button}
                    onPress={() => start()}
                >
                    <Text style={styles.btext}>
                        Start tracking
                    </Text>
                </TouchableOpacity>


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
        borderRadius: 15
    },
    btext: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        fontWeight: "700"
    }
});