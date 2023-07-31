// Necessary React and React Native imports
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import firebase, { database } from './firebaseConfig';
import { ref, set, push } from 'firebase/database';
import 'firebase/compat/database';

// Local component imports
import Toolbar from './Toolbar';
import { ScrollView } from 'react-native-gesture-handler';

// AddRecipe component
const AddRecipe = ({ navigation }) => {
  // State to store the recipe details
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState('');
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [mealType, setMealType] = useState('');

  // Function to save new recipe to Firebase
  const saveRecipeToFirebase = () => {
    try {
      // Reference to 'recipes' in the Firebase database
      const recipesRef = ref(database, 'recipes');

      // Making user input the desired format
      const ingredientsArray = ingredients.split(',').map(item => item.trim());
      const instructionsArray = cookingInstructions.split(',').map(item => item.trim());

      // The new recipe object
      const newRecipe = {
        recipeName,
        description,
        ingredients: ingredientsArray,
        servings: parseInt(servings),
        cookingInstructions: instructionsArray,
        cuisine,
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        mealType,
      };

      // Save the new recipe in the Firebase database
      set(push(recipesRef), newRecipe);

      // Notify user of successful save
      Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');

      // Redirect to home screen
      navigation.navigate('HomeScreen');
    } catch (error) {
      // Log and notify user of error
      console.error('Failed to save recipe', error.message);
      Alert.alert('Failed to save recipe', 'An error occurred while saving the recipe.');
    }
  };

  // Render the AddRecipe component
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Input fields for recipe details */}
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={recipeName}
          onChangeText={(text) => setRecipeName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline // Enable multiline input
          numberOfLines={4} // Set the initial number of lines to show
        />
        <TextInput
          style={styles.input}
          placeholder="Ingredients (separate by ,)"
          value={ingredients}
          onChangeText={(text) => setIngredients(text)}
          multiline // Enable multiline input
          numberOfLines={4} // Set the initial number of lines to show
          onSubmitEditing={() => { }} // This function will handle the "Enter" key press
        />

        <TextInput
          style={styles.input}
          placeholder="Servings"
          value={servings}
          onChangeText={(text) => setServings(text.replace(/[^0-9]/g, ''))} // Only allow numeric input
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Cooking Instructions (separate by ,)"
          value={cookingInstructions}
          onChangeText={(text) => setCookingInstructions(text)}
          multiline // Enable multiline input
          numberOfLines={4} // Set the initial number of lines to show
          onSubmitEditing={() => { }} // This function will handle the "Enter" key press
        />

        <TextInput
          style={styles.input}
          placeholder="Cuisine"
          value={cuisine}
          onChangeText={(text) => setCuisine(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Preparation Time (Minutes)"
          value={prepTime}
          onChangeText={(text) => setPrepTime(text.replace(/[^0-9]/g, ''))} // Only allow numeric input
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Cooking Time (Minutes)"
          value={cookTime}
          onChangeText={(text) => setCookTime(text.replace(/[^0-9]/g, ''))} // Only allow numeric input
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Meal Type"
          value={mealType}
          onChangeText={(text) => setMealType(text)}
        />
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveRecipeToFirebase}>
        <Text style={styles.buttonText}>Save Recipe</Text>
      </TouchableOpacity>

      {/* Toolbar */}
      <Toolbar />
    </SafeAreaView>
  );
};

// Styling for the AddRecipe component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 125,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

// Export the AddRecipe component
export default AddRecipe;
