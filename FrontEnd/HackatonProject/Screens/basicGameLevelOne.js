import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, Alert } from 'react-native';


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


    /// read questions from .json file

    const readQuestions = () => {
        const jsonData = require("../Questions/basicGamequestions.json");
        // write out the json data

        /// save the json data

        for (const question of jsonData.questions) {
            console.log(question);

            prompt: question.prompt;
            code: question.code;
            options: question.options;
            correctAnswer: question.correctAnswer;
        }



        return jsonData.questions;
    }

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
            // go on the next question
            setDisabledOptions(prevDisabledOptions => [...prevDisabledOptions, currentQuestion.correctAnswer]);
        }
        
        if (currentQuestionIndex === questions.length - 1) {
            setGameCompleted(true);
        } else {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    }

    const currentQuestion = questions[currentQuestionIndex];

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
            <Button title="teszt jason" onPress={readQuestions}/>
            <View>
                <Text >{currentQuestion.code}</Text>
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
        </View>
    );
}

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
    },
    answbutton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        margin: 5,
    },
    answbuttonSec: {
        backgroundColor: "#2196F3",
        width: "45%", 
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
    }
});
