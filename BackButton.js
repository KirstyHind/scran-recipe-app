import React from 'react';
import { TouchableOpacity, Image, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image 
                source={require('./assets/backbutton.png')} 
                style={styles.backImage} 
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: '8%',
        left: '8%',
    },
    backImage: {
        width: 70,
        height: 70,
    },
});

export default BackButton;
