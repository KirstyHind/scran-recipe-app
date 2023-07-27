import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database'; // Import Firebase Realtime Database methods
import { useNavigation } from '@react-navigation/native';

const SearchResult = ({ route }) => {
  const { keyword } = route.params;
  const navigation = useNavigation();

  // State to store the search results
  const [searchResults, setSearchResults] = useState([]);

  // Function to fetch all recipes from Firebase database and filter based on the keyword
  const fetchAllRecipes = () => {
    const database = getDatabase();
    const recipesRef = ref(database, 'recipes');

    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        const results = allRecipes.filter((recipe) => 
          (recipe.recipeName && recipe.recipeName.toLowerCase().includes(keyword.toLowerCase())) ||
          (recipe.description && recipe.description.toLowerCase().includes(keyword.toLowerCase())) ||
          (recipe.ingredients && recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(keyword.toLowerCase()))) ||
          (recipe.mealType && recipe.mealType.toLowerCase().includes(keyword.toLowerCase())) ||
          (recipe.cuisine && recipe.cuisine.toLowerCase().includes(keyword.toLowerCase()))
        );

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }

    onValue(recipesRef, onValueChange);

    // Return a cleanup function to remove the listener
    return () => off(recipesRef, 'value', onValueChange);
  };

  useEffect(() => {
    let cleanup;
    if (keyword.trim() !== '') {
      cleanup = fetchAllRecipes();
    } else {
      setSearchResults([]); // Clear the search results if the search query is empty
    }

    // Cleanup function to be called when the component unmounts
    return cleanup;
  }, [keyword]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Results for: {keyword}</Text>
      {searchResults.length > 0 ? (
        searchResults.map((recipe) => (
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
        <Text>No results found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 16,
    marginBottom: 10,
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
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 16,
  },
});

export default SearchResult;
