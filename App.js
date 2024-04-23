import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import { colors } from "./src/utils/constants";
import Game from "./src/components/Game";

export default function App() {
  const [startGame, setStartGame] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {!startGame ? (
        <>
          <Text style={styles.title}>WORDLE</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setStartGame(true)}
          >
            <Text style={styles.buttonText}>Comenzar Juego</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Game />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    paddingTop: 80,
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  button: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
