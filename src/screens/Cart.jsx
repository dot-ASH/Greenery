import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";

export const Cart = () => {
  const [userEmail, setUserEmail] = useState("");
  const [plants, setPlants] = useState("");

  useEffect(() => {
    getPlants();
  }, []);

  const getPlants = async () => {
    const response = await supabase.from("plant").select("*").limit(7);

    if (response.error) {
      console.log(response.error);
    } else {
      setPlants(response.data);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitle}>Cart</Text>
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
