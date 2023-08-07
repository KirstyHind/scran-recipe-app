// Import necessary packages and components
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import HomeScreen from './HomeScreen';
import SearchResult from './SearchResult';
import AddRecipe from './AddRecipe';
import Toolbar from './Toolbar';
import firebase from './firebaseConfig';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import RecipeDetails from './RecipeDetails';
import SavedRecipes from './SavedRecipes';
import Settings from './Settings';
import PreloadImages from './PreloadImages';


// Register the MainApp component as the main application component
AppRegistry.registerComponent(appName, () => MainApp);

// Create a stack navigator object for navigation
const Stack = createStackNavigator();

// Define the MainApp component
export default function MainApp() {
  // Use NavigationContainer and Stack.Navigator for screen navigation
  return (
    // Wrap the app in the NavigationContainer to enable navigation
    <NavigationContainer>
      <PreloadImages />
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResult" component={SearchResult} options={{ title: 'Search Results' }} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} options={{ title: 'Add a Recipe' }} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ title: 'Recipe Details' }} />
        <Stack.Screen name="SavedRecipes" component={SavedRecipes} options={{ title: 'Saved Recipes' }} />
        <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
        <Stack.Screen name="Toolbar" component={Toolbar} options={{ title: 'Toolbar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Define the Home component, with navigation to Login and Register screens
function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Image
        style={styles.logo}
        source={require('/Users/kirsty/Library/CloudStorage/OneDrive-UniversityofStrathclyde/Dissertation/scran-recipe-app/assets/cookbook.png')}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}


// Define styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 100,
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    height: 150,
  },
  button: {
    backgroundColor: '#fcf3cf',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    margin: 5,
    minWidth: 200,
    minHeight: 50,
    textAlign: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
