import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { myColors } from "../styles/Colors";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

export const Welcome = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeView}>
          <Text style={styles.motto}>Grow Your Plant With us</Text>
          <Text style={styles.welcomeFont}>Welcome to Greenery!</Text>
          <View style={styles.welcomeBanner}>
            <Image
              source={require("../img/welcome.jpeg")}
              style={styles.image}
              contentFit="cover"
              transition={1000}
            ></Image>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            navigation.push("Login");
          }}
        >
          <Text style={styles.buttonText}>{"Get Started ->"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: myColors.light,
    paddingHorizontal: 30,
  },
  welcomeView: {
    flex: 0.9,
    gap: 30,
  },
  motto: {
    textTransform: "uppercase",
    fontSize: 28,
    color: myColors.lightGreen,
    paddingTop: 20,
    textAlign: "center",
    fontFamily: "algreyaBold",
  },
  welcomeFont: {
    fontSize: 30,
    color: myColors.dark,
    textAlign: "center",
    fontFamily: "lusitanaBold",
    marginBottom: -10,
  },
  welcomeBanner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    paddingVertical: 30,
  },

  buttonStyle: {
    marginVertical: 20,
    backgroundColor: myColors.dark,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 12,
    shadowColor: myColors.dark,
    shadowOpacity: 0.9,
    elevation: 10,
  },
  buttonText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 20,
    color: myColors.light,
    fontFamily: "lusitanaBold"
  },
  image: {
    flex: 1,
    width: "130%",
    height: "130%",
    borderRadius: 20,
  },
});
