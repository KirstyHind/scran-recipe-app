import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import firebase from 'firebase/app'; // Import only the "app" module from Firebase
import 'firebase/compat/database';
import Toolbar from './Toolbar';
import { ScrollView } from 'react-native-gesture-handler';

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

  // Function to save the recipe to Firebase Realtime Database
  const saveRecipeToFirebase = () => {
    try {
      // Log the values of the variables before saving to the database
      console.log("Recipe Name:", recipeName);
      console.log("Description:", description);
      console.log("Ingredients:", ingredients);
      console.log("Servings:", servings);
      console.log("Cooking Instructions:", cookingInstructions);
      console.log("Cuisine:", cuisine);
      console.log("Preparation Time:", prepTime);
      console.log("Cooking Time:", cookTime);
      console.log("Meal Type:", mealType);

      // Get a reference to the "recipes" node in Firebase Realtime Database
      const recipesRef = firebase.database().ref('recipes');

      // Create a new recipe entry with the provided data
      const newRecipeRef = recipesRef.push({
        recipeName,
        description,
        ingredients,
        servings,
        cookingInstructions,
        cuisine,
        prepTime,
        cookTime,
        mealType,
      });

      // Show an alert when the recipe is successfully saved
      Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');

      // Redirect the user to the home page (you may customize this based on your navigation setup)
      navigation.navigate('Home');
    } catch (error) {
      // Show an alert if there was an error saving the recipe
      Alert.alert('Failed to save recipe', 'An error occurred while saving the recipe.');
    }
  };

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
        placeholder="Ingredients"
        value={ingredients}
        onChangeText={(text) => setIngredients(text)}
        multiline // Enable multiline input
        numberOfLines={4} // Set the initial number of lines to show
        onSubmitEditing={() => {}} // This function will handle the "Enter" key press
      />

      <TextInput
        style={styles.input}
        placeholder="Servings"
        value={servings}
        onChangeText={(text) => setServings(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Cooking Instructions"
        value={cookingInstructions}
        onChangeText={(text) => setCookingInstructions(text)}
        multiline // Enable multiline input
        numberOfLines={4} // Set the initial number of lines to show
        onSubmitEditing={() => {}} // This function will handle the "Enter" key press
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
        onChangeText={(text) => setPrepTime(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Cooking Time (Minutes)"
        value={cookTime}
        onChangeText={(text) => setCookTime(text)}
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
  
  export default AddRecipe;
