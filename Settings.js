// Import necessary libraries and components
import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, SectionList, TextInput, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Toolbar from './Toolbar';


// Settings component
const Settings = () => {
    const navigation = useNavigation();
    const auth = getAuth();

    const updateFirebaseEmail = async (email, confirmEmail, currentPassword) => {
        if (email !== confirmEmail) {
            Alert.alert("Email addresses don't match!");
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
                await updateEmail(user, email);
                Alert.alert('Email updated successfully');
                // Reset settings after successful email update
                resetSettings();
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    const updateFirebasePassword = async (currentPassword, newPassword, confirmPassword) => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Passwords don't match!");
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                Alert.alert('Password updated successfully');
                // Reset settings after successful password update
                resetSettings();
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    // State for settings options
    const [settings, setSettings] = useState([
        {
            title: 'Account Settings', // Account Settings section
            data: [
                // Email change option
                { id: '1', name: 'Change Email', expanded: false, email: '', confirmEmail: '' },
                // Password change option
                { id: '2', name: 'Change Password', expanded: false, password: '', confirmPassword: '' },
            ],
        },
    ]);

    // Function to reset settings to initial state
    const resetSettings = () => {
        setSettings([
            {
                title: 'Account Settings',
                data: [
                    { id: '1', name: 'Change Email', expanded: false, email: '', confirmEmail: '' },
                    { id: '2', name: 'Change Password', expanded: false, password: '', confirmPassword: '' },
                ],
            },
            {
                title: 'User Settings',
                data: [
                    { id: '3', name: 'Notifications', expanded: false },
                    { id: '4', name: 'Profile', expanded: false },
                ],
            },
        ]);
    };

    // Function to handle option press
    const handlePress = (sectionIndex, itemIndex) => {
        // Setting the new state
        setSettings((prevSettings) => {
            const newSettings = [...prevSettings];
            newSettings[sectionIndex].data[itemIndex].expanded = !newSettings[sectionIndex].data[itemIndex].expanded;
            return newSettings;
        });
    };
    // Render the Settings component
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={require('./assets/backbutton.png')} style={[styles.backImage, styles.imageBorder]} />
            </TouchableOpacity>
            <SectionList
                sections={settings}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index, section }) => (
                    <TouchableOpacity
                        style={styles.settingOption}
                        onPress={() => handlePress(section.title === 'Account Settings' ? 0 : 1, index)}
                    >
                        <Text style={styles.optionText}>{item.name}</Text>
                        {item.expanded && item.name === 'Change Email' && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="New Email"
                                    onChangeText={(text) =>
                                        setSettings((prev) => {
                                            const clone = [...prev];
                                            clone[0].data[0].email = text;
                                            return clone;
                                        })
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm New Email"
                                    onChangeText={(text) =>
                                        setSettings((prev) => {
                                            const clone = [...prev];
                                            clone[0].data[0].confirmEmail = text;
                                            return clone;
                                        })
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    placeholder="Current Password"
                                    onChangeText={(text) =>
                                        setSettings((prev) => {
                                            const clone = [...prev];
                                            clone[0].data[0].password = text;
                                            return clone;
                                        })
                                    }
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        updateFirebaseEmail(item.email, item.confirmEmail, item.password)
                                    }
                                >
                                    <Text>Update Email</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        {item.expanded && item.name === 'Change Password' && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    placeholder="Current Password"
                                    onChangeText={(text) =>
                                        setSettings((prev) => {
                                            const clone = [...prev];
                                            clone[0].data[1].password = text;
                                            return clone;
                                        })
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    placeholder="New Password"
                                    onChangeText={(text) =>
                                        setSettings((prev) => {
                                            const clone = [...prev];
                                            clone[0].data[1].newPassword = text;
                                            return clone;
                                        })
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    placeholder="Confirm New Password"
                                    onChangeText={(text) =>
                                        setSettings((prev) => {
                                            const clone = [...prev];
                                            clone[0].data[1].confirmPassword = text;
                                            return clone;
                                        })
                                    }
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        updateFirebasePassword(item.password, item.newPassword, item.confirmPassword)
                                    }
                                >
                                    <Text>Update Password</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            />
            <Text style={styles.endText}>End</Text>
            {/* Toolbar */}
            <Toolbar />
        </SafeAreaView>
    );
};

// Styling for the Settings component
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 30,
        textAlign: 'center',
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
    settingOption: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    optionText: {
        color: '#000000',
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionHeader: {
        padding: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        padding: 10,
        color: '#000000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
        height: 45,
    },

    button: {
        backgroundColor: '#fcf3cf',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        alignItems: 'center',
    },
    endText: {
        fontSize: 20,
        paddingBottom: 20,
        paddingTop: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      }
});

// Export the Settings component
export default Settings;
