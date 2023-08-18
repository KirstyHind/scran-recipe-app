import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const RecipeInfo = ({ recipe }) => {
  if (!recipe) {
    return null;
  }

  const {
    prepTime,
    cookTime,
    recipeName,
    image,
    description,
    servings,
    cuisine,
    mealType,
    difficulty,
    dietaryRequirements,
    ingredients,
    instructions
  } = recipe;

  // Calculate total recipe time and format it for display
  const totalTime = prepTime + cookTime;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const displayTime = hours > 0 ? `${hours} hours ${minutes} minutes` : `${minutes} minutes`;

  return (
    <View style={styles.container}>
      <Text style={styles.recipeName}>{recipeName}</Text>
      <Image source={{ uri: image }} style={styles.recipeImage} />
      <Text style={styles.recipeDesc}>{description}</Text>
      <Text style={styles.recipeInfo}>Prep Time: {prepTime} minutes</Text>
      <Text style={styles.recipeInfo}>Cook Time: {cookTime} minutes</Text>
      <Text style={styles.recipeInfo}>Total Time: {displayTime}</Text>
      <Text style={styles.recipeInfo}>Servings: {servings}</Text>
      <Text style={styles.recipeInfo}>Cuisine: {cuisine}</Text>
      <Text style={styles.recipeInfo}>Meal Type: {mealType}</Text>
      <Text style={styles.recipeInfo}>Difficulty: {difficulty}</Text>
      <Text style={styles.recipeInfo}>Dietary: {dietaryRequirements.join(', ')}</Text>

      <Text style={styles.subheading}>Ingredients:</Text>
      {ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.listItem}>{ingredient}</Text>
      ))}

      <Text style={styles.subheading}>Instructions:</Text>
      {instructions.map((instruction, index) => (
        <Text key={index} style={styles.listItem}>{index + 1}. {instruction}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  recipeDesc: {
    fontSize: 16,
    marginBottom: 10,
  },
  recipeInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RecipeInfo;
