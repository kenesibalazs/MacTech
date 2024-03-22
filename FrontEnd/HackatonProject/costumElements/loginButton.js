import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const constumButton = ({ onPress, title, backgroundColor }) => {
  const [opacity, setOpacity] = useState(1);

  const handlePressIn = () => {
    setOpacity(0.5); // Set opacity to 0.7 when pressed
  };

  const handlePressOut = () => {
    setOpacity(1); // Set opacity back to 1 when released
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1} // Prevent default opacity change
      style={[styles.button, { opacity, backgroundColor }]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 55,
    width: '85%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default constumButton;
