import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Settings = ({navigation}) => {
  
  // Function to handle Account Settings press
  const handleAccountSettingsPress = () => {
    // You can navigate to Account Settings screen if you have it
    // navigation.navigate('AccountSettings');
    console.log("Navigate to Account Settings");
  };

  // Function to handle User Settings press
  const handleUserSettingsPress = () => {
    // You can navigate to User Settings screen if you have it
    // navigation.navigate('UserSettings');
    console.log("Navigate to User Settings");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

      <TouchableOpacity style={styles.settingOption} onPress={handleAccountSettingsPress}>
        <Text style={styles.optionText}>Account Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingOption} onPress={handleUserSettingsPress}>
        <Text style={styles.optionText}>User Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Settings;
