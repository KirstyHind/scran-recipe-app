// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database'; // Firebase Realtime Database methods
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import BackButton from './BackButton';
import RecipeCard from './RecipeCard';
import HeaderText from './HeaderText';
import InputBox from './InputBox';

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
  const handleSearchInputChange = (userInput) => {
    console.log("Input changed:", userInput);
    // Update searchQuery state with entered text
    setSearchQuery(userInput);
  };

  // Function to fetch all recipes from Firebase database and filter based on searchQuery
  const fetchAllRecipes = () => {
    const database = getDatabase();
    // Create reference to 'recipes' in database
    const recipesRef = ref(database, 'recipes');

    // Debugging log
    console.log("Fetching all recipes...");

    // Function to handle value changes in recipes reference
    const onValueChange = snapshot => {
      console.log("Firebase data received:", snapshot.val());
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
          (recipe.cuisine && recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (recipe.difficulty && recipe.difficulty.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (recipe.dietaryRequirements && recipe.dietaryRequirements.some(dietaryRequirements => dietaryRequirements.toLowerCase().includes(searchQuery.toLowerCase())))
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
    return () => {
      console.log("Cleaning up Firebase listener...");
      off(recipesRef, 'value', onValueChange);
    };
  };

  // Call fetchAllRecipes whenever searchQuery is updated
  useEffect(() => {
    console.log("useEffect triggered..."); // Debugging log

    let cleanup;
    console.log("Dummy cleanup function...");

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView style={styles.container}>
      <HeaderText >Search Results</HeaderText>
      <BackButton />
      {/* Search */}
      <InputBox
          placeholder="Search"
          onChangeText={handleSearchInputChange}
          value={searchQuery}
        />
        <ScrollView>
                    {searchResults.length > 0 ? (
                        searchResults.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
                    ) : (
                        <Text style={styles.noRecText}>No recipes found.</Text>
                    )}
                    <Text style={styles.endText}>End</Text>
                </ScrollView>

      {/* Toolbar */}
      <Toolbar />
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

// Styling for the SearchResult component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  noRecText: {
    fontSize: 20,             
    fontWeight: 'bold',      
    padding: 20,  
  },
  endText: {
    fontSize: 20,
    paddingBottom: 80,
    paddingTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

// Export the SearchResult component
export default SearchResult;
