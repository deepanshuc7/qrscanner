import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Welcome() {
  const { name } = useLocalSearchParams(); // Correct hook to get the location name from route params

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to {name}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0E7AFE",
  },
});
