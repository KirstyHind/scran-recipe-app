// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database'; // Firebase Realtime Database methods
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';

// SearchResult Component
const SearchResult = ({ route }) => {
  // Extract keyword from route parameters
  const { keyword } = route.params;
  // Navigation hook
  const navigation = useNavigation();

  // State to store the search results
  const [searchResults, setSearchResults] = useState([]);

  // State to store the search query initialised with the keyword from HomeScreen
  const [searchQuery, setSearchQuery] = useState(keyword || '');

  // Function to handle search input change
  const handleSearchInputChange = (text) => {
    // Update searchQuery state with entered text
    setSearchQuery(text);
  };

  // Function to fetch all recipes from Firebase database and filter based on searchQuery
  const fetchAllRecipes = () => {
    const database = getDatabase();
    // Create reference to 'recipes' in database
    const recipesRef = ref(database, 'recipes');

    // Function to handle value changes in recipes reference
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        // Snapshot of the data from 'recipes' reference
        const data = snapshot.val();
        // Convert data to array format
        const allRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        // Filter recipes based on searchQuery
        const results = allRecipes.filter((recipe) =>
          (recipe.recipeName && recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (recipe.ingredients && recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase()))) ||
          (recipe.mealType && recipe.mealType.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (recipe.cuisine && recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // Update searchResults with filtered recipes
        setSearchResults(results);
      } else {
        // Clear searchResults if there are no matches
        setSearchResults([]);
      }
    }
    // Attach listener to recipes reference
    onValue(recipesRef, onValueChange);

    // Return a cleanup function to remove the listener
    return () => off(recipesRef, 'value', onValueChange);
  };

  // Call fetchAllRecipes whenever searchQuery is updated
  useEffect(() => {
    let cleanup;
    // Call fetchAllRecipes if searchQuery is not empty
    if (searchQuery.trim() !== '') {
      cleanup = fetchAllRecipes();
      // Clear the search results if the search query is empty
    } else {
      setSearchResults([]);
    }

    // Cleanup function to be called when the component unmounts
    return cleanup;
  }, [searchQuery]);

  // Render the SearchResult component
  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={handleSearchInputChange}
          value={searchQuery}
        />
      </View>
      <Text style={styles.heading}>Search Results for: {keyword}</Text>
      <ScrollView contentContainerStyle={styles.content}>
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
      </ScrollView>
      {/* Toolbar */}
      <Toolbar />
    </SafeAreaView>
  );
};

// Styling for the SearchResult component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
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
    marginLeft: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

// Export the SearchResult component
export default SearchResult;
