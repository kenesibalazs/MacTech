import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Pressable, Modal, Alert } from 'react-native';
import { doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';
import { DeviceMotion } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import MainScreen from './MainScreen';
import CountDown from 'react-native-countdown-component';


export default function PlayScreen({ route }) {
  const { roomId, playerId } = route.params;
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);

  const navigation = useNavigation();

  const [motionData, setMotionData] = useState({
    x: 0,
    y: 0,
  });

  const questions = [
    {
        prompt: "Jhon wants to display hello world to terminal in C++. Help him.",
        code: "int main(){\n    ______<<\"Hello World\" << endl;\n}",
        options: ["cout", "cin", "printf", "scanf"],
        correctAnswer: "cout"
    },
    {
        prompt: "What is the correct syntax to read input in C++?",
        code: "int x;\n______(x);",
        options: ["cin >>", "scanf", "gets", "read"],
        correctAnswer: "cin >>"
    },
    {
        prompt: "How do you declare a variable in C++?",
        code: "______ int x;",
        options: ["int", "var", "variable", "init"],
        correctAnswer: "int"
    },
    // Add more questions here
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [disabledOptions, setDisabledOptions] = useState([]);


    const handleAnswerPress = (answer, playerId) => {
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
            Alert.alert("Correct!", "Well done!");

            if (playerId === player1Id) {
                handleIncrementPoints(player1Id);
            } else {
                handleIncrementPoints(player2Id);
            }

        } else {
            Alert.alert("Wrong!");
            setDisabledOptions(prevDisabledOptions => [...prevDisabledOptions, currentQuestion.correctAnswer]);
        }
        
        if (currentQuestionIndex === questions.length - 1) {
            setGameCompleted(true);
        } else {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    

    useEffect(() => {
        const subscription = DeviceMotion.addListener((motion) => {
        if (motion.acceleration.x > 0.99 || motion.acceleration.x < -0.99 || motion.acceleration.y > 0.99 || motion.acceleration.y < -0.99) {
            // console.log("User ID:", playerId);
            // console.log("X:", motion.acceleration.x);
            // console.log("Y:", motion.acceleration.y);
        }
        setMotionData({
            x: motion.acceleration.x,
            y: motion.acceleration.y,
        });
        });

        return () => {
        subscription.remove();
        };
    }, []);

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
          await updateDoc(roomRef, {
            player1Points: updatedPoints
          });
          setPlayer1Points(updatedPoints);
        } else if (playerId === player2Id) {
          updatedPoints = player2Points + 5;
          await updateDoc(roomRef, {
            player2Points: updatedPoints
          });
          setPlayer2Points(updatedPoints);
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
 

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const savePoints = async () => {
    try {
        // Check if player IDs are valid
        if (player1Id && player2Id) {
            const userDoc1 = doc(collection(FIREBASE_DB, 'userdata'), player1Id); // Reference to player 1's document
            const userDoc2 = doc(collection(FIREBASE_DB, 'userdata'), player2Id); // Reference to player 2's document

            await updateDoc(userDoc1, {
                userscore: increment(player1Points), // Increment player 1's score
                userGoldPoints: increment(player1Points / 5) // Calculate and store gold points for player 1
            });

            await updateDoc(userDoc2, {
                userscore: increment(player2Points), // Increment player 2's score
                userGoldPoints: increment(player2Points / 5) // Calculate and store gold points for player 2
            });

            console.log("Scores updated successfully!");
        } else {
            console.error("Invalid player IDs.");
        }
    } catch (error) {
        console.error("Error updating scores: ", error);
    }
};


  if (gameCompleted) {
    // save points to firestore userdata collection
    
    // Call savePoints() only if player1Id and player2Id are valid
    if (player1Id && player2Id) {
      savePoints();
    } else {
      console.error("Invalid player IDs.");
    }



    

    return (
        <View style={styles.container}>
            <Text>Game Over!</Text>
            <Text>{player1Id} - {player1Points} -  {player2Points} - {player2Id}</Text>
            {player1Points > player2Points ? <Text>Winner: {player1Id}</Text> : <Text>Winner: {player2Id}</Text>}
           
            <Button title="Return to Main Screen" onPress={() => navigation.navigate('MainScreen')} />
        </View>
    );
}

  return (
    <View style={styles.container}>
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
     

      </View>
      <View style={styles.middelcontainer}>
        {/* <Text>My ID is: {playerId}</Text> */}
        {/* <Text>Player 1: {player1Id} - Points: {player1Points}</Text>
        {playerId === player1Id && (
          <Button title="Gain 5 points" onPress={() => handleIncrementPoints(player1Id)} />
        )}
        <Text>Player 2: {player2Id} - Points: {player2Points}</Text>
        {playerId === player2Id && (
          <Button title="Gain 5 points" onPress={() => handleIncrementPoints(player2Id)} />
        )} */}


            <View style={styles.answcontainer}>
            <Text style={styles.questionLabel}>{currentQuestion.prompt}</Text>
           
                {playerId === player1Id && (
                    currentQuestion.options.map((answer, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.answbutton,
                                styles.answbuttonSec,
                                disabledOptions.includes(answer) && { backgroundColor: "gray" }
                            ]}
                            onPress={() => handleAnswerPress(answer, player1Id)}
                            disabled={disabledOptions.includes(answer)}
                        >
                            <Text style={styles.answtextstyle}>{answer}</Text>
                        </Pressable>
                    ))
                )}

                {playerId === player2Id && (
                    currentQuestion.options.map((answer, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.answbutton,
                                styles.answbuttonSec,
                                disabledOptions.includes(answer) && { backgroundColor: "gray" }
                            ]}
                            onPress={() => handleAnswerPress(answer, player2Id)}
                            disabled={disabledOptions.includes(answer)}
                        >
                            <Text style={styles.answtextstyle}>{answer}</Text>
                        </Pressable>
                    ))
                )}
            </View>

      </View>


      <View style={styles.bottomcontainer}>
      <TouchableOpacity style={{width: 75,
                                height: 75,
                                backgroundColor: '#4361ee',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderTopRightRadius: 45,
                                borderBottomRightRadius: 45,
                                marginLeft:0 }}>
        <MaterialIcons name="timer" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={{width: 75,
                                height: 75,
                                backgroundColor: '#4361ee',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderTopLeftRadius: 45,
                                borderBottomLeftRadius: 45,
                                marginRight:0 }}>
      <Entypo name="magnifying-glass" size={40} color="white" />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topScoreboard: {
    marginStart: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  playerProfileContainer: {
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
  timercontainer: {
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
    alignContent: 'center'
  },
  middelcontainer: {
    marginTop: 0,
    width: '100%',
    height: '75%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  answcontainer: {
    marginTop: 10,
    width: "90%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
},
answbutton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 5,
   
},
answbuttonSec: {
    backgroundColor: "#2196F3",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
},
answtextstyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
},

bottomcontainer:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  
  width: '100%',
 
},

helpButtonContainer: {
  
  width: 75,
  height: 75,
  backgroundColor: '#e5383b',
  alignItems: 'center',
  justifyContent: 'center',


},

helpButton: {
  fontSize: 50,
  color: 'white',
  padding: 10,
  fontWeight: 'bold',
  textAlign: 'center',
}

})
