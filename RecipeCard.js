import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecipeCard = ({ recipe }) => {
  const navigation = useNavigation();

  const handleRecipePress = () => {
    navigation.navigate('RecipeDetails', { recipeId: recipe.id });
  };

  return (
    <TouchableOpacity onPress={handleRecipePress}>
      <View style={styles.recipeContainer}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        <View style={styles.recipeDetails}>
          <Text style={styles.recipeName}>{recipe.recipeName}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
  },
  recipeImage: {
    width: 125,
    height: 125,
  },
  recipeDetails: {
    flex: 1,
    padding: 10,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeDescription: {
    width: 200,
  },
});

export default RecipeCard;