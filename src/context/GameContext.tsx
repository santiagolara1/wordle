import React, { useState } from "react";
import { createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GameContext = createContext({});

export const GameProvider = ({ children }) => {
  const words = ["test"];
  const [wordSelected, setWordSelected] = useState(words[0]);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("my-key", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  return <GameContext.Provider value={{}}>{children}</GameContext.Provider>;
};
