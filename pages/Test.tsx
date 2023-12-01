import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Header from "../components/Header";

const Test = ({navigation}: any) => {
    return (
        <View>
            <Header/>

            <Text>Dupa2</Text>

            <TouchableOpacity
                style={{margin: 100}}
                onPress={() => navigation.goBack()}
            >
                <Text>Powrót</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Test;