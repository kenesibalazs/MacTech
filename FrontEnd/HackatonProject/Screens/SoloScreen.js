import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 


export default function SoloScreen() {

    const navigation = useNavigation(); 
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
        // Add more questions here
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [disabledOptions, setDisabledOptions] = useState([]);

    const handleAnswerPress = (answer) => {
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
            Alert.alert("Correct!", "Well done!");
        } else {
            Alert.alert("Wrong!");
            setDisabledOptions(prevDisabledOptions => [...prevDisabledOptions, questions[currentQuestionIndex].correctAnswer]);
        }
        if (currentQuestionIndex === questions.length - 1) {
            setGameCompleted(true);
        } else {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    }
    const handleNextLevelPress = () => {
        // Navigate to the next level screen here
        navigation.navigate('NextLevelScreen');
    }
    const handleSoloPress = () => {
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
        setGameCompleted(false);
        setDisabledOptions([]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleLabel}>Solo Game</Text>
            {!gameCompleted ? (
                <View>
                    <Text>{questions[currentQuestionIndex].prompt}</Text>
                    <Image source={questions[currentQuestionIndex].code} style={styles.image} />
                    {questions[currentQuestionIndex].options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.optionButton, disabledOptions.includes(option) && styles.disabledOptionButton]}
                            onPress={() => handleAnswerPress(option)}
                            disabled={disabledOptions.includes(option)}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                   
                    <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate('MainScreen')}>
                        <Text style={styles.returnButtonText}>Return to Main Screen</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    {correctAnswers < questions.length / 2 ? (
                        <View>
                            <Image source={require('../assets/sad_avatar.png')} style={styles.avatarImage} />
                            <Text style={styles.congratsText}>It's not good, sorry.</Text>
                            <TouchableOpacity style={styles.resetLevelButton} onPress={handleSoloPress}>
                                <Text style={styles.resetLevelButtonText}>Reset level</Text>
                            </TouchableOpacity>

                        </View>
                    ) : (
                        <View>
                            <Image source={require('../assets/happy_avatar.png')} style={styles.avatarImage} />
                            <Text style={styles.congratsText}>Congratulations! You completed this level.</Text>
                            <TouchableOpacity style={styles.nextLevelButton} onPress={handleNextLevelPress}>
                                <Text style={styles.nextLevelButtonText}>Next level</Text>
                            </TouchableOpacity>
                        </View>
                        
                    )}
                    <Text>Total correct answers: {correctAnswers}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainScreen')}>
                        <Text style={styles.buttonText}>Return to Main Screen</Text>
                    </TouchableOpacity>
                   
                </View>
            )}   
        </View>
    );
}

const handleSoloPress =  () => {
    navigation.navigate('SoloScreen');
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#99ffcc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleLabel: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#086e0a'
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    optionButton: {
        backgroundColor: '#ddd',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    disabledOptionButton: {
        backgroundColor: '#aaa',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      returnButton: {
        backgroundColor: '#0047ff', 
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 20,
    },
    returnButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    congratsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853', // Zöld szín példaként
        marginBottom: 10,
    },
    nextLevelButton: {
        backgroundColor: '#369c47', 
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginLeft: 20,
        marginTop:20,
        marginBottom: 20,
    },
    nextLevelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetLevelButton: {
        backgroundColor: '#369c47', 
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginLeft: 20,
        marginTop:20,
        marginBottom: 20,
    },
    resetLevelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    avatarImage: {
        width:100,
        height: 150,
    }

});