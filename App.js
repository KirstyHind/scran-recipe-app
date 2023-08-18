// Import necessary packages and components
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import HomeScreen from './HomeScreen';
import SearchResult from './SearchResult';
import AddRecipe from './AddRecipe';
import RecipeDetails from './RecipeDetails';
import SavedRecipes from './SavedRecipes';
import Settings from './Settings';
import CustomButton from './CustomButton';
import HeaderText from './HeaderText';

// Create a stack navigator object for navigation
const Stack = createStackNavigator();

// Define the MainApp component
export default function MainApp() {
  // Use NavigationContainer and Stack.Navigator for screen navigation
  return (
    // Wrap the app in the NavigationContainer to enable navigation
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false }} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ headerShown: false }} />
        <Stack.Screen name="SavedRecipes" component={SavedRecipes} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// Define the Home component, with navigation to Login and Register screens
function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <HeaderText>Welcome to SCRAN!</HeaderText>
      <Image
        style={styles.logo}
        source={require('./assets/cookbook.png')}
      />
      <CustomButton
        title="Login"
        onPress={() => navigation.navigate('Login')}
        style={{ minWidth: '75%', minHeight: '7%', }}
      />
      <CustomButton
        title="Register"  // Fixed the title here.
        onPress={() => navigation.navigate('Register')}
        style={{ minWidth: '75%', minHeight: '7%', }}
      />
      <StatusBar style="auto" />
    </View>
  );
}


// Define styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '50%',
    height: '22%',
    marginTop: '10%',
    marginBottom: '20%',
  },
});
