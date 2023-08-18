import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import firebase, { database } from './firebaseConfig';
import { ref, set, onValue, off, remove } from 'firebase/database';
import Toolbar from './Toolbar';
import RecipeInfo from './RecipeInfo';
import BackButton from './BackButton';
import HeaderText from './HeaderText';

// RecipeDetails Component
const RecipeDetails = ({ route, navigation }) => {
  const { recipeId } = route.params;
  // State to hold recipe
  const [recipe, setRecipe] = useState(null);
  // State to track whether the recipe is saved or not
  const [isSaved, setIsSaved] = useState(false);

  // Use useEffect to fetch the recipe and check if it is saved
  useEffect(() => {
    // Get the currently authenticated user
    const user = getAuth().currentUser;

    // Error message if user isn't found
    if (!user) {
      Alert.alert('Error', 'User is not authenticated');
      return;
    }

    // Define references to the recipe and user saved recipes
    const recipeRef = ref(database, `recipes/${recipeId}`);
    const userSavedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

    // Function to update the recipe state if a snapshot exists
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        setRecipe(snapshot.val());
      } else {
        Alert.alert('Error', 'Failed to fetch recipe data.');
      }
    }

    // Function to update the isSaved state based on whether a snapshot exists
    const checkSavedRecipe = snapshot => {
      setIsSaved(snapshot.exists());
    }

    // Set the onValue listener to update the recipe state
    onValue(recipeRef, onValueChange);
    // Set the onValue listener to check if the user has saved this recipe
    onValue(userSavedRecipeRef, checkSavedRecipe);

    // Cleanup listeners when the component is unmounted
    return () => {
      off(recipeRef, onValueChange);
      off(userSavedRecipeRef, checkSavedRecipe);
    }
  }, [recipeId]); // Dependency array

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  const {
    recipeName,
  } = recipe;

  // Handler for saving a recipe
  const handleSave = async () => {
    // Get the currently authenticated user
    const user = getAuth().currentUser;

    // Throw an error if user isn't authenticated
    if (!user) {
      Alert.alert('Error', 'User is not authenticated');
      return;
    }

    // Define reference to the user's saved recipes
    const savedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

    try {
      // Check if the recipe is saved
      if (isSaved) {
        // If saved, remove it from the saved recipes
        await remove(savedRecipeRef);
        Alert.alert('Recipe unsaved!', 'Your recipe has been successfully removed from saved recipes.');
        setIsSaved(false); // Update isSaved state
      } else {
        // If not saved, save it
        await set(savedRecipeRef, recipe);
        Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');
        setIsSaved(true); // Update isSaved state
      }
    } catch (error) {
      // If an error occurs, alert the user
      Alert.alert('Failed to update saved recipes', `An error occurred while updating your saved recipes: ${error.message}`);
    }
  }

  // Render the RecipeDetails component
  return (
    <SafeAreaView style={styles.container}>
      <HeaderText>Recipe Details</HeaderText>
      <BackButton />
      <ScrollView style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.recipeName}>{recipeName}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Image
              source={isSaved ? require('./assets/savedrecipe.png') : require('./assets/save.png')}
              style={{ width: 80, height: 80 }}
            />
          </TouchableOpacity>
        </View>
        <RecipeInfo recipe={recipe} />
        <Text style={styles.enjoyText}>Enjoy!</Text>
      </ScrollView>
      <Toolbar />
    </SafeAreaView>
  );
};

// Styling for the RecipeDetails component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 30,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: '#fff',
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  enjoyText: {
    fontSize: 24,
    paddingBottom: 120,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

// Export the RecipeDetails component
export default RecipeDetails;
