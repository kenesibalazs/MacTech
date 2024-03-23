import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert , ImageBackground} from 'react-native';
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
        <ImageBackground source={require('../assets/background.png')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
           
            <Text style={styles.titleLabel}>Welcome</Text>
            <TextInput
                placeholder='Email'
                style={styles.textField}
                placeholderTextColor='#fff'
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput
                placeholder='Password'
                style={styles.textField}
                placeholderTextColor='#fff'
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                value={password}
            />
            <LoginButton title='Login' onPress={signIn} backgroundColor='#0FA3B1' />
            <LoginButton title='Create Account' onPress={signUp} backgroundColor='#2292A4' />

            
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textField: {
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        margin: 20,
    },
    titleLabel: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#fff'
    }
});
