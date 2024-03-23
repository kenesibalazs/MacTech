import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, Alert, Dimensions, Image } from 'react-native';

const happyAvatar = require('../assets/happy_avatar.png');
const sadAvatar = require('../assets/sad_avatar.png');

export default function BasicGameLevelOne({ navigation }) {

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
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState(null); // To track whether feedback is positive (true) or negative (false)

    const handleAnswerPress = (answer) => {
        let isCorrect = answer === questions[currentQuestionIndex].correctAnswer;

        if (isCorrect) {
            setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
            setShowFeedback(true);
            setFeedbackType(true); // Set feedback type to positive
            setTimeout(() => {
                setShowFeedback(false);
                if (currentQuestionIndex === questions.length - 1) {
                    setGameCompleted(true);
                } else {
                    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                }
            }, 2000); // Show feedback for 2 seconds
           // Alert.alert("Correct!", "Well done!");
        } else {
            setShowFeedback(true);
            setFeedbackType(false); // Set feedback type to negative
            setTimeout(() => {
                setShowFeedback(false);
               // Alert.alert("Wrong!");
                setDisabledOptions(prevDisabledOptions => [...prevDisabledOptions, currentQuestion.correctAnswer]);
                if (currentQuestionIndex === questions.length - 1) {
                    setGameCompleted(true);
                } else {
                    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                }
            }, 2000); // Show feedback for 2 seconds
        }
    };

    const currentQuestion = questions[currentQuestionIndex];


    const saveScoretofirebaseCollection = () => {

        
    }
    if (gameCompleted) {
        return (
            <View style={styles.container}>
                <Text>Game Over!</Text>
                <Text>Number of Correct Answers: {correctAnswers}</Text>
                <Button title="Return to Main Screen" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.questionLabel}>{currentQuestion.prompt}</Text>
            <View>
                <Text>{currentQuestion.code}</Text>
            </View>
            <View style={styles.answcontainer}>
                {currentQuestion.options.map((answer, index) => (
                    <Pressable
                        key={index}
                        style={[
                            styles.answbutton,
                            styles.answbuttonSec,
                            disabledOptions.includes(answer) && { backgroundColor: "gray" }
                        ]}
                        onPress={() => handleAnswerPress(answer)}
                        disabled={disabledOptions.includes(answer)}
                    >
                        <Text style={styles.answtextstyle}>{answer}</Text>
                    </Pressable>
                ))}
            </View>
            {showFeedback && <FeedbackIndicator isCorrect={feedbackType} />}
        </View>
    );
}

const FeedbackIndicator = ({ isCorrect }) => {
    return (
        <View style={styles.feedbackContainer}>
            <Image source={isCorrect ? happyAvatar : sadAvatar} style={styles.avatar} />
            <Text style={styles.feedbackText}>{isCorrect ? "Correct!" : "Incorrect!"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00b4d8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 50,
        padding: 10,
        color: 'white',
        textAlign: 'center',
        
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
        width: Dimensions.get('window').width / 2 - 20,
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
    feedbackContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    avatar: {
        height: '75%', 
        aspectRatio: 1, 
    },
    feedbackText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white',
        textAlign: 'center',
    }
});
