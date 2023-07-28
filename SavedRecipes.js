import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Toolbar from './Toolbar';

const SavedRecipes = () => {
  const navigation = useNavigation();
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  const fetchSavedRecipes = () => {
    const auth = getAuth();
    const database = getDatabase();
    const savedRecipesRef = ref(database, `users/${auth.currentUser.uid}/savedRecipes`);

    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allSavedRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        setSavedRecipes(allSavedRecipes);
      } else {
        setSavedRecipes([]);
      }
    }

    onValue(savedRecipesRef, onValueChange);

    // Return a cleanup function to remove the listener
    return () => off(savedRecipesRef, 'value', onValueChange);
  };

  useEffect(() => {
    const cleanup = fetchSavedRecipes();

    return cleanup;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Recipes</Text>
      {savedRecipes.length > 0 ? (
        savedRecipes.map((recipe) => (
          <TouchableOpacity key={recipe.id} onPress={() => navigation.navigate('RecipeDetails', { recipeId: recipe.id })}>
            <View style={styles.recipeContainer}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeName}>{recipe.recipeName}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noRecText}>No saved recipes.</Text>
      )}

      {/* Toolbar */}
      <Toolbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  noRecText: {
    paddingLeft: 20,
  },
  recipeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recipeImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  recipeDetails: {
    flex: 1,
    padding: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 16,
  },
});

export default SavedRecipes;
