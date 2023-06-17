import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";

export const Notification = () => {
  return (
    <SafeAreaView style={StyleSheet.container}>
      <Text>Notification</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height - 90,
    alignSelf: "flex-end",
  },
});
