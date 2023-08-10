// Import necessary packages and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import Toolbar from './Toolbar';

// Define the GuestHomeScreen component
const GuestHomeScreen = () => {
  const navigation = useNavigation();

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('');

  // State to store random recipes
  const [randomRecipes, setRandomRecipes] = useState([]);

  const fetchRandomRecipes = () => {
    const database = getDatabase();
    const recipesRef = ref(database, `recipes`);

    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        // Shuffle the array
        const shuffled = allRecipes.sort(() => 0.5 - Math.random());

        // Get sub-array of first n elements after shuffled
        let selected = shuffled.slice(0, 5);

        setRandomRecipes(selected);
      } else {
        setRandomRecipes([]);
      }
    }

    onValue(recipesRef, onValueChange);

    return () => off(recipesRef, 'value', onValueChange);
  };

  useEffect(() => {
    const cleanupRandom = fetchRandomRecipes();

    return () => {
      cleanupRandom();
    };
  }, []);

  // Function to handle search input change
  const handleSearchInputChange = (text) => {
    // Set the search query in the state
    setSearchQuery(text);
    // Implement any search logic here based on the searchQuery
  };

  // Function to handle search button press
  const handleSearchButtonPress = () => {
    if (searchQuery.trim() !== '') {
      navigation.navigate('SearchResult', { keyword: searchQuery });
      setSearchQuery('');
    }
  };

  // Function to handle submit of the search input field
  const handleSubmitEditing = () => {
    if (searchQuery.trim() !== '') {
      handleSearchButtonPress();
    }
  };

  // Render the GuestHomeScreen component
  return (
    <View style={styles.container}>
      {/* User Details */}
        <Text style={styles.userDetails}>Welcome!</Text>
      

      {/* Create Account Button */}
      <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={handleSearchInputChange}
          onSubmitEditing={handleSubmitEditing}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Random Recipes */}
      <Text style={styles.heading}>Discover New Recipes</Text>
      <ScrollView horizontal={true}>
        {randomRecipes.length > 0 ? (
          randomRecipes.map((recipe) => (
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
          <Text style={styles.noRecText}>No recipes available.</Text>
        )}
      </ScrollView>

      <Text style={styles.enjoyText}>Enjoy!</Text>

      {/* Toolbar */}
      <Toolbar />
    </View>
  );
};

// Styling for the GuestHomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 120,
  },
  userDetails: {
    padding: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  createAccountButton: {
    backgroundColor: '#fcf3cf',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    top: 80,
    right: 20,
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center',
    top: 35,
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    flex: 1,
    height: 48,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#fcf3cf',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 48,
    borderWidth: 1,
  },
  noRecText: {
    paddingLeft: 20,
  },
  recipeContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'left',
    marginBottom: 10,
  },
  recipeImage: {
    width: 125,
    height: 125,
    marginRight: 10,
  },
  recipeDetails: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeDescription: {
    fontSize: 14,
    width: 125,
    height: 125,
  },
  enjoyText: {
    fontSize: 24,
    paddingBottom: 140,
    paddingTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

// Export the GuestHomeScreen component
export default GuestHomeScreen; 
