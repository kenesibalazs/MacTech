import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, addDoc, serverTimestamp, query, where, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig'; // Importing from the uppercase names

export default function MainScreen({ route }) {
  const navigation = useNavigation();
  const [gameRooms, setGameRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  const createGameRoom = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid; // Accessing currentUser from uppercase name
      const newRoomRef = await addDoc(collection(FIREBASE_DB, 'game_rooms'), {
        player1Id: userId,
        player2Id: null,
        gameStatus: "pending"
      });
      navigation.navigate('PlayScreen', { roomId: newRoomRef.id });
    } catch (error) {
      console.error("Error creating game room:", error);
    }
  };

  const joinGameRoom = async (roomId) => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const roomRef = doc(FIREBASE_DB, 'game_rooms', roomId);
      const roomSnapshot = await getDoc(roomRef);
      const roomData = roomSnapshot.data();
  
      if (!roomData) {
        throw new Error("Room not found");
      }
  
      if (roomData.player1Id === userId || roomData.player2Id === userId) {
        throw new Error("Player already in the room");
      }
  
      if (roomData.player2Id) {
        throw new Error("Room is already full");
      }
  
      await updateDoc(roomRef, {
        player2Id: userId,
        gameStatus: "in_progress"
      });

      setModalVisible(false);
  
      // Ensure that the navigation to PlayScreen occurs after the document update
      navigation.navigate('PlayScreen', { roomId });
    } catch (error) {
      console.error("Error joining game room:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Screen</Text>
      <Button title="Create Game Room" onPress={() => createGameRoom()} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Available Game Rooms</Text>
            <FlatList
              data={gameRooms}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.roomItem} onPress={() => joinGameRoom(item.id)}>
                  <Text>Room ID: {item.id}</Text>
                  <Text>Player 1: {item.player1Id}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Button title="Join Game Room" onPress={() => setModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  roomItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
