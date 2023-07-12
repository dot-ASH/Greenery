import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { Map } from "./Map";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFile, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";

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
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      <SafeAreaView style={styles.container}>
        {/* <Map /> */}
        <View style={styles.header}>
          <View
            style={{
              alignItems: "center",
              gap: 10,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faSearch} color={myColors.light} size={22}/>
            <Text style={styles.pageTitle}>Search for plants</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 15,
            }}
          >
            <TextInput
              style={styles.textArea}
              placeholderTextColor={myColors.dark}
              placeholder="Search anything..."
            ></TextInput>
            <TouchableOpacity
              style={{
                backgroundColor: myColors.light,
                padding: 12,
                borderRadius: 15,
              }}
            >
              <FontAwesomeIcon
                icon={faFilter}
                color={myColors.dark}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}></View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: myColors.light,
    gap: 20,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.light,
    fontSize: 28,
  },
  header: {
    flex: 0.3,
    backgroundColor: myColors.darkAlt,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 30,
    justifyContent: "flex-end",
    gap: 50,
  },
  body: {
    flex: 1,
  },
  textArea: {
    flex: 1,
    height: 50,
    backgroundColor: myColors.light,
    borderRadius: 15,
    padding: 15,
    color: myColors.dark,
  },
});
