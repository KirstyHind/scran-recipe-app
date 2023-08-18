import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputBox = ({ placeholder, isPassword = false, onChangeText, value, onSubmitEditing, keyboardType = 'default' }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={isPassword}
            onChangeText={onChangeText}
            value={value}
            keyboardType={keyboardType}
            autoCapitalize={isPassword ? 'none' : 'sentences'}
            onSubmitEditing={onSubmitEditing}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        minWidth: '100%',
        minHeight: '5%',
        marginBottom: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default InputBox;