import React, {ReactNode} from 'react';
import {StyleSheet, View} from "react-native";
import Header from "./Header";
import Navbar from "./Navbar";
import {StatusBar} from "expo-status-bar";

const Wrapper = (props: { navigation: any, children: ReactNode, title: string }) => {
    const navigation = props.navigation;

    return (
        <View style={styles.container}>
            <Header navigation={navigation} title={props.title}/>

            {props.children}

            <Navbar navigation={navigation}/>

            <StatusBar style={"dark"}/>
        </View>
    );
};

export default Wrapper;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxHeight: "100%",
        height: "100%",
        flexDirection: "column"
    }
})