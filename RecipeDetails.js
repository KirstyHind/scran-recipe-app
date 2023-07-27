import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import Toolbar from './Toolbar';

const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const database = getDatabase();
      const recipeRef = ref(database, `recipes/${recipeId}`);
      
      const onValueChange = snapshot => {
        if (snapshot.exists()) {
          setRecipe(snapshot.val());
        }
      }

      onValue(recipeRef, onValueChange);
      
      return () => off(recipeRef, 'value', onValueChange);
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        <Text style={styles.recipeName}>{recipe.recipeName}</Text>
        <Text style={styles.recipeDescription}>{recipe.description}</Text>
        <Text style={styles.prepTime}>Prep Time: {recipe.prepTime} minutes</Text>
        <Text style={styles.cookTime}>Cook Time: {recipe.cookTime} minutes</Text>
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
