// LoginScreen.js
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titleLabel}>Welcome</Text>
            <TextInput placeholder='Username' style={styles.textField} placeholderTextColor='white' />
            <TextInput placeholder='Password' style={styles.textField} placeholderTextColor= 'white' />
            <Text style={{color: 'white', fontSize: 16, marginTop: 20}}>Don't have an account? <Button title='Sign Up' onPress={() => navigation.navigate('SignUp')} /></Text>
            <Button title='Login' onPress={() => navigation.navigate('MainScreen')} />
            <Button title='Login As Guest' onPress={() => navigation.navigate('MainScreen')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#80ed99',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textField: {
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        margin: 20,

        
    },

    titleLabel: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        color: 'white'

    }
});
