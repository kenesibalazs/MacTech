import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB , FIREBASE_AUTH} from '../FirebaseConfig';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Game Rooms</Text>
      </View>
      <FlatList
        data={userGameRooms}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.historyItem} onPress={() => navigation.navigate('PlayScreen', { roomId: item.id, playerId: userId })}>
            <Text>Room ID: {item.id}</Text>
            <Text>Player 1: {item.player1Id}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
