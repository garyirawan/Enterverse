import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message"; // Import Toast
import { FavoritesProvider } from "./components/FavoritesContext"; // Import FavoritesProvider
import LoginScreen from "./pages/LoginScreen"; // Import LoginScreen
import HomeScreen from "./pages/HomeScreen"; // Import HomeScreen
import MoviesScreen from "./pages/MoviesScreen";
import BooksScreen from "./pages/BooksScreen";
import GamesScreen from "./pages/GamesScreen";
import DetailScreen from "./pages/DetailScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MoviesScreen"
            component={MoviesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BooksScreen"
            component={BooksScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GamesScreen"
            component={GamesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailScreen"
            component={DetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <Toast /> {/* Add Toast at the root level */}
      </NavigationContainer>
    </FavoritesProvider>
  );
}
