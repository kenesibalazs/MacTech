import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function GameScreen({ route }) {
    const { player1, player2 } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.titleLabel}>Game Screen</Text>
            <Text>{player1} vs {player2}</Text>
            {/* Game UI and logic here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#38a3a5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleLabel: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#caf0f8'
    },
});
