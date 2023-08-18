// Import necessary packages and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import Toolbar from './Toolbar';
import CustomButton from './CustomButton';
import InputBox from './InputBox';
import RecipeCard from './RecipeCard';

// Define the HomeScreen component
const HomeScreen = () => {
  const navigation = useNavigation();

  // State to store the user's email
  const [userEmail, setUserEmail] = useState('');

  // State to store the user's username extracted from the email
  const [username, setUsername] = useState('');

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('');

  // State to store saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);

  // State to store random recipes
  const [randomRecipes, setRandomRecipes] = useState([]);

  // Fetch saved recipes function definition
  const fetchSavedRecipes = () => {
    // Get current user and database reference
    const auth = getAuth();
    const database = getDatabase();
    const savedRecipesRef = ref(database, `users/${auth.currentUser.uid}/savedRecipes`);

    // Define the value change handler
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        // Transform the snapshot to a list of recipes
        const data = snapshot.val();
        const allSavedRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        setSavedRecipes(allSavedRecipes);
      } else {
        // Set empty recipes list if there's no data
        setSavedRecipes([]);
      }
    }

    // Attach the value change listener
    onValue(savedRecipesRef, onValueChange);

    // Cleanup function for removing the listener
    return () => off(savedRecipesRef, 'value', onValueChange);
  };

  const fetchRandomRecipes = () => {
    const database = getDatabase();
    const recipesRef = ref(database, `recipes`);

    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        // Shuffle the array
        const shuffled = allRecipes.sort(() => 0.5 - Math.random());

        // Get sub-array of first n elements after shuffled
        let selected = shuffled.slice(0, 5);

        setRandomRecipes(selected);
      } else {
        setRandomRecipes([]);
      }
    }

    onValue(recipesRef, onValueChange);

    return () => off(recipesRef, 'value', onValueChange);
  };

  useEffect(() => {
    const cleanupSaved = fetchSavedRecipes();
    const cleanupRandom = fetchRandomRecipes();

    return () => {
      cleanupSaved();
      cleanupRandom();
    };
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Navigate to the login screen after successful logout
        navigation.navigate('Home');
      })
      .catch((error) => {
        // Handle any errors that occurred during logout
        console.error('Logout error:', error.message);
      });
  };

  // Function to handle search input change
  const handleSearchInputChange = (text) => {
    // Set the search query in the state
    setSearchQuery(text);
    // Implement any search logic here based on the searchQuery
  };

  // Function to handle search button press
  const handleSearchButtonPress = () => {
    if (searchQuery.trim() !== '') {
      navigation.navigate('SearchResult', { keyword: searchQuery });
      setSearchQuery('');
    }
  };

  // Function to handle submit of the search input field
  const handleSubmitEditing = () => {
    if (searchQuery.trim() !== '') {
      handleSearchButtonPress();
    }
  };

  // Effect hook to get the user's email when the component mounts
  useEffect(() => {
    const auth = getAuth();

    // Check if the user is logged in
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, set the email in the state
        setUserEmail(user.email);
      } else {
        // User is not logged in, navigate to the login screen
        navigation.navigate('Login');
      }
    });
  }, [navigation]);

  // Effect hook to extract the username from the email and set it in the state
  useEffect(() => {
    if (userEmail) {
      // Extract the username from the email using split()
      const usernameFromEmail = userEmail.split('.')[0];

      // Set the username in the state
      setUsername(usernameFromEmail.charAt(0).toUpperCase() + usernameFromEmail.slice(1));
    }
  }, [userEmail]);

  // Render the HomeScreen component
  // Render the HomeScreen component
  return (
    // Using a Fragment to wrap the two top-level components
    <>
      <View style={styles.container}>
        {/* User Details */}
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userDetails}>Welcome {username}!</Text>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style={styles.button}
          />
        </View>

        {/* Search */}
        <InputBox
          placeholder="Search"
          onChangeText={handleSearchInputChange}
          onSubmitEditing={handleSubmitEditing}
          value={searchQuery}
        />

        {/* Saved Recipes ScrollView */}
        <Text style={styles.heading}>Your Saved Recipes</Text>
        <ScrollView horizontal>
          {savedRecipes.length > 0 ? (
            savedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            <Text style={styles.noRecText}>No saved recipes.</Text>
          )}
        </ScrollView>

        {/* Random Recipes */}
        <Text style={styles.heading}>Discover New Recipes</Text>
        <ScrollView horizontal={true}>
          {randomRecipes.length > 0 ? (
            randomRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            <Text style={styles.noRecText}>No recipes available.</Text>
          )}
        </ScrollView>

        <Text style={styles.enjoyText}>Enjoy!</Text>
      </View>
      <Toolbar />
    </>
  );
};

// Styling for the HomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 70,
    padding: 10,
  },
  userDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  userDetails: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecText: {
    paddingLeft: 10,
    fontSize: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 30,
    padding: 10,
    textAlign: 'left',
    marginBottom: 10,
  },
  enjoyText: {
    fontSize: 24,
    paddingBottom: 140,
    paddingTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

// Export the HomeScreen component
export default HomeScreen; 
