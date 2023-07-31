// Import necessary modules and hooks
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Define the Register component
const Register = () => {
    // Use the useNavigation hook to access the navigation object
    const navigation = useNavigation();

    // State variables to store the user's email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to check if the email is in the correct format
    const isEmailValid = (email) => {
        // Regular expression to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to handle user registration
    const handleRegistration = () => {
        // Get the Firebase Auth instance
        const auth = getAuth();

        // Check if the email and password fields are not empty
        if (email.trim() !== '' && password.trim() !== '') {
            // Check if the email is in the correct format
            if (!isEmailValid(email)) {
                // Show an error pop-up if email is not in the correct format
                Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
                return;
            }

            // Check if the password is at least 6 characters long
            if (password.length < 6) {
                // Show an error pop-up if password is less than 6 characters
                Alert.alert('Error', 'Password should be at least 6 characters long.');
                return;
            }

            // Create a new user account with the provided email and password
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Show the success message in a pop-up
                    Alert.alert('Success', 'Account created successfully!');
                    // Navigate to the home page after successful registration
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    // Show the error message in a pop-up
                    Alert.alert('Error', 'Email already in use. Please use a different email.');
                });
        } else {
            // Show an error pop-up if email or password is empty
            Alert.alert('Error', 'Please enter a valid email and password.');
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

// Export the Register component
export default Register;