import React, { Component, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ImageBackground,
} from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheckDouble,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { addons } from "react-native";

export const Saved = ({ navigation }) => {
  const [plants, setPlants] = useState();
  const [orderedPlants, setOrderedPlants] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [updateValue, setUpdateValue] = useState(false);
  const [elavatedBg, setElavatedBg] = useState(false);
  const [loading, setLoading] = useState({ item: null, state: false });
  const proCount = useRef(null);
  const [isThisSaved, setIsThisSaved] = useState(true);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  // console.log(loading);
  const getUID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data.session?.user) return data.session.user.id;
  };

  async function getUsers() {
    let id = await getUID();
    const response = await supabase
      .from("users")
      .select(`*`)
      .eq("username", id);
    if (response.error) console.log(response.error);
    else return response?.data[0];
  }

  useEffect(() => {
    getPlants();
  }, [plants]);

  const getPlants = async () => {
    let userdata = await getUsers();
    const response = await supabase
      .from("saved")
      .select(
        " id ,product_id(plant_name ,image_url, price)"
      )
      .eq("user_id", userdata.id);

    if (response.error) console.log(response.error);
    else setPlants(response.data);
  };

  const deletePro = async (id) =>{
    const { error } = await supabase
    .from("saved")
    .delete()
    .eq("id", id);
  }

  plants?.sort((a, b) => b.id - a.id);

  _renderItem = ({ item }) => (
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
        padding: 5,
        backgroundColor: myColors.dark,
        borderRadius: 10,
        gap: 15,
        alignItems: "center",
        paddingBottom: 10,
      }}
    >
      <Image
        style={{ width: "100%", height: 200, borderRadius: 10 }}
        source={{ uri: item.product_id.image_url }}
      />
      <Text
        style={{
          textAlign: "center",
          color: myColors.lightAlt,
          fontFamily: "algreyaBold",
          fontSize: 24,
        }}
      >
        {item.product_id.plant_name}
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("product", {
            id: item.id,
          })
        }
      >
        <Text style={styles.btnText}>See Details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deletePro(item?.id)}>
        <Text style={styles.btnText}>Remove from Saved</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView style={[styles.container, styles.showBorder]}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "baseline",
              paddingHorizontal: 10,
              justifyContent: "space-between",
            },
          ]}
        >
          <Text
            style={{
              fontFamily: "algreyaBold",
              fontSize: 50,
              color: myColors.darkAlt,
            }}
          >
            {isThisSaved ? "SAVED" : "OWNED"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              isThisSaved ? setIsThisSaved(false) : setIsThisSaved(true)
            }
          >
            <Text
              style={{
                fontFamily: "algreyaBold",
                fontSize: 28,
                color: myColors.dark,
              }}
            >
              {isThisSaved ? "Owned" : "Saved"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[{ flex: 1 }]}>
          <View
            style={{
              height: "100%",
              flex: 1,
              width: "100%",
              paddingVertical: 30,
              gap: 20,
            }}
          >
            <FlatList
              data={isThisSaved ? plants : owned}
              renderItem={this._renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: myColors.light,
    paddingHorizontal: 30,
    padding: 80,
    gap: 20,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.darkAlt,
    fontSize: 32,
  },
  showBorder: {
    borderColor: "black",
    borderWidth: 1,
  },
  btnText: {
    textAlign: "center",
    fontFamily: "lusitanaBold",
    color: myColors.light,
    fontSize: 17,
  },
});
