import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { Map } from "./Map";

export const Search = () => {
  const [userEmail, setUserEmail] = useState("");

  async function getUsers(uid) {
    const response = await supabase
      .from("users")
      .select(`*`)
      .eq("username", uid);

    if (response.error) {
      console.log(response.error);
    } else {
      return response?.data[0];
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <Map /> */}
        <Text style={styles.pageTitle}>Search</Text>
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
