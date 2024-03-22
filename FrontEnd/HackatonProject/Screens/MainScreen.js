import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BasicGameLevelOne from './basicGameLevelOne'; 

export default function MainScreen({ route }) {
    const { username } = route.params;
    const firstLetter = username.charAt(0).toUpperCase();
    const navigation = useNavigation();
    const [showGames, setShowGames] = useState(false); 

    const gamesList = ["Basics", "Sorting Game", "Objects"]; 

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileContainer} onPress={() => alert('Profile button pressed')}>
                <Text style={styles.profile}>{firstLetter}</Text>
            </TouchableOpacity>

            <Text>Welcome {username}</Text> 

            <Button title="Play" onPress={() => setShowGames(true)} />            

            <Modal
                animationType="slide"
                transparent={true}
                visible={showGames}
                onRequestClose={() => setShowGames(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>C++ Games</Text>
                        {gamesList.map((game, index) => (
                            <Pressable key={index} style={styles.gameButton} onPress={() =>{
                                if (game === "Basics") {
                                    navigation.navigate('BasicGameLevelOne');
                                }
                                else if (game === "Sorting Game") {
                                    alert("Sorry, this game is not available yet");
                                }
                                else if (game === "Objects") {
                                    alert("Sorry, this game is not available yet");
                                }
                                setShowGames(false);
                            }}>
                                <Text>{game}</Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setShowGames(false)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        marginBottom: 20,
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: '#48cae4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profile: {
        fontSize: 20,
        color: 'white',
        padding: 10,
        borderRadius: 50,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: "80%",
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
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2

    },
    buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 10,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        fontWeight: "bold",
        fontSize: 20,
        color: "#023e8a",
        textAlign: "center",
  
    },
    gameButton: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
        width: "100%"
    }
});
