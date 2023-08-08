// Import necessary packages and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Toolbar from './Toolbar';

// Define the SavedRecipes component
const SavedRecipes = () => {
    // Create navigation and savedRecipes state
    const navigation = useNavigation();
    const [savedRecipes, setSavedRecipes] = useState([]);

    // Fetch saved recipes function definition
    const fetchSavedRecipes = () => {
        // Get current user and database reference
        const auth = getAuth();
        const database = getDatabase();
        const savedRecipesRef = ref(database, `users/${auth.currentUser.uid}/savedRecipes`);

        // Define the value change handler
        const onValueChange = snapshot => {
            if (snapshot.exists()) {
                // Transform the snapshot to a list of recipes
                const data = snapshot.val();
                const allSavedRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

                setSavedRecipes(allSavedRecipes);
            } else {
                // Set empty recipes list if there's no data
                setSavedRecipes([]);
            }
        }

        // Attach the value change listener
        onValue(savedRecipesRef, onValueChange);

        // Cleanup function for removing the listener
        return () => off(savedRecipesRef, 'value', onValueChange);
    };

    // Fetch saved recipes on component mount
    useEffect(() => {
        const cleanup = fetchSavedRecipes();

        return cleanup;
    }, []);

    // Render the SavedRecipes component
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Saved Recipes</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={require('./assets/backbutton.png')} style={[styles.backImage, styles.imageBorder]} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.content}>
                {savedRecipes.length > 0 ? (
                    savedRecipes.map((recipe) => (
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
                    <Text style={styles.noRecText}>No saved recipes.</Text>
                )}
                <Text style={styles.endText}>End</Text>
            </ScrollView>

            {/* Toolbar */}
            <Toolbar />
        </SafeAreaView>

    );
};

// Styling for the SavedRecipes component
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
    noRecText: {
        paddingLeft: 20,
    },
    recipeContainer: {
        flexDirection: 'row',
        padding: 10,
        paddingTop: 20,
    },
    recipeDetails: {
        flex: 1,
    },
    recipeImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeDescription: {
        fontSize: 16,
    },
    endText: {
        fontSize: 20,
        paddingBottom: 80,
        paddingTop: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      }
});

// Export the SavedRecipes component
export default SavedRecipes;
