import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import LoginButton from '../costumElements/loginButton';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, username, password);
            console.log(response);
            navigation.navigate('MainScreen', { username: username });
        } catch (error) {
            console.log(error);
            Alert.alert('Invalid credentials', 'Please check your username and password');
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, username, password);
            const user = response.user;
            navigation.navigate('MainScreen', { username: username });
        } catch (error) {
            console.log(error);
            Alert.alert('Invalid credentials', 'Please check your username and password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleLabel}>Welcome</Text>
            <TextInput
                placeholder='Email'
                style={styles.textField}
                placeholderTextColor='#5A5A66'
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput
                placeholder='Password'
                style={styles.textField}
                placeholderTextColor='#5A5A66'
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                value={password}
            />
            <LoginButton title='Login' onPress={signIn} backgroundColor='#0FA3B1' />
            <LoginButton title='Create Account' onPress={signUp} backgroundColor='#2292A4' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textField: {
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#5A5A66',
        margin: 20,
    },
    titleLabel: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#5A5A66'
    }
});
