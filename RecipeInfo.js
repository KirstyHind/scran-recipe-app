import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// If the recipe is still loading, display a loading message
const RecipeInfo = ({ recipe }) => {
    if (!recipe) {
        return null;
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
    const totalTime = prepTime + cookTime;
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    const displayTime = hours > 0 ? `${hours} hours ${minutes} minutes` : `${minutes} minutes`;

    return (
        <View style={styles.container}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
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
    listItem: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default RecipeInfo;
