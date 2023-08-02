// Import necessary packages
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Button, Alert, TouchableOpacity } from 'react-native';
import firebase, { database } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { ref, set, onValue, off, remove } from 'firebase/database';
import Toolbar from './Toolbar';
import 'firebase/auth';

// RecipeDetails Component
const RecipeDetails = ({ route }) => {
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
      throw new Error('User is not authenticated');
    }

    const recipeRef = ref(database, `recipes/${recipeId}`);
    const userSavedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

    // Listen for changes in the recipe data
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        setRecipe(snapshot.val());
      }
    }

    onValue(recipeRef, onValueChange);

    // Check if the user has already saved this recipe
    const checkSavedRecipe = snapshot => {
      setIsSaved(snapshot.exists());
    }

    onValue(userSavedRecipeRef, checkSavedRecipe);

    // Cleanup listeners
    return () => {
      off(recipeRef, 'value', onValueChange);
      off(userSavedRecipeRef, 'value', checkSavedRecipe);
    }
  }, [recipeId]);

  // Loading message
  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  // Calculate total recipe time
  const totalTime = recipe.prepTime + recipe.cookTime;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  // Set format for displayTime where if time is less than 60 minutes, hour is omitted
  let displayTime;
  if (hours > 0) {
    displayTime = `${hours} hours ${minutes} minutes`;
  } else {
    displayTime = `${minutes} minutes`;
  }

  // Handler for saving a recipe
  const handleSave = async () => {
    try {
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const savedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

      if (isSaved) {
        // If the recipe is already saved, remove it
        await remove(savedRecipeRef);
        Alert.alert('Recipe unsaved!', 'Your recipe has been successfully removed from saved recipes.');
        // Set the recipe as not saved
        setIsSaved(false);
      } else {
        // If the recipe isn't saved, save it
        await set(savedRecipeRef, recipe);
        Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');
        // Set the recipe as saved
        setIsSaved(true);
      }
    } 
    // Error handling if saved recipes isn't updated
    catch (error) {
      Alert.alert('Failed to update saved recipes', `An error occurred while updating your saved recipes: ${error.message}`);
    }
  }

  // Render the RecipeDetails component
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.recipeName}>{recipe.recipeName}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Image
              source={isSaved ? require('scran-recipe-app/assets/savedrecipe.png') : require('scran-recipe-app/assets/save.png')}
              style={{ width: 60, height: 60, }}
            />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        <Text style={styles.recipeDescription}>{recipe.description}</Text>
        <Text style={styles.prepTime}>Prep Time: {recipe.prepTime} minutes</Text>
        <Text style={styles.cookTime}>Cook Time: {recipe.cookTime} minutes</Text>
        <Text style={styles.totalTime}>Total Time: {displayTime}</Text>
        <Text style={styles.servings}>Servings: {recipe.servings}</Text>
        <Text style={styles.cuisine}>Cuisine: {recipe.cuisine}</Text>
        <Text style={styles.mealType}>Meal Type: {recipe.mealType}</Text>
        <Text style={styles.difficulty}>Difficulty: {recipe.difficulty}</Text>
        <Text style={styles.dietaryRequirements}>Dietary Requirements: {recipe.dietaryRequirements}</Text>
        <Text style={styles.heading}>Ingredients:</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index}>{ingredient}</Text>
        ))}
        <Text style={styles.heading}>Cooking Instructions:</Text>
        {recipe.instructions.map((instruction, index) => (
          <Text key={index}>{instruction}</Text>
        ))}
      </ScrollView>
      {/* Toolbar */}
      <Toolbar />
    </SafeAreaView>
  );
};

// Styling for the RecipeDetails component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

// Export the RecipeDetails component
export default RecipeDetails;
