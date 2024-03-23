import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import LeaderboardScreen from './LeaderBoardScreen';
export default function MainScreen({ route }) {
  const navigation = useNavigation();
  const [gameRooms, setGameRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, 'game_rooms'), snapshot => {
      const rooms = [];
      snapshot.forEach(doc => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      setGameRooms(rooms);
    });
    
    const authUser = FIREBASE_AUTH.currentUser;
    if (authUser) {
      setPlayerId(authUser.uid);
    }

    return () => unsubscribe();
  }, []);

  const createGameRoom = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const newRoomRef = await addDoc(collection(FIREBASE_DB, 'game_rooms'), {
        player1Id: userId,
        player2Id: null,
        gameStatus: "pending"
      });
      navigation.navigate('PlayScreen', { roomId: newRoomRef.id, playerId: userId });
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
  
      navigation.navigate('PlayScreen', { roomId, playerId: userId });
    } catch (error) {
      console.error("Error joining game room:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Screen</Text>
      <Text>Your Player ID: {playerId}</Text>
      <TouchableOpacity style={styles.gameButtonContainer}>
        <Text style={styles.gameButtonsText}>Solo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gameButtonContainer} onPress={() => createGameRoom()}>
        <Text style={styles.gameButtonsText}>Create Game</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gameButtonContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.gameButtonsText}>Join Game</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        {/* Modal content */}
      </Modal>

      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navBarButton}>
          <AntDesign name="user" size={32} color="black" />
          <Text style={styles.navBarButtonText}>Avatar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('LeaderboardScreen')}>
        <MaterialCommunityIcons name="podium-gold" size={32} color="black" />
        <Text style={styles.navBarButtonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBarButton}>
          <FontAwesome5 name="cogs" size={32} color="black" />
          <Text style={styles.navBarButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38a3a5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameButtonContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#FCFCFD',
    borderRadius: 4,
    borderWidth: 0,
    shadowColor: 'rgba(45, 35, 66, 0.4)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#D6D6E7',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  gameButtonsText: {
    color: '#36395A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNavBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1
  },
  navBarButton: {
    alignItems: 'center',
  },
  navBarButtonText: {
    fontSize: 12,
  },
});

