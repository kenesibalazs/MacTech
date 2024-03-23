import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList ,ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(FIREBASE_DB, 'users');
        const q = query(usersRef, orderBy('score', 'desc'));
        const querySnapshot = await getDocs(q);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Get the current user's ID
    // You should replace this with your authentication logic to get the current user's ID
    setCurrentUserId('currentUserIdHere');
  }, []);

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={{width: '100%', height: '100%'}}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity onPress={handleClose}>
          <AntDesign name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <View style={styles.userItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={[styles.playerId, item.id === currentUserId ? styles.currentUserId : null]}>{item.id}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'trasparent',
    padding: 20,
    marginTop: 40,
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
    color:'#fff'
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  rank: {
    marginRight: 10,
    fontWeight: 'bold',
    color:'#fff'
  },
  username: {
    flex: 1,
    marginRight: 10,
    color:'#fff'
  },
  score: {
    fontWeight: 'bold',
    color:'#fff'
  },
  playerId: {
    color: '#fff', 
  },
  currentUserId: {
    color: '#fff', // Color for current user's playerId
  },
});
