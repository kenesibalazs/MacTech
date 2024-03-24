import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Pressable, Modal, Alert, Image , ImageBackground} from 'react-native';
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
  const [hintVisable, setHintVisable] = useState(false);
  const [player1GoldScore, setPlayer1GoldPoints] = useState(0);
  const [player2GoldScore, setPlayer2GoldPoints] = useState(0);
  

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
        correctAnswer: "cout",
        hint: "dsmalkdsmalkds"
    },
    {
        prompt: "What is the correct syntax to read input in C++?",
        code: require("../assets/questionScreenShots/fel2.png"),
        options: ["cin >>", "scanf", "gets", "read"],
        correctAnswer: "cin >>",
        hint: "dsadasds"
    },
    {
        prompt: "How do you declare a variable in C++?",
        code: require("../assets/questionScreenShots/fel3.png"),
        options: ["int", "var", "variable", "init"],
        correctAnswer: "int",
        hint: "dsadasds"
    },

    {
      prompt: "4.What is the correct declaration in C++?",
      code: require("../assets/questionScreenShots/fel4.png"),
      options: ["int", "var", "double", "bool"],
      correctAnswer: "double",
      hint: "dsadasds"
    },

    {
      prompt: "5.Move the second sentence to a new line.",
      code: require("../assets/questionScreenShots/fel5.png"),
      options: ["cout", "new line", "endline", "endl"],
      correctAnswer: "endl",
      hint: "dsadasds"
    },

    // Add more questions here
    ];


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [disabledOptions, setDisabledOptions] = useState([]);

    const handleHintPress = async (playerId) => {
      const currentQuestion = questions[currentQuestionIndex];
  
      if (playerId === player1Id) {
          
          await handleIncrementGold(playerId, -5);
      } else if (playerId === player2Id) {
          
          await handleIncrementGold(playerId, -5);

          Alert.alert("Hint", currentQuestion.hint);
      }
  
      // Show hint in an alert
      Alert.alert("Hint", currentQuestion.hint);
  };

    const handleIncrementGold = async (playerId, increment) => {
      try {
          const userRef = doc(FIREBASE_DB, 'users', playerId);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();
  
          if (userData) {
              const updatedGoldScore = userData.goldScore + increment;
              await updateDoc(userRef, {
                  goldScore: updatedGoldScore
              });
              
              if (playerId === player1Id) {
                  setPlayer1GoldPoints(updatedGoldScore);
              } else if (playerId === player2Id) {
                  setPlayer2GoldPoints(updatedGoldScore);
              }
          }
      } catch (error) {
          console.error("Error updating gold score:", error);
      }
  };
    
    const handleAnswerPress = (answer, playerId) => {
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
            Alert.alert("Correct!", "Well done!");

            if (playerId === player1Id) {
                handleIncrementPoints(player1Id);
                handleIncrementGold(playerId, 1);
            } else {
                handleIncrementPoints(player2Id);
                handleIncrementGold(playerId, 1);
            }

        } else {
            Alert.alert("Wrong!");
            //setDisabledOptions(prevDisabledOptions => [...prevDisabledOptions, currentQuestion.correctAnswer]);
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

  useEffect(() => {
    const fetchUserGold = async () => {
        try {
            if (player1Id) {
                const user1Ref = doc(FIREBASE_DB, 'users', player1Id);
                const user1Snapshot = await getDoc(user1Ref);
                if (user1Snapshot.exists()) {
                    const user1Data = user1Snapshot.data();
                    setPlayer1GoldPoints(user1Data.goldScore || 0);
                }
            }

            if (player2Id) {
                const user2Ref = doc(FIREBASE_DB, 'users', player2Id);
                const user2Snapshot = await getDoc(user2Ref);
                if (user2Snapshot.exists()) {
                    const user2Data = user2Snapshot.data();
                    setPlayer2GoldPoints(user2Data.goldScore || 0);
                }
            }
        } catch (error) {
            console.error("Error fetching gold points:", error);
        }
    };

    fetchUserGold();
}, [player1Id, player2Id]);

useEffect(() => {
  const handleGameCompletion = async () => {
      try {
          if (gameCompleted) {
              const roomRef = doc(FIREBASE_DB, 'game_rooms', roomId);
              // Update game completion status for both players
              await updateDoc(roomRef, {
                  gameCompleted: true
              });
          }
      } catch (error) {
          console.error("Error handling game completion:", error);
      }
  };

  handleGameCompletion();

  const unsubscribe = onSnapshot(doc(FIREBASE_DB, 'game_rooms', roomId), (snapshot) => {
      const roomData = snapshot.data();
      if (roomData) {
          setGameCompleted(roomData.gameCompleted || false);
      }
  });

  return () => unsubscribe();
}, [gameCompleted, roomId]);


  if (gameCompleted) {


    return (
      <ImageBackground source={require('../assets/background.png')} style={{flex: 1,width: '100%', height: '100%'}}>
        <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center'}}>
           
          
            {playerId === player1Id && player1Points > player2Points && 
            <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <Text style={{color: 'white', fontSize: 40 , fontWeight: 'bold'}}> Congratulation! 🎉 </Text>
            <Text style={{color: 'white', fontSize: 32 , fontWeight: 'bold' ,padding: 10}}> You won!</Text>
            </View>
            }
            {playerId === player1Id && player1Points < player2Points &&
            <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 40 , fontWeight: 'bold'}}> Sorry! 🙁</Text>
             <Text style={{color: 'white', fontSize: 32 , fontWeight: 'bold' ,padding: 10}}> You lost</Text>
             </View>
             }
            {playerId === player2Id && player2Points > player1Points && 
            <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <Text style={{color: 'white', fontSize: 40 , fontWeight: 'bold'}}> Congratulation! 🎉 </Text>
            <Text style={{color: 'white', fontSize: 32 , fontWeight: 'bold' ,padding: 10}}> You won!</Text>
            </View>
            }
            {playerId === player2Id && player2Points < player1Points && 
            <View style={{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 40 , fontWeight: 'bold'}}> Sorry! 🙁</Text>
             <Text style={{color: 'white', fontSize: 32 , fontWeight: 'bold' ,padding: 10}}> You lost</Text>
             </View>
             }

            <Text style={{color: 'white', fontSize: 24 , fontWeight: 'bold' ,padding: 10}}>Final Score</Text>
            <Text style={{color: 'white', fontSize: 32 , fontWeight: 'bold' ,padding: 10}}>{player1Points} -  {player2Points}</Text>
          

            <TouchableOpacity style={styles.backtoMainBtn} onPress={() => navigation.navigate('MainScreen')}>
                <Text style={styles.backtoMaintext}>Back to Main</Text>
            </TouchableOpacity>

        </View>

        </ImageBackground>
    );
}


  return (
    <ImageBackground source={require('../assets/background.png')} style={{width: '100%', height: '100%'}}>
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
      {/* Player 1's buttons */}
      {playerId === player1Id && (
          <>
              <TouchableOpacity 
                  style={{
                      width: 75,
                      height: 75,
                      backgroundColor: player1GoldScore >= 5 ? '#4361ee' : 'gray',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopRightRadius: 45,
                      borderBottomRightRadius: 45,
                      marginLeft: 0,
                  }}
                  onPress={() => {
                      if (player1GoldScore >= 5) {
                          alert('CSINALD MEG HOGY ADHON EGY HINTET');
                      } else {
                          alert('Insufficient gold score!');
                      }
                  }}
                  disabled={player1GoldScore < 5}
              >
                  <MaterialIcons name="timer" size={40} color="white" />
              </TouchableOpacity>

              <Text style={{color: '#fff' , fontWeight: 'bold', fontSize: 20}}>{player1GoldScore}</Text>
              <TouchableOpacity 
                  style={{
                      width: 75,
                      height: 75,
                      backgroundColor: player1GoldScore >= 5 ? '#4361ee' : 'gray',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 45,
                      borderBottomLeftRadius: 45,
                      marginRight: 0,
                  }}
                  onPress={() => handleHintPress(player1Id)}
                disabled={player1GoldScore < 5}
              >
                  <Entypo name="magnifying-glass" size={40} color="white"/>
              </TouchableOpacity>

             
          </>
      )}

      {/* Player 2's buttons */}
      {playerId === player2Id && (
          <>
              <TouchableOpacity 
                  style={{
                      width: 75,
                      height: 75,
                      backgroundColor: player2GoldScore >= 5 ? '#4361ee' : 'gray',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 45,
                      borderBottomLeftRadius: 45,
                      marginRight: 0,
                  }}
                  onPress={() => {
                      if (player2GoldScore >= 5) {
                          alert('CSINALD MEG HOGY ADHON EGY HINTET');
                      } else {
                          alert('Insufficient gold score!');
                      }
                  }}
                  disabled={player2GoldScore < 5}
              >
                  <MaterialIcons name="timer" size={40} color="white" />
              </TouchableOpacity>
              <Text>{player2GoldScore}</Text>
              <TouchableOpacity 
                  style={{
                      width: 75,
                      height: 75,
                      backgroundColor: '#4361ee',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopRightRadius: 45,
                      borderBottomRightRadius: 45,
                      marginLeft: 0,
                  }}
                  onPress={() => handleHintPress(player2Id)}
                  disabled={player2GoldScore < 5}
              >
                  <Entypo name="magnifying-glass" size={40} color="white"/>
              </TouchableOpacity>

              
          </>
      )}
  </View>
                  

    </View>
    </ImageBackground>
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

  questionLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    width: '100%',
    textAlign: 'center',
    color: 'white',
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
    padding: 15,
    color: 'white',
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
    textAlign: "center",
    fontSize: 20
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

backtoMainBtn:{
  width: '80%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.43)',
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
    // Adjust margin if needed
    margin: 10,
},

backtoMaintext:{ 
  color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},

})
