import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';

const PlayScreen = ({ route }) => {
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
          const fetchedPlayer1Id = roomData.player1Id;
          const fetchedPlayer2Id = roomData.player2Id;

          setPlayer1Id(fetchedPlayer1Id);
          setPlayer2Id(fetchedPlayer2Id);
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
        setPlayer2Id(roomData.player2Id);
        setPlayer2Points(roomData.player2Points || 0);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  

  return (
    <View styles={{flex: 1}}>
      <Text>Player 1: {player1Id} - Points: {player1Points}</Text>
      <Text>Player 2: {player2Id} - Points: {player2Points}</Text>
     
    </View>
  );
};

export default PlayScreen;
