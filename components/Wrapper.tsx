import React, {ReactNode} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import Header from "./Header";
import Navbar from "./Navbar";

const Wrapper = (props: { navigation: any, children: ReactNode }) => {
    const navigation = props.navigation;

    return (
        <View style={styles.container}>
            <Header navigation={navigation}/>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.main}
            >
                {props.children}

            </ScrollView>

            <Navbar navigation={navigation}/>
        </View>
    );
};

export default Wrapper;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },
    main: {
        paddingHorizontal: "3%"
    }
})