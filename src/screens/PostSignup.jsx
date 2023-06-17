// import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../data/Supabase";

export const PostSignup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleName = async () => {
    const id = await getUID();
    const { data, error } = await supabase
      .from("users")
      .update({ full_name: name })
      .eq("username", id);
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      navigation.push("Drawerstack");
    }
  };

  const getUID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data.session?.user) {
      return data.session.user.id;
    }
  };

  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      <View
        style={{
          backgroundColor: myColors.darkAlt,
          flex: 1,
          widht: null,
          height: null,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          gap: 15,
        }}
      >
        <Text
          style={{
            color: myColors.lightGreen,
            fontFamily: "algreyaBold",
            zIndex: 1000,
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Seems like you are new here,
        </Text>
        <Text
          style={{
            color: myColors.light,
            fontFamily: "algreyaBold",
            fontSize: 30,
            zIndex: 1000,
          }}
        >
          {`What's Your Full Name? `}
        </Text>
        <TextInput
          style={{
            color: myColors.light,
            fontFamily: "algreyaBold",
            fontSize: 26,
            borderBottomWidth: 1,
            borderColor: myColors.lightGreen,
            padding: 10,
            paddingLeft: 30,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            zIndex: 1000,
          }}
          placeholder="e.g.  Your Name"
          placeholderTextColor={myColors.dark}
          onChangeText={(name) => setName(name)}
        ></TextInput>

        <View
          style={{
            position: "absolute",
            backgroundColor: myColors.lightGreen,
            width: "70%",
            aspectRatio: 1,
            borderRadius: 500,
            top: 50,
            left: -200,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            backgroundColor: myColors.lightAlt,
            width: "100%",
            aspectRatio: 1,
            borderRadius: 500,
            bottom: -250,
            right: -150,
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity
            style={{
              top: 50,
              left: 150,
              zIndex: 1000,
            }}
            onPress={handleName}
          >
            <FontAwesomeIcon
              size={60}
              icon={faArrowCircleRight}
              style={{ color: myColors.darkAlt }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
