// HeaderText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const HeaderText = (props) => {
    return (
        <Text style={[styles.headerText, props.style]}>
            {props.children}
        </Text>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        padding: 35,
        textAlign: 'center',
      },
});

export default HeaderText;
