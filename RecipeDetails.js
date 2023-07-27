import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';

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
    <View style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeName}>{recipe.recipeName}</Text>
      <Text style={styles.recipeDescription}>{recipe.description}</Text>
      <Text style={styles.heading}>Ingredients:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index}>{ingredient}</Text>
      ))}
      <Text style={styles.heading}>Cooking Instructions:</Text>
      {recipe.instructions.map((instruction, index) => (
        <Text key={index}>{instruction}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
