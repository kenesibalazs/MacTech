import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity , ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB , FIREBASE_AUTH} from '../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [gameRooms, setGameRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, 'game_rooms'), snapshot => {
      const rooms = [];
      snapshot.forEach(doc => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      setGameRooms(rooms);
    });

    return () => unsubscribe();
  }, []);

  // Get current user ID
  const userId = FIREBASE_AUTH.currentUser.uid;

  // Filter game rooms where current user is involved
  const userGameRooms = gameRooms.filter(room => room.player1Id === userId || room.player2Id === userId);

  return (
    <ImageBackground source={require('../assets/background.png')} style={{width: '100%', height: '100%'}}>
    <View style={styles.container}>
      <View style={styles.header}>
   
        <Text style={styles.title}>Game History</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={30} color="white" style={{ marginTop: 20 }} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={userGameRooms}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.historyItem}>
            <Text style={{color:'#fff', fontWeight: 'bold'}}>Room ID: {item.id}</Text>
            <Text style={{color:'#fff'}}>{item.player1Id}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'#fff',
    marginTop: 20,
  },
  historyItem: {
    marginBottom: 10,

    padding: 10,
    backgroundColor: 'rgba(0, 255, 136, 0.25)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: 'rgba(31, 38, 135, 0.37)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },
});
