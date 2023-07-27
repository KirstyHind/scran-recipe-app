import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, query, orderByChild, startAt, endAt, onValue, off } from 'firebase/database'; // Import Firebase Realtime Database methods

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

    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        // Convert the snapshot data into an array of search results
        const data = snapshot.val();
        const results = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setSearchResults(results);
      } else {
        // No results found
        setSearchResults([]);
      }
    }

    // Listen for changes to the searchQueryQuery and update the searchResults state accordingly
    onValue(searchQueryQuery, onValueChange);

    // Return a cleanup function to remove the listener
    return () => off(searchQueryRef, 'value', onValueChange);
  };

  // useEffect hook to fetch search results when the component mounts or when the keyword changes
  useEffect(() => {
    let cleanup;
    if (keyword.trim() !== '') {
      cleanup = fetchSearchResults(keyword);
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
          <View key={recipe.id} style={styles.recipeContainer}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <View style={styles.recipeDetails}>
              <Text style={styles.recipeName}>{recipe.recipeName}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
            </View>
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
