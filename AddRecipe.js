// Necessary React and React Native imports
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, TextInput, SafeAreaView, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import firebase, { database } from './firebaseConfig';
import { ref, set, push } from 'firebase/database';
import 'firebase/database';

// Local component imports
import Toolbar from './Toolbar';
import { ScrollView } from 'react-native-gesture-handler';

// AddRecipe component
const AddRecipe = ({ navigation }) => {
  // State to store the recipe details
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImageLink] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState('');
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [mealType, setMealType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');

  // Function to save new recipe to Firebase
  const saveRecipeToFirebase = () => {
    try {
      // Reference to 'recipes' in the Firebase database
      const recipesRef = ref(database, 'recipes');

      // Making user input the desired format
      const ingredientsArray = ingredients.split(',').map(item => item.trim());
      const instructionsArray = cookingInstructions.split(',').map(item => item.trim());
      const dietaryArray = dietaryRequirements.split(',').map(item => item.trim());

      // The new recipe object
      const newRecipe = {
        recipeName,
        description,
        image,
        ingredients: ingredientsArray,
        servings: parseInt(servings),
        cookingInstructions: instructionsArray,
        cuisine,
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        mealType,
        difficulty,
        dietaryRequirements: dietaryArray,
      };

      // Save the new recipe in the Firebase database
      set(push(recipesRef), newRecipe);

      // Notify user of successful save
      Alert.alert('Recipe saved!', 'Your recipe has been successfully saved.');

      // Redirect to home screen
      navigation.navigate('HomeScreen');
    } catch (error) {
      // Log and notify user of error
      Alert.alert('Failed to save recipe', 'An error occurred while saving the recipe.');
    }
  };

  // Render the AddRecipe component
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Add a Recipe</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('./assets/backbutton.png')} style={[styles.backImage, styles.imageBorder]} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Input fields for recipe details */}
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={recipeName}
          onChangeText={(text) => setRecipeName(text)}
        />
        <TextInput
          style={styles.inputWide}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline // Enable multiline input
          numberOfLines={4} // Set the initial number of lines to show
        />
        <TextInput
          style={styles.input}
          placeholder="Image Link (jpeg)"
          value={image}
          onChangeText={(text) => setImageLink(text)}
        />
        <TextInput
          style={styles.inputWider}
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
          style={styles.inputWider}
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

        <TextInput
          style={styles.input}
          placeholder="Difficulty"
          value={difficulty}
          onChangeText={(text) => setDifficulty(text)}
        />
        
        <TextInput
          style={styles.inputWider}
          placeholder="Dietary Requirements (separate by ,)"
          value={dietaryRequirements}
          onChangeText={(text) => setDietaryRequirements(text)}
          multiline // Enable multiline input
          numberOfLines={4} // Set the initial number of lines to show
          onSubmitEditing={() => { }} // This function will handle the "Enter" key press
        />
        <Text style={styles.endText}></Text>
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveRecipeToFirebase}>
        <Text style={styles.buttonText}>Add Recipe</Text>
      </TouchableOpacity>
      
      {/* Toolbar */}
      <Toolbar />
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

// Styling for the AddRecipe component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
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
  input: {
    backgroundColor: '#fff',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputWide: {
    backgroundColor: '#fff',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputWider: {
    backgroundColor: '#fff',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#fcf3cf',
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
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endText: {
    paddingBottom: 80,
    paddingTop: 200,
  }
});

// Export the AddRecipe component
export default AddRecipe;
