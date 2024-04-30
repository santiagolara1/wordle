import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { firestore } from "../../Credenciales"; // Asegúrate de ajustar la ruta de importación correctamente

interface NavigationProp {
  navigate: (screen: string) => void;
}

interface Resultado {
  word: string;
  win: boolean;
  score: number;
  id: string; // Agrega id si lo necesitas para operaciones futuras
}

interface ScoreScreenProps {
  navigation: NavigationProp;
}

export default function ScoreScreen({ navigation }: ScoreScreenProps) {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarResultados();
  }, []);

  const cargarResultados = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await firestore
        .collection("gameResults")
        .orderBy("score", "desc")
        .get();
      const fetchedResults: Resultado[] = [];
      querySnapshot.forEach((doc) => {
        fetchedResults.push({
          id: doc.id,
          word: doc.data().word,
          win: doc.data().win,
          score: doc.data().score,
        });
      });
      setResultados(fetchedResults);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar los resultados del juego:", error);
      setError("Failed to load game results.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Cargando resultados...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={cargarResultados} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resultados del Juego</Text>
      {resultados.map((resultado, index) => (
        <View key={resultado.id} style={styles.resultItem}>
          <Text>
            Palabra: {resultado.word}, Resultado:{" "}
            {resultado.win ? "Ganado" : "Perdido"}, Puntaje: {resultado.score}
          </Text>
        </View>
      ))}
      <Button
        title="Volver a jugar"
        onPress={() => navigation.navigate("Game")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
});
