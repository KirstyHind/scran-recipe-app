// Import necessary modules and hooks
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AppName from './AppName';
import HeaderText from './HeaderText';
import CustomButton from './CustomButton';
import BackButton from './BackButton';
import InputBox from './InputBox';


// Define login component
const Login = () => {
    // Use the useNavigation hook to access the navigation object
    const navigation = useNavigation();

    // Define state variables for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to check email format
    const isEmailValid = (email) => {
        // Expression to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to handle user login
    const handleLogin = () => {
        // Get Firebase Auth instance
        const auth = getAuth();

        // Check if the email and password fields are not empty
        if (email.trim() !== '' && password.trim() !== '') {
            // Check if the email is in the correct format
            if (!isEmailValid(email)) {
                // Show an error pop-up if email is not in the correct format
                Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
                return;
            }

            // Sign in the user with the provided email and password
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    // Navigate to the home page after successful login
                    navigation.navigate('HomeScreen');
                })
                // Handle any errors that occurred during login
                .catch((error) => {
                    console.error('Login error:', error.message);
                    // Show an error pop-up if login failed
                    Alert.alert('Error', 'Invalid email or password. Please try again.');
                });
        } else {
            // Show an error pop-up if email or password is empty
            Alert.alert('Error', 'Please enter a valid email and password.');
        }
    };

    // Render the login component
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <AppName />
                <HeaderText>Log In</HeaderText>
                <View style={styles.login}>
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
                    />
                </View>
                <CustomButton
                    title="Login"
                    onPress={handleLogin}
                    style={{ minWidth: '75%', minHeight: '7%',}}
                />
                <BackButton onPress={() => navigation.navigate('Home')} />
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
    login: {
        marginTop: 200,
    }
});

// Export the Login component
export default Login;
