// Necessary React and React Native imports
import React, { useState } from 'react';
import { Text, StyleSheet, Alert, TextInput, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import firebase, { database } from './firebaseConfig';
import { ref, set, push } from 'firebase/database';
import 'firebase/database';

// Local component imports
import Toolbar from './Toolbar';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from './BackButton';
import InputBox from './InputBox';
import HeaderText from './HeaderText';
import CustomButton from './CustomButton';

// AddRecipe component
const AddRecipe = ({ navigation }) => {
  // State to store the recipe details
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImageLink] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState('');
  const [instructions, setInstructions] = useState('');
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
      const instructionsArray = instructions.split(',').map(item => item.trim());
      const dietaryArray = dietaryRequirements.split(',').map(item => item.trim());

      // The new recipe object
      const newRecipe = {
        recipeName,
        description,
        image,
        ingredients: ingredientsArray,
        servings: parseInt(servings),
        instructions: instructionsArray,
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
        <HeaderText>Add a Recipe</HeaderText>
        <BackButton />
        <ScrollView contentContainerStyle={styles.content}>
          {/* Input fields for recipe details */}
          <InputBox
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
          <InputBox
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

          <InputBox
            placeholder="Servings"
            value={servings}
            onChangeText={(text) => setServings(text.replace(/[^0-9]/g, ''))} // Only allow numeric input
            keyboardType="numeric"
          />

          <TextInput
            style={styles.inputWider}
            placeholder="Cooking Instructions (separate by ,)"
            value={instructions}
            onChangeText={(text) => setInstructions(text)}
            multiline // Enable multiline input
            numberOfLines={4} // Set the initial number of lines to show
            onSubmitEditing={() => { }} // This function will handle the "Enter" key press
          />

          <InputBox
            placeholder="Cuisine"
            value={cuisine}
            onChangeText={(text) => setCuisine(text)}
          />

          <InputBox
            placeholder="Preparation Time (Minutes)"
            value={prepTime}
            onChangeText={(text) => setPrepTime(text.replace(/[^0-9]/g, ''))} // Only allow numeric input
            keyboardType="numeric"
          />

          <InputBox
            placeholder="Cooking Time (Minutes)"
            value={cookTime}
            onChangeText={(text) => setCookTime(text.replace(/[^0-9]/g, ''))} // Only allow numeric input
            keyboardType="numeric"
          />

          <InputBox
            placeholder="Meal Type"
            value={mealType}
            onChangeText={(text) => setMealType(text)}
          />

          <InputBox
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

        {/* Add Recipe button */}
        <CustomButton
          title="Add Recipe"
          onPress={saveRecipeToFirebase}
          style={{padding: 20, width: '75%', minHeight: '7%', marginBottom: 100,}}
        />

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
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  inputWide: {
    backgroundColor: '#fff',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 20,
  },
  inputWider: {
    backgroundColor: '#fff',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    padding: 20,
  },
  endText: {
    paddingBottom: 80,
    paddingTop: 200,
  }
});

// Export the AddRecipe component
export default AddRecipe;
