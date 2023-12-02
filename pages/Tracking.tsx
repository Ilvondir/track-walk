import React, {useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {StyleSheet, Text, View} from "react-native";
import MapView from "react-native-maps";
import * as Location from 'expo-location'
import {Marker} from "../models/Marker";

const Tracking = ({navigation}: any) => {
    const [currentPosition, setCurrentPosition] = useState({} as any)
    const [markers, setMarkers] = useState([] as Marker[])

    useEffect(() => {

        Location.requestForegroundPermissionsAsync()
            .then(suc => {

                Location.watchPositionAsync({
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000
                }, (loc) => {
                    setCurrentPosition(loc.coords as any);
                })
                    .then(() => {
                    })
                    .catch(err => console.error(err))

            })

    }, []);

    return (
        <Wrapper navigation={navigation}>

            <View
                style={{height: "79.1%"}}
            >

                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                >
                    {markers.map((m: Marker) => {
                        return (
                            <Marker
                                coordinate={{
                                    latitude: 37.78825,
                                    longitude: -122.4324
                                }}
                            />
                        );
                    })}
                </MapView>

                <Text>{currentPosition?.altitude} x {currentPosition?.latitude}</Text>


            </View>

        </Wrapper>
    );
};

export default Tracking;

const styles = StyleSheet.create({
    map: {
        width: "100%",
        aspectRatio: 1
    }
});