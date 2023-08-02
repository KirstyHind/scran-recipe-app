import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import firebase, { database } from './firebaseConfig';
import { ref, set, onValue, off, remove } from 'firebase/database';
import Toolbar from './Toolbar';

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

    // Define references to the recipe and user saved recipes
    const recipeRef = ref(database, `recipes/${recipeId}`);
    const userSavedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

    // Function to update the recipe state if a snapshot exists
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        setRecipe(snapshot.val());
      }
    }

    // Set the onValue listener to update the recipe state
    onValue(recipeRef, onValueChange);

    // Function to update the isSaved state based on whether a snapshot exists
    const checkSavedRecipe = snapshot => {
      setIsSaved(snapshot.exists());
    }

    // Set the onValue listener to check if the user has saved this recipe
    onValue(userSavedRecipeRef, checkSavedRecipe);

    // Cleanup listeners when the component is unmounted
    return () => {
      off(recipeRef, onValueChange);
      off(userSavedRecipeRef, checkSavedRecipe);
    }
  }, [recipeId]); // Dependency array

  // If the recipe is still loading, display a loading message
  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  // Calculate total recipe time and format it for display
  const totalTime = recipe.prepTime + recipe.cookTime;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const displayTime = hours > 0 ? `${hours} hours ${minutes} minutes` : `${minutes} minutes`;

  // Handler for saving a recipe
  const handleSave = async () => {
    // Get the currently authenticated user
    const user = getAuth().currentUser;

    // Throw an error if user isn't authenticated
    if (!user) {
      throw new Error('User is not authenticated');
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
          <View key={index}>
          <Text>{ingredient}</Text>
          <Text>{'\n'}</Text>
        </View>
          
        ))}
        <Text style={styles.heading}>Cooking Instructions:</Text>
        {recipe.instructions.map((instruction, index) => (
          <View key={index}>
          <Text>{`${index+1}. ${instruction}`}</Text>
          <Text>{'\n'}</Text>
        </View>
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
  prepTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  cookTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  totalTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  servings: {
    fontSize: 16,
    marginBottom: 10,
  },
  cuisine: {
    fontSize: 16,
    marginBottom: 10,
  },
  mealType: {
    fontSize: 16,
    marginBottom: 10,
  },
  difficulty: {
    fontSize: 16,
    marginBottom: 10,
  },
  dietaryRequirements: {
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
