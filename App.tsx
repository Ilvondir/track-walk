import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./pages/Home";
import Test from "./pages/Test";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;