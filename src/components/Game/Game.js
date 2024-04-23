import { Text, View, ScrollView, Alert, ActivityIndicator } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../utils/constants";
import Keyboard from "../UIcompont/Keyboard";
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import words from "../../utils/words";
import styles from "./game-styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  SlideInLeft,
  ZoomIn,
  FlipInEasyY,
} from "react-native-reanimated";
import End from "../End/End";

const maxTries = 6;

export const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export const dayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

export default function Game() {
  const word = words[dayOfTheYear()];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(maxTries).fill(new Array(letters.length).fill(""))
  );

  const [curRow, setCurRow] = useState(0);
  const [curlCol, setCurlCol] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  useEffect(() => {
    readState();
  }, []);

  useEffect(() => {
    if (loaded) {
      saveState();
    }
  }, [rows, curRow, curlCol, gameState]);

  const saveState = async () => {
    const dataOftheDay = { rows, curRow, curCol, gameState };
    try {
      const existingDataString = await AsyncStorage.getItem("@game");
      const existingData = existingDataString
        ? JSON.parse(existingDataString)
        : {};

      existingData[dayKey] = dataOftheDay;
      const dataString = JSON.stringify(existingData);

      await AsyncStorage.setItem("@game", dataString);
    } catch (e) {
      console.log("An error ocurred during persisting of data ", e);
    }
  };

  const readState = async () => {
    try {
      const dataString = await AsyncStorage.getItem("@game");

      const data = JSON.parse(dataString);
      const day = data[dayKey];

      setRow(day.rows);
      setCurrRow(day.curRow);
      setCurrCol(day.curCol);
      setGameState(day.gameState);
    } catch (e) {
      console.log("An error ocurred during reading of state", e);
    }
    setIsLoaded(true);
  };

  const checkGameState = () => {
    if (checkWon() && gameState !== "won") {
      Alert.alert("You Win!", "Great Job!", [
        { text: "Share", onPress: shareScore },
      ]);
      setGameState("won");
    } else if (checkLost() && gameState !== "lost") {
      Alert.alert("You Lost!", "Sorry Try Again Next Time");
      setGameState("lost");
    }
  };

  const shareScore = () => {
    const textmap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellRGBColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = " Wordle \n ${textmap}";
    Clipboard.setString(textToShare);
    Alert.alert("copied successfully", "Share your score on you social media");
  };

  const checkWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const checkLost = () => {
    return !checkWon() && curRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curlCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][curlCol] = "";
        setRows(updatedRows);
        setCurlCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curlCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurlCol(0);
      }

      return;
    }

    if (curlCol < rows[0].length) {
      updatedRows[curRow][curlCol] = key;
      setRows(updatedRows);
      setCurlCol(curlCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curlCol;
  };

  const getCellStyle = (indexRow, indexCol) => [
    styles.cell,
    {
      borderColor: isCellActive(indexRow, indexCol)
        ? colors.grey
        : colors.darkgrey,
      backgroundColor: getCellRGBColor(indexRow, indexCol),
    },
  ];

  const getCellRGBColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellRGBColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(colors.primary);

  const yellowCaps = getAllLettersWithColor(colors.secondary);

  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  if (gameState != "playing") {
    return (
      <End
        won={gameState == "won"}
        rows={rows}
        getCellBGColor={getCellRGBColor}
      />
    );
  }
  return (
    <>
      <ScrollView style={styles.map}>
        {rows.map((row, indexRow) => (
          <Animated.View
            entering={SlideInLeft.delay(indexRow * 30)}
            style={styles.row}
            key={`${indexRow}-row`}
          >
            {row.map((letter, indexCol) => (
              <React.Fragment key={`cell-${indexCol}-row-${indexRow}`}>
                {indexRow < curRow && (
                  <Animated.View
                    entering={FlipInEasyY.delay(indexCol * 100)}
                    style={getCellStyle(indexRow, indexCol)}
                    key={`${indexCol}-enter-col-${indexRow}-row`}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </Animated.View>
                )}

                {indexRow == curRow && !!letter && (
                  <Animated.View
                    entering={ZoomIn}
                    style={getCellStyle(indexRow, indexCol)}
                    key={`${indexCol}-active-col-${indexRow}-row`}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </Animated.View>
                )}

                {!letter && (
                  <View
                    style={getCellStyle(indexRow, indexCol)}
                    key={`${indexCol}-col-${indexRow}-row`}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </View>
                )}
              </React.Fragment>
            ))}
          </Animated.View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  );
}
