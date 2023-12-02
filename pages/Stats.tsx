import React from 'react';
import Wrapper from "../components/Wrapper";
import {ScrollView, Text} from "react-native";

const Stats = ({navigation}: any) => {
    return (
        <Wrapper navigation={navigation}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: "3%"}}
            >
                <Text>Stats</Text>
            </ScrollView>


        </Wrapper>
    );
};

export default Stats;