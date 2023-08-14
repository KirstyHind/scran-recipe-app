import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import firebase, { database } from './firebaseConfig';
import { ref, set, onValue, off, remove } from 'firebase/database';
import Toolbar from './Toolbar';

// RecipeDetails Component
const RecipeDetails = ({ route, navigation }) => {
  const { recipeId } = route.params;
  // State to hold recipe
  const [recipe, setRecipe] = useState(null);
  // State to track whether the recipe is saved or not
  const [isSaved, setIsSaved] = useState(false);

  // Use useEffect to fetch the recipe and check if it is saved
  useEffect(() => {
    // Get the currently authenticated user
    const user = getAuth().currentUser;

    // Error message if user isn't found
    if (!user) {
      Alert.alert('Error', 'User is not authenticated');
      return;
    }

    // Define references to the recipe and user saved recipes
    const recipeRef = ref(database, `recipes/${recipeId}`);
    const userSavedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

    // Function to update the recipe state if a snapshot exists
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        setRecipe(snapshot.val());
      } else {
        Alert.alert('Error', 'Failed to fetch recipe data.');
      }
    }

    // Function to update the isSaved state based on whether a snapshot exists
    const checkSavedRecipe = snapshot => {
      setIsSaved(snapshot.exists());
    }

    // Set the onValue listener to update the recipe state
    onValue(recipeRef, onValueChange);
    // Set the onValue listener to check if the user has saved this recipe
    onValue(userSavedRecipeRef, checkSavedRecipe);

    // Cleanup listeners when the component is unmounted
    return () => {
      off(recipeRef, onValueChange);
      off(userSavedRecipeRef, checkSavedRecipe);
    }
  }, [recipeId]); // Dependency array

  // If the recipe is still loading, display a loading message
  if (!recipe) {
    return <Text>Loading...</Text>;
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
  const totalTime = recipe.prepTime + recipe.cookTime;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const displayTime = hours > 0 ? `${hours} hours ${minutes} minutes` : `${minutes} minutes`;

  // Handler for saving a recipe
  const handleSave = async () => {
    // Get the currently authenticated user
    const user = getAuth().currentUser;

    // Throw an error if user isn't authenticated
    if (!user) {
      Alert.alert('Error', 'User is not authenticated');
      return;
    }

    // Define reference to the user's saved recipes
    const savedRecipeRef = ref(database, `users/${user.uid}/savedRecipes/${recipeId}`);

    try {
      // Check if the recipe is saved
      if (isSaved) {
        // If saved, remove it from the saved recipes
        await remove(savedRecipeRef);
        Alert.alert('Recipe unsaved!', 'Your recipe has been successfully removed from saved recipes.');
        setIsSaved(false); // Update isSaved state
      } else {
        // If not saved, save it
        await set(savedRecipeRef, recipe);
        Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');
        setIsSaved(true); // Update isSaved state
      }
    } catch (error) {
      // If an error occurs, alert the user
      Alert.alert('Failed to update saved recipes', `An error occurred while updating your saved recipes: ${error.message}`);
    }
  }

  // Render the RecipeDetails component
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Recipe Details</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('./assets/backbutton.png')} style={[styles.backImage, styles.imageBorder]} />
      </TouchableOpacity>
      <ScrollView style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.recipeName}>{recipeName}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Image
              source={isSaved ? require('./assets/savedrecipe.png') : require('./assets/save.png')}
              style={{ width: 80, height: 80 }}
            />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: image }} style={styles.recipeImage} />
        <Text style={styles.recipeDesc}>{description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Prep Time: </Text>
          <Text style={styles.recipeInfo}>{prepTime} minutes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Cook Time: </Text>
          <Text style={styles.recipeInfo}>{cookTime} minutes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Total Time: </Text>
          <Text style={styles.recipeInfo}>{displayTime}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Servings: </Text>
          <Text style={styles.recipeInfo}>{servings}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Cuisine: </Text>
          <Text style={styles.recipeInfo}>{cuisine}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Meal Type: </Text>
          <Text style={styles.recipeInfo}>{mealType}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Difficulty: </Text>
          <Text style={styles.recipeInfo}>{difficulty}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boldText}>Dietary: </Text>
          <Text style={styles.recipeInfo}>{dietaryRequirements.join(', ')}</Text>
        </View>
        <Text style={styles.subheading}>Ingredients:</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <View key={index}>
            <Text style={styles.ingredients}>{ingredient}</Text>
          </View>

        ))}
        <Text style={styles.subheading}>Cooking Instructions:</Text>
        {recipe.instructions.map((instruction, index) => (
          <View key={index} style={{ flexDirection: 'row' }}>
            <Text style={styles.boldText}>{`${index + 1}.`}</Text>
            <Text style={styles.instructions}>{instruction}</Text>
          </View>
        ))}
        <Text style={styles.enjoyText}>Enjoy!</Text>
      </ScrollView>
      {/* Toolbar */}
      <Toolbar />
    </SafeAreaView>
  );
};

// Styling for the RecipeDetails component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 30,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backImage: {
    width: 70,
    height: 70,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: '#fff',
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
    fontSize: 22,
    marginBottom: 20,
    padding: 10,
  },
  recipeInfo: {
    fontSize: 20,
    marginBottom: 30,
    paddingRight: 100,
  },
  ingredients: {
    fontSize: 20,
    marginBottom: 30,
    paddingRight: 20,
  },
  instructions: {
    fontSize: 20,
    marginBottom: 30,
    paddingRight: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  boldText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 30,
  },
  enjoyText: {
    fontSize: 24,
    paddingBottom: 120,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

// Export the RecipeDetails component
export default RecipeDetails;
