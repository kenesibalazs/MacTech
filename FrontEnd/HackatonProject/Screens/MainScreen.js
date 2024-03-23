import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import LeaderboardScreen from './LeaderBoardScreen';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function MainScreen({ route }) {
  const navigation = useNavigation();
  const [gameRooms, setGameRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [username, setUsername] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [userGoldScore, setUserGoldScore] = useState(0);



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
      
      const fetchUserData = async () => {
        try {
          const userDoc = doc(FIREBASE_DB, 'users', authUser.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUsername(userData.username);
            setUserScore(userData.score);
            setUserGoldScore(userData.goldScore);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserData();
    }

    return () => unsubscribe();
  }, [userScore, userGoldScore]); // Dependency array added here

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

      <View style={styles.userContainer}>
        <View style={styles.userDetails}>
          <Text style={{fontSize: 20}}>🌟 {userGoldScore}</Text>
          <Text>Score: {userScore}</Text>
        </View>
        <View style={styles.userAvatar}>
          <Text>{username}</Text>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{username.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
      </View>
  
      <View style={styles.gameButtonsContainer}>
      <TouchableOpacity style={styles.gameButtonContainer}>
        <Text style={styles.gameButtonsText}>Solo</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.gameButtonContainer} onPress={() => createGameRoom()}>
        <Text style={styles.gameButtonsText}>Create Game</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.gameButtonContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.gameButtonsText}>Join Game</Text>
      </TouchableOpacity>
      </View>
  
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
      
      
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('HistoryScreen')}>
          <AntDesign name="barschart" size={32} color="white" />
          <Text style={styles.navBarButtonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('LeaderboardScreen')}>
        <MaterialIcons name="leaderboard" size={32} color="white" />
          <Text style={styles.navBarButtonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('SettingsScreen')}>
        <Feather name="settings" size={32} color="white" />
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
    backgroundColor: '#06BEE1',
    width: '100%',
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
  gameButtonsText:{
    color: '#36395A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNavBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 20,
    width: '100%',
    backgroundColor: '#1768AC',
    justifyContent: 'space-around',
    paddingVertical: 10,
    
  },
  navBarButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  navBarButtonText: {
    paddingTop: 5,
    color:'#fff',
    fontSize: 12,
  },


  userContainer: {
  
    height: '10%',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#1768AC',

  },

  userDetails : {
    flexDirection: 'column',
  },

  userAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  gameButtonsContainer:{
    width: '100%',
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }



});
