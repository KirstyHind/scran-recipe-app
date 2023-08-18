// Import necessary packages and components
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Toolbar from './Toolbar';
import BackButton from './BackButton';
import RecipeCard from './RecipeCard';
import HeaderText from './HeaderText';

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
        <>
            <SafeAreaView style={styles.container}>
                <HeaderText >Saved Recipes</HeaderText>
                <BackButton/>
                <ScrollView>
                    {savedRecipes.length > 0 ? (
                        savedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
                    ) : (
                        <Text style={styles.noRecText}>No saved recipes.</Text>
                    )}
                    <Text style={styles.endText}>End</Text>
                </ScrollView>
            </SafeAreaView>
            <Toolbar />
        </>
    );
};

// Styling for the SavedRecipes component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 30,
        textAlign: 'center',
    },
    noRecText: {
        paddingLeft: 20,
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
