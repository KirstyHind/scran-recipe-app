import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Button, Alert, TouchableOpacity } from 'react-native';
import firebase, { database } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { ref, set, onValue, off } from 'firebase/database';
import Toolbar from './Toolbar';
import 'firebase/auth';


const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // State to track whether the recipe is saved or not

  useEffect(() => {
    const user = getAuth().currentUser;

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

    return () => {
      off(recipeRef, 'value', onValueChange);
      off(userSavedRecipeRef, 'value', checkSavedRecipe);
    }
  }, [recipeId]);

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  let displayTime;
  if (hours > 0) {
    displayTime = `${hours} hours ${minutes} minutes`;
  } else {
    displayTime = `${minutes} minutes`;
  }

  const handleSave = async () => {
    try {
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const savedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);
      await set(savedRecipeRef, recipe);
      Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');
      setIsSaved(true); // Set the recipe as saved

    } catch (error) {
      Alert.alert('Failed to save recipe', `An error occurred while saving the recipe: ${error.message}`);
    }
  }

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

export default RecipeDetails;
