import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from "react-native";
import Wrapper from "../components/Wrapper";
import * as SQLite from 'expo-sqlite';


const Home = ({navigation}: any) => {
    const db = SQLite.openDatabase("trackwalk");
    const [result, setResult] = useState("" as any);

    useEffect(() => {
        db.transaction((tx: any) => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, start TEXT, end TEXT)",
                null,
                (txObj: any, resultSet: any) => console.log(resultSet),
                (txObj: any, error: any) => console.error(error)
            );
        });

        db.transaction((tx: any) => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS markers (id INTEGER PRIMARY KEY AUTOINCREMENT, position INTEGER, longtitude REAL, altitude REAL, acitivity_id INTEGER, FOREIGN KEY(acitivity_id) REFERENCES activities(id))",
                null,
                (txObj: any, resultSet: any) => console.log(resultSet),
                (txObj: any, error: any) => console.error(error));
        });
    }, []);

    return (
        <Wrapper navigation={navigation}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: "3%"}}
            >
                <Text>Dupa</Text>

                <Text>{result}</Text>

            </ScrollView>
        </Wrapper>
    );
};

export default Home;