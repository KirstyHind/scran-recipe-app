// AppName.js
import React from 'react';
import { View, StyleSheet, Text, textStyle } from 'react-native';

const AppName = () => {
    return (
        <View style={styles.container}>
            <Text style={[styles.scranText, textStyle]}>{title="SCRAN"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '10%',
    },
    scranText: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
      },
});

export default AppName;