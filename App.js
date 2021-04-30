import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Lottery from "./src/pages/Lottery";
import { LotteryProvider } from "./src/context/lotteryContext";

export default function App() {
  return (
    <LotteryProvider>
      <Lottery />
    </LotteryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
