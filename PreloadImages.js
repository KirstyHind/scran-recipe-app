import React, { useEffect } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import FastImage from 'react-native-fast-image';

const PreloadImages = () => {
  // Function to fetch all recipes from Firebase database
  const fetchAllImages = () => {
    const database = getDatabase();
    // Create reference to 'recipes' in database
    const recipesRef = ref(database, 'recipes');

    // Function to handle value changes in recipes reference
    const onValueChange = snapshot => {
      if (snapshot.exists()) {
        // Snapshot of the data from 'recipes' reference
        const data = snapshot.val();
        // Convert data to array format
        const allRecipes = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

        // Preload all images using FastImage
        allRecipes.forEach((recipe) => {
          if (recipe.image) {
            FastImage.preload([{uri: recipe.image}]);
          }
        });
      }
    }
    // Attach listener to recipes reference
    onValue(recipesRef, onValueChange);

    // Return a cleanup function to remove the listener
    return () => off(recipesRef, 'value', onValueChange);
  };

  // Call fetchAllImages when the component is mounted
  useEffect(() => {
    fetchAllImages();
  }, []);

  return null;
};

export default PreloadImages;
