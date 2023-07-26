import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchResult = ({ route }) => {
  const { keyword } = route.params;

  // State to store the search results
  const [searchResults, setSearchResults] = useState([]);

  // useEffect hook to fetch search results from Firebase database
  useEffect(() => {
    // Implement your logic to fetch search results from Firebase database based on the 'keyword' parameter
    // Example: You can use Firebase Realtime Database queries or Firestore queries here to fetch the data
    // and update the 'searchResults' state with the fetched data.

    // Dummy data for demonstration purposes
    const dummyData = [
      { id: 1, title: 'Recipe 1', description: 'Description of Recipe 1' },
      { id: 2, title: 'Recipe 2', description: 'Description of Recipe 2' },
      // Add more recipe data here
    ];

    setSearchResults(dummyData); // Update the searchResults state with the fetched data
  }, [keyword]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Results for: {keyword}</Text>
      {searchResults.map((recipe) => (
        <View key={recipe.id}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>
        </View>
      ))}
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
});

export default SearchResult;
