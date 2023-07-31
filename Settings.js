// Import necessary libraries and components
import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, SectionList, TextInput } from 'react-native';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';


// Settings component
const Settings = () => {
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
        {
            title: 'User Settings', // User Settings section
            data: [
                // Notifications option
                { id: '3', name: 'Notifications', expanded: false },
                // Profile option
                { id: '4', name: 'Profile', expanded: false },
            ],
        },
    ]);

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
        <View style={styles.container}>
            <Text style={styles.headerText}>Settings</Text>
            <SectionList
                sections={settings}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index, section }) => (
                    <TouchableOpacity style={styles.settingOption} onPress={() => handlePress(section.title === 'Account Settings' ? 0 : 1, index)}>
                        <Text style={styles.optionText}>{item.name}</Text>
                        {item.expanded && <Text style={styles.text}>Details of {item.name}</Text>}
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
            />
        </View>
    );
};

// Styling for the Settings component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    settingOption: {
        backgroundColor: '#000000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    text: {
        fontSize: 16,
        padding: 10,
        color: '#fff',
    },
});

// Export the Settings component
export default Settings;
