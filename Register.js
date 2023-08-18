// Import necessary modules and hooks
import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import AppName from './AppName';
import HeaderText from './HeaderText';
import CustomButton from './CustomButton';
import BackButton from './BackButton';
import InputBox from './InputBox';

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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <AppName />
                <Text style={styles.registerText}>Register</Text>
                <View style={styles.register}>
                    <InputBox
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        keyboardType="email-address"
                    />
                    <InputBox
                        placeholder="Password"
                        isPassword={true}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        onSubmitEditing={handleRegistration}
                    />
                </View>
                <CustomButton
                    title="Register"
                    onPress={handleRegistration}
                    style={{ width: '75%', height: '7%',}}
                />
                <BackButton/>
            </View>
        </TouchableWithoutFeedback>
    );
};

// Define styles for the components
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
        marginBottom: 80,
        textAlign: 'center',
      },
    register: {
        marginTop: 50,
    }
});

// Export the Register component
export default Register;