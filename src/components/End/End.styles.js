import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export default StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 20,
    color: colors.lightgrey,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  statContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  numberContainer: {
    margin: 10,
    alignItems: "center",
  },

  number: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },

  label: {
    fontSize: 16,
    color: colors.lightgrey,
  },
});
