import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "./pages/Home";
import Tracking from "./pages/Tracking";
import Stats from "./pages/Stats";
import Submit from "./pages/Submit";
import Map from "./pages/Map";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{headerShown: false}}
            >
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="Stats" component={Stats}/>
                <Stack.Screen name="Tracking" component={Tracking}/>
                <Stack.Screen name="Map" component={Map}/>
                <Stack.Screen name="Submit" component={Submit}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;