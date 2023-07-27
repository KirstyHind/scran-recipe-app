import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login'; // Import the Login component
import Register from './Register'; // Import the Register component
import HomeScreen from './HomeScreen'; // Import the HomeScreen component
import SearchResult from './SearchResult'; // Import the SearchResult component
import AddRecipe from './AddRecipe'; // Import the AddRecipe component
import Toolbar from './Toolbar'; // Import the Toolbar component
import firebase from './firebaseConfig'; // Import the firebaseConfig object
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import RecipeDetails from './RecipeDetails';

AppRegistry.registerComponent(appName, () => MainApp);

const Stack = createStackNavigator();

// Main component representing the whole app 
export default function MainApp() {
  return (
    // Wrap the app in the NavigationContainer to enable navigation
    <NavigationContainer>
      {/* Stack Navigator to handle screen navigation */}
      <Stack.Navigator>
        {/* Home - The first screen displayed */}
        <Stack.Screen
          name="Home" // Name for the screen 
          component={Home} // Component to be rendered
          options={{ headerShown: true }} // Customize the header options (in this case, show the header)
        />
        {/* Login Screen */}
        <Stack.Screen
          name="Login" // Name for the screen 
          component={Login} // Component to be rendered
          options={{ title: 'Login' }} // Customize the header title
        />
        {/* Register Screen */}
        <Stack.Screen
          name="Register" // Name for the screen 
          component={Register} // Component to be rendered
          options={{ title: 'Register' }} // Customize the header title
        />
        {/* HomeScreen */}
        <Stack.Screen
          name="HomeScreen" // Name for the screen 
          component={HomeScreen} // Component to be rendered
          options={{ title: 'Home' }} // Customize the header title
        />

        {/* SearchResult */}
        <Stack.Screen
          name="SearchResult" // Name for the screen 
          component={SearchResult} // Component to be rendered
          options={{ title: 'Search Results' }} // Customize the header title
        />

        {/* AddRecipe */}
        <Stack.Screen
          name="AddRecipe" // Name for the screen 
          component={AddRecipe} // Component to be rendered
          options={{ title: 'Add a Recipe' }} // Customize the header title
        />

        {/* RecipeDetails */}
        <Stack.Screen
          name="RecipeDetails" // Name for the screen 
          component={RecipeDetails} // Component to be rendered
          options={{ title: 'Recipe Details' }} // Customize the header title
        />

        {/* Toolbar */}
        <Stack.Screen
          name="Toolbar" // Name for the screen 
          component={Toolbar} // Component to be rendered
          options={{ title: 'Toolbar' }} // Customize the header title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home component that will be displayed initially
function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome to Scran Recipe App</Text>
      {/* Button to navigate to the Login screen */}
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      {/* Button to navigate to the Register screen */}
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
      {/* StatusBar component */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
