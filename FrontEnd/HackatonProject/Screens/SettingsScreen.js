import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons'; // Import the AntDesign icon

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [newUsername, setNewUsername] = useState('');

  const handleChangeUsername = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const userRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(userRef, { username: newUsername });
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter new username"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangeUsername}>
        <Text style={styles.buttonText}>Change Username</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40, // Adjust according to your app's layout
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
