import React from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';

export default function BasicGameLevelOne() {

    const answerList = ["cout", "cin", "printf", "scanf"];
    return (
        <View style={styles.container}>
            <Text>Jhon wants to display hello world to terminal in C++. Help him.</Text>
            <View>
                <Text>int main(){'{'}</Text>
                <Text> {' ______<<"Hello World" << endl' }</Text>
                <Text>{'}'}</Text>
            </View>
            <View style= {styles.answcontainer}>
                {answerList.map((answer, index) => (
                    <Pressable
                        style={[styles.answbutton, styles.answbuttonSec]}
                        onPress={() => alert(answer)}
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },


    answcontainer:{
        marginTop: 10,
        width: "90%",
        
    },

    answbutton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
       
        
    },
    answbuttonSec: {
        backgroundColor: "#2196F3",
        marginTop: 10,
        width: "50%",
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
