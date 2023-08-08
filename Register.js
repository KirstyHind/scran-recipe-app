// Import necessary modules and hooks
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text, Image } from 'react-native';
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
                .then(() => {
                    // Show the success message in a pop-up
                    Alert.alert('Success', 'Account created successfully!');
                    // Navigate to the home page after successful registration
                    navigation.navigate('Home');
                })
                .catch(error => {
                    // Handling specific error messages from Firebase
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            Alert.alert('Error', 'Email already in use. Please use a different email.');
                            break;
                        case 'auth/invalid-email':
                            Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
                            break;
                        case 'auth/weak-password':
                            Alert.alert('Error', 'Password is too weak. Choose a stronger password.');
                            break;
                        default:
                            Alert.alert('Error', 'An error occurred. Please try again.');
                            break;
                    }
                });
        };
    };

    // Render the Register component
    return (
        <View style={styles.container}>
            <Text style={styles.registerText}>Register</Text>
            {/* Input fields for email and password */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}>
                <Image source={require('./assets/backbutton.png')} style={styles.backImage} />
            </TouchableOpacity>
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
    registerText: {
        fontSize: 40,
        fontWeight: 'bold',
        height: 150,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
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
    button: {
        backgroundColor: '#fcf3cf',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 5,
        borderWidth: 1,
        margin: 5,
        minWidth: 200,
        minHeight: 50,
        textAlign: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});

// Export the Register component
export default Register;