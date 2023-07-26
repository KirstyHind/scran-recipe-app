import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, query, orderByChild, startAt, endAt, onValue } from 'firebase/database'; // Import Firebase Realtime Database methods

const SearchResult = ({ route }) => {
  const { keyword } = route.params;

  // State to store the search results
  const [searchResults, setSearchResults] = useState([]);

  // Function to fetch search results from Firebase database based on the search query
  const fetchSearchResults = (searchQuery) => {
    const database = getDatabase();

    // Create a query to search for recipes with a title containing the searchQuery
    const searchQueryRef = ref(database, 'recipes');
    const searchQueryQuery = query(
      searchQueryRef,
      orderByChild('recipeName'),
      startAt(searchQuery),
      endAt(searchQuery + '\uf8ff')
    );
    // Listen for changes to the searchQueryQuery and update the searchResults state accordingly
    onValue(searchQueryQuery, (snapshot) => {
      if (snapshot.exists()) {
        // Convert the snapshot data into an array of search results
        const data = snapshot.val();
        const results = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setSearchResults(results);
      } else {
        // No results found
        setSearchResults([]);
      }
    });
  };

  // useEffect hook to fetch search results when the component mounts or when the keyword changes
  useEffect(() => {
    if (keyword.trim() !== '') {
      fetchSearchResults(keyword);
    } else {
      setSearchResults([]); // Clear the search results if the search query is empty
    }
  }, [keyword]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Results for: {keyword}</Text>
      {searchResults.length > 0 ? (
        searchResults.map((recipe) => (
          <View key={recipe.id} style={styles.recipeContainer}>
            <Text style={styles.recipeName}>{recipe.recipeName}</Text>
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          </View>
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
});

export default SearchResult;
