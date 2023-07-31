// Import necessary packages and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import Toolbar from './Toolbar';

// Define the HomeScreen component
const HomeScreen = () => {
  const navigation = useNavigation();

  // State to store the user's email
  const [userEmail, setUserEmail] = useState('');

  // State to store the user's username extracted from the email
  const [username, setUsername] = useState('');

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Navigate to the login screen after successful logout
        navigation.navigate('Login');
      })
      .catch((error) => {
        // Handle any errors that occurred during logout
        console.error('Logout error:', error.message);
      });
  };

  // Function to handle search input change
  const handleSearchInputChange = (text) => {
    // Set the search query in the state
    setSearchQuery(text);
    // Implement any search logic here based on the searchQuery
  };

  // Function to handle search button press
  const handleSearchButtonPress = () => {
    if (searchQuery.trim() !== '') {
      navigation.navigate('SearchResult', { keyword: searchQuery });
      setSearchQuery('');
    }
  };

  // Function to handle submit of the search input field
  const handleSubmitEditing = () => {
    if (searchQuery.trim() !== '') {
      handleSearchButtonPress();
    }
  };

  // Effect hook to get the user's email when the component mounts
  useEffect(() => {
    const auth = getAuth();

    // Check if the user is logged in
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, set the email in the state
        setUserEmail(user.email);
      } else {
        // User is not logged in, navigate to the login screen
        navigation.navigate('Login');
      }
    });
  }, [navigation]);

  // Effect hook to extract the username from the email and set it in the state
  useEffect(() => {
    if (userEmail) {
      // Extract the username from the email using split()
      const usernameFromEmail = userEmail.split('.')[0];

      // Set the username in the state
      setUsername(usernameFromEmail.charAt(0).toUpperCase() + usernameFromEmail.slice(1));
    }
  }, [userEmail]);

  // Render the HomeScreen component
  return (
    <View style={styles.container}>
      {/* User Details */}
      <View style={styles.userDetailsContainer}>
        <Text style={styles.userDetails}>Welcome {username}!</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={handleSearchInputChange}
          onSubmitEditing={handleSubmitEditing}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Toolbar */}
      <Toolbar />
    </View>
  );
};

// Styling for the HomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  userDetailsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  userDetails: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center',
    top: 35,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

// Export the HomeScreen component
export default HomeScreen;
