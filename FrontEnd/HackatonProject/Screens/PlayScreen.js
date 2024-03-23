import React, { useState, useEffect } from 'react';
import { StyleSheet ,View, Text, Button ,TouchableOpacity} from 'react-native';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';

export default function PlayScreen  ({ route }){
  const { roomId, playerId } = route.params;
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);

  useEffect(() => {
    const fetchPlayerIds = async () => {
      try {
        const roomRef = doc(FIREBASE_DB, 'game_rooms', roomId);
        const roomSnapshot = await getDoc(roomRef);
        const roomData = roomSnapshot.data();

        if (roomData) {
          setPlayer1Id(roomData.player1Id || '');
          setPlayer2Id(roomData.player2Id || '');
          setPlayer1Points(roomData.player1Points || 0);
          setPlayer2Points(roomData.player2Points || 0);
        }
      } catch (error) {
        console.error("Error fetching player IDs:", error);
      }
    };

    fetchPlayerIds();

    const unsubscribe = onSnapshot(doc(FIREBASE_DB, 'game_rooms', roomId), (snapshot) => {
      const roomData = snapshot.data();
      if (roomData) {
        setPlayer1Id(roomData.player1Id || '');
        setPlayer2Id(roomData.player2Id || '');
        setPlayer2Points(roomData.player2Points || 0);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleIncrementPoints = async (playerId) => {
    try {
      const roomRef = doc(FIREBASE_DB, 'game_rooms', roomId);
      const roomSnapshot = await getDoc(roomRef);
      const roomData = roomSnapshot.data();
  
      if (roomData) {
        let updatedPoints;
        if (playerId === player1Id) {
          updatedPoints = player1Points + 5;
          console.log("Updating player 1 points:", updatedPoints); // Added logging
          await updateDoc(roomRef, {
            player1Points: updatedPoints
          });
          console.log("Player 1 points updated successfully"); // Added logging
          setPlayer1Points(updatedPoints); // Update the state
        } else if (playerId === player2Id) {
          updatedPoints = player2Points + 5;
          console.log("Updating player 2 points:", updatedPoints); // Added logging
          await updateDoc(roomRef, {
            player2Points: updatedPoints
          });
          console.log("Player 2 points updated successfully"); // Added logging
          setPlayer2Points(updatedPoints); // Update the state
        } else {
          console.log("Cannot add points for this player.");
          return;
        }
  
        console.log(`${playerId} added 5 points. Total points: ${updatedPoints}`);
      }
    } catch (error) {
      console.error("Error incrementing points:", error);
    }
  };
  
  
  

  return (
    <View style={{ flex: 1 , alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.topScoreboard}>
        <TouchableOpacity style={styles.playerProfileContainer}>
            <Text style={styles.palyerProfiele}>B</Text>
        </TouchableOpacity>

        <Text style={styles.liveScore}>{player1Points} - {player2Points}</Text>

        <TouchableOpacity style={styles.playerProfileContainer}>
            <Text style={styles.palyerProfiele}>J</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.timercontainer}>
        <Text style={styles.timer}>3:00</Text>
        </View>

        <View style={styles.middelcontainer}>
            <Text>My ID is: {playerId}</Text>
            <Text>Player 1: {player1Id} - Points: {player1Points}</Text>
            
            {playerId === player1Id && (
                <Button title="Gain 5 points" onPress={() => handleIncrementPoints(player1Id)} />
            )}
            <Text>Player 2: {player2Id} - Points: {player2Points}</Text>
            {playerId === player2Id && (
                <Button title="Gain 5 points" onPress={() => handleIncrementPoints(player2Id)} />
            )}
      </View>
    </View>
  );
};

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

  topScoreboard:{
    marginStart:0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    
  },
  playerProfileContainer:{
    borderRadius: 50,
    width: 50,
    height: 50,

    backgroundColor: '#e5383b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  palyerProfiele: {
    fontSize: 20,
    color: 'white',
    padding: 10,
    borderRadius: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },


  liveScore: {
    fontSize: 24,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },

  timercontainer:{
    marginTop: -20,
    width: '25%',
 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
   
    
  },
  timer: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10 
  },

  middelcontainer: { 
    marginTop: 0,
    width: '100%',
    height: '75%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }

})