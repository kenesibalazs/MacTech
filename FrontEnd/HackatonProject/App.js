import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './Screens/LoginScreen';
import MainScreen from './Screens/MainScreen';
import BasicGameLevelOne from './Screens/basicGameLevelOne';
import GameScreen from './Screens/MainScreen';
import PlayScreen from './Screens/PlayScreen'; // Import PlayScreen component
import LeaderboardScreen from './Screens/LeaderBoardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}  />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="BasicGameLevelOne" component={BasicGameLevelOne} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        {/* Ensure that PlayScreen is included within the component prop of a Screen */}
        <Stack.Screen name="PlayScreen" component={PlayScreen} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
