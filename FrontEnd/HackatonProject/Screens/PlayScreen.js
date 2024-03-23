import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Pressable, Modal, Alert, Image } from 'react-native';
import { doc, getDoc, updateDoc, onSnapshot, collection, increment , setDoc} from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';
import { DeviceMotion } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import MainScreen from './MainScreen';
import CountDown from 'react-native-countdown-component';
import { async } from '@firebase/util';


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
        code: require("../assets/questionScreenShots/fel1.png"),
        options: ["cout", "cin", "printf", "scanf"],
        correctAnswer: "cout"
    },
    {
        prompt: "What is the correct syntax to read input in C++?",
        code: require("../assets/questionScreenShots/fel2.png"),
        options: ["cin >>", "scanf", "gets", "read"],
        correctAnswer: "cin >>"
    },
    {
        prompt: "How do you declare a variable in C++?",
        code: require("../assets/questionScreenShots/fel3.png"),
        options: ["int", "var", "variable", "init"],
        correctAnswer: "int"
    },

    {
      prompt: "4.What is the correct declaration in C++?",
      code: require("../assets/questionScreenShots/fel4.png"),
      options: ["int", "var", "double", "bool"],
      correctAnswer: "double"
    },

    {
      prompt: "5.Move the second sentence to a new line.",
      code: require("../assets/questionScreenShots/fel5.png"),
      options: ["cout", "new line", "endline", "endl"],
      correctAnswer: "endl"
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

        // Check if the user exists in the collection
        const userRef = doc(FIREBASE_DB, 'users', playerId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();

        if (userData) {
            // Update user's score
            await updateDoc(userRef, {
                score: userData.score + 5 ,// Increment the score by 5
                goldScore: userData.goldScore + 1 
            });
        } else {
            // Create a new document for the user
            await setDoc(userRef, {
                playerId: playerId,
                score: 5 ,// Initialize score to 5
                goldScore:1
            });
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

 

  if (gameCompleted) {


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
      
      
      <View style={styles.middelcontainer}>
       

            <View style ={{ height:'50%', width:'100%', alignItems:'center', justifyContent:'center', marginTop:'5%'}}> 
            <Text style={styles.questionLabel}>{currentQuestion.prompt}</Text>
            <Image source={currentQuestion.code} style={{height: '80%', resizeMode: 'contain'} } />

            </View>
            <View style={styles.answcontainer}>
              
                
              
           
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
                                  marginLeft:0 }} >
          <MaterialIcons name="timer" size={40} color="white" onPress={() => alert('CSINALD MEG HOGY ADHON EGY HINTET ')  } />
        </TouchableOpacity>

        <TouchableOpacity style={{width: 75,
                                  height: 75,
                                  backgroundColor: '#4361ee',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderTopLeftRadius: 45,
                                  borderBottomLeftRadius: 45,
                                  marginRight:0 }} onPress={() => alert('CSINALD MEG HOGY ADHON EGY HINTET ')}>
        <Entypo name="magnifying-glass" size={40} color="white"/>
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
    backgroundColor: '#56C5DB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  questionLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    width: '100%',
    textAlign: 'center',
  },
  topScoreboard: {
    marginTop: 25,
    marginStart: 0,
    width: '100%',
    height: '15%',
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
    backgroundColor: 'blue',
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
  
  timer: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'center'
  },
  middelcontainer: {
    marginTop: 0,
    width: '100%',
    height: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  answcontainer: {
    marginTop: 10,
    width: "90%",
    height: "50%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
},
answbutton: {
    width: "45%",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 5,
    marginTop: 15,

   
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
  height: '15%',
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


},

})
