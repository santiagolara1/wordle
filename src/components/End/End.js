import { View, Text, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { colors, colorsToEmoji } from "../../utils/constants";
import styles from "./End.styles";

import Animated, { SlideInLeft } from "react-native-reanimated";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Number = ({ number, label }) => (
  <View style={styles.numberContainer}>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const GuessDistributionLine = ({ position, amount, percentage }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
      margin: 5,
    }}
  >
    <Text style={{ color: colors.lightgrey }}>{position}</Text>
    <View
      style={{
        backgroundColor: colors.grey,
        width: `${percentage}%`,
        marginLeft: 5,
        padding: 2.5,
        minWidth: 20,
      }}
    >
      <Text style={{ color: colors.lightgrey }}>{amount}</Text>
    </View>
  </View>
);

const GuessDistribution = ({ distribution }) => {
  if (!distribution) {
    return null;
  }
  const sum = distribution.reduce((total, dist) => total + dist, 0);
  return (
    <>
      <Text style={styles.subtitle}>Guess Distribution</Text>
      <View style={{ width: "100%" }}>
        {distribution.map((dist, index) => (
          <GuessDistributionLine
            key={`d-${index}`}
            position={index + 1}
            amount={dist}
            percentage={100 * (dist / sum)}
          />
        ))}
      </View>
    </>
  );
};

const EndScreen = ({ won = false, rows, getCellBGColor }) => {
  const [secTillTom, setSecTillTom] = useState(0);

  const [countPlayed, setCountPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [currStreak, setCurrStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [distribution, setDisctribution] = useState(null);

  const share = () => {
    const textShare = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    Clipboard.setString("Wordle \n" + textShare);
    Alert.alert("Share", "Copied to Clipboard");
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      setSecTillTom((tomorrow - now) / 1000);
    };

    const interval = setInterval(updateTime, 1000);
    readState();
    return () => clearInterval(interval);
  }, []);

  const formatCountDown = () => {
    const hours = Math.floor(secTillTom / (60 * 60));
    const minutes = Math.floor((secTillTom % (60 * 60)) / 60);
    const seconds = Math.floor(secTillTom % 60);

    return `${hours}:${minutes}:${seconds}`;
  };

  const readState = async () => {
    let data;
    try {
      const dataString = await AsyncStorage.getItem("@game");
      data = JSON.parse(dataString);
    } catch (e) {
      console.log("An error ocurred during reading of state", e);
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const totalGames = keys.length;
    const totalWins = values.filter((game) => game.gameState == "won").length;

    setCountPlayed(totalGames);
    setWinRate(Math.floor(100 * (totalWins / totalGames)));

    let prevDay = 0;
    let _currStreak = 0;
    let _maxStreak = 0;

    keys.forEach((key) => {
      const day = parseInt(key.split("-")[1]);
      if (
        (data[key].gameState == "won" && _currStreak == 0) ||
        (data[key].gameState == "won" && prevDay + 1 == day)
      ) {
        _currStreak += 1;
      } else {
        if (_currStreak > _maxStreak) {
          _maxStreak = _currStreak;
        }
        _currStreak = data[key].gameState == "won" ? 1 : 0;
      }
      prevDay = day;
    });

    setCurrStreak(_currStreak);
    setMaxStreak(_maxStreak);

    // Guess Distribution
    const dist = [0, 0, 0, 0, 0, 0];
    values.forEach((game) => {
      if (game.gameState == "won") {
        const tries = game.rows.filter((row) => row[0]).length;
        dist[tries] = dist[tries] + 1;
      }
    });

    setDisctribution(dist);
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        entering={SlideInLeft.springify().mass(0.5)}
        style={styles.title}
      >
        {won ? "Congrats, Well Done!" : "Oh no, try again tomorrow"}
      </Animated.Text>

      <View>
        <Text style={styles.subtitle}>STATISTICS</Text>
        <View style={styles.statContainer}>
          <Number number={countPlayed} label={"No. Played"} />
          <Number number={winRate} label={"Winrate %"} />
          <Number number={currStreak} label={"Curr Streak"} />
          <Number number={maxStreak} label={"Max Streak"} />
        </View>
      </View>

      <View style={{ width: "100%" }}>
        <GuessDistribution distribution={distribution} />
      </View>

      <View style={{ flexDirection: "row", padding: 20, marginTop: 20 }}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontSize: 16, color: colors.lightgrey }}>
            Next Wordle
          </Text>
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }}>
            {formatCountDown()}
          </Text>
        </View>
        <Pressable
          onPress={share}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.lightgrey,
            }}
          >
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EndScreen;
