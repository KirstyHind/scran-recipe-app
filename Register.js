// Import necessary modules and hooks from React and React Native
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication methods

// Define the Register component
const Register = () => {
    // Use the useNavigation hook to access the navigation object
    const navigation = useNavigation();

    // State variables to store the user's email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle user registration
    const handleRegistration = () => {
        // Get the Firebase Auth instance
        const auth = getAuth();

        // Check if the email and password fields are not empty
        if (email.trim() !== '' && password.trim() !== '') {
            // Create a new user account with the provided email and password
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // User registration successful, you can now access the user data using `userCredential.user`
                    console.log('User registration successful:', userCredential.user);
                    // Show the success message in a pop-up
                    Alert.alert('Success', 'Account created successfully!');
                    // Navigate to the home page after successful registration
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    // Handle any errors that occurred during registration
                    console.error('Registration error:', error.message);
                    // Show the error message in a pop-up
                    Alert.alert('Error', 'Email already in use. Please use a different email.');
                });
        } else {
            // Handle the case where email or password is empty
            console.warn('Please enter a valid email and password.');
        }
    };

    // Render the Register component
    return (
        <View style={styles.container}>
            {/* Input fields for email and password */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            {/* Register button to initiate user registration */}
            <Button title="Register" onPress={handleRegistration} />
        </View>
    );
};

// Styling for the Register component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

// Export the Register component as the default export
export default Register;
