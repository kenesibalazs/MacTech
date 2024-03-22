import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

import LoginButton from '../costumElements/loginButton';
export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'password') {
            navigation.navigate('MainScreen', { username: username });
        } else {
            Alert.alert('Invalid credentials', 'Please check your username and password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleLabel}>Welcome</Text>
            <TextInput 
                placeholder='Username' 
                style={styles.textField} 
                placeholderTextColor='white' 
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput 
                placeholder='Password' 
                style={styles.textField} 
                placeholderTextColor='white' 
                onChangeText={text => setPassword(text)}
                secureTextEntry={true} 
                value={password}
            />
            {/* <Text style={{color: 'white', fontSize: 16, marginTop: 20}}>Don't have an account? <Button title='Sign Up' onPress={() => navigation.navigate('SignUp')} /></Text> */}
            
            <LoginButton title='Login' onPress={handleLogin} backgroundColor='#0096c7'/>
            <LoginButton title='Login As Guest' onPress={() => navigation.navigate('MainScreen', { username: 'Guest' })} backgroundColor='#48cae4'/>
           
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#38a3a5',
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
        color: '#caf0f8'
    }
});
