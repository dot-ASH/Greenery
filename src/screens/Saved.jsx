import React, { useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { StyleSheet } from "react-native";

export const Saved = () => {
  const [userEmail, setUserEmail] = useState("");

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitle}>Saved</Text>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: myColors.light,
    paddingHorizontal: 30,
    paddingTop: 100,
    gap: 20,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.darkAlt,
    fontSize: 32,
  },
});
