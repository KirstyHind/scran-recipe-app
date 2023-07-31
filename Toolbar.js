// Import necessary modules and hooks
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the Toolbar component
const Toolbar = () => {
  // Hook to enable navigation
  const navigation = useNavigation();

  // Handler for navigation to the 'AddRecipe' screen
  const handleAddRecipeButtonPress = () => {
    navigation.navigate('AddRecipe');
  };

  // Handler for navigation to the 'HomeScreen' screen
  const handleHomeButtonPress = () => {
    navigation.navigate('HomeScreen');
  };

  // Handler for navigation to the 'SavedRecipes' screen
  const handleSaveButtonPress = () => {
    navigation.navigate('SavedRecipes');
  };

  // Handler for navigation to the 'Settings' screen
  const handleSettingsButtonPress = () => {
    navigation.navigate('Settings');
  };

  // Render Toolbar component with navigation buttons
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={handleHomeButtonPress}>
        <Image source={require('scran-recipe-app/assets/home.png')} style={styles.toolbarButton} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSaveButtonPress}>
        <Image source={require('scran-recipe-app/assets/save_toolbar.png')} style={styles.toolbarButton} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddRecipeButtonPress}>
        <Image source={require('scran-recipe-app/assets/plus.png')} style={styles.toolbarButton} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSettingsButtonPress}>
        <Image source={require('scran-recipe-app/assets/setting.png')} style={styles.toolbarButton} />
      </TouchableOpacity>
    </View>
  );
};

// Define styles for the Toolbar component
const styles = StyleSheet.create({
  toolbar: {
    width: '100%',
    height: 100,
    backgroundColor: '#fcf3cf',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  toolbarButton: {
    backgroundColor: '#fcf3cf',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

// Export the Toolbar component
export default Toolbar;
