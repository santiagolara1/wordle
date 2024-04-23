import { StatusBar } from "expo-status-bar";

import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const targetWord = "REACT";
const maxTries = 6;

export default function App() {
  const [guesses, setGuesses] = useState(Array(maxTries).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempt, setAttempt] = useState(0);

  const handleKeyPress = (key) => {
    if (currentGuess.length < 5 && attempt < maxTries) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length === 5 && attempt < maxTries) {
      const newGuesses = [...guesses];
      newGuesses[attempt] = currentGuess;
      setGuesses(newGuesses);
      setCurrentGuess("");
      setAttempt(attempt + 1);
    }
  };

  const renderGuesses = () => {
    return guesses.map((guess, index) => (
      <Text key={index} style={styles.guess}>
        {guess.padEnd(5, " ")}
      </Text>
    ));
  };

  const renderKeyboard = () => {
    const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return keys.map((key) => (
      <TouchableOpacity
        key={key}
        style={styles.key}
        onPress={() => handleKeyPress(key)}
      >
        <Text>{key}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wordle Game</Text>
      <View style={styles.guessContainer}>{renderGuesses()}</View>
      <View style={styles.keyboard}>{renderKeyboard()}</View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  guessContainer: {
    marginBottom: 20,
  },
  guess: {
    fontSize: 20,
    letterSpacing: 10,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: 300,
  },
  key: {
    width: 30,
    height: 30,
    margin: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#00f",
    padding: 10,
  },
});
