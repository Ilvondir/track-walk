import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Header from "../components/Header";

const Home = ({navigation}: any) => {
    return (
        <View>
            <Header navigation={navigation}/>

            <Text>Dupa</Text>

            <TouchableOpacity
                style={{margin: 100}}
                onPress={() => navigation.navigate("Test")}
            >
                <Text>Przejdź</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;