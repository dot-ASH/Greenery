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
import { StatusBar } from "react-native";

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
  const [compLoading, setCompLoading] = useState(false);
  const [owned, setOwned] = useState(false);
  const [ownNoti, setOwnNoti] = useState({ state: false, num: 0 });
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

  const getLoading = (item) => {
    if (item) {
      setCompLoading(false);
    } else {
      setCompLoading(true);
    }
  };

  const getOwned = async () => {
    let userdata = await getUsers();
    const response = await supabase
      .from("owned")
      .select("id, product_id(id, plant_name, image_url, watering), notify")
      .eq("user_id", userdata.id);

    if (response.error) console.log(response.error);
    else {
      setOwned(response.data);
      item = response.data.filter((a) => a?.notify == true);
      if (item.length < 1) {
        setOwnNoti({ state: false });
      } else {
        setOwnNoti({ state: true, num: item.length });
      }
    }
  };

  useEffect(() => {
    getPlants();
    getLoading(plants);
  }, [plants]);

  useEffect(() => {
    getOwned();
    getLoading(owned);
  }, [owned]);

  const getPlants = async () => {
    let userdata = await getUsers();
    const response = await supabase
      .from("saved")
      .select(" id ,product_id(plant_name ,image_url, price)")
      .eq("user_id", userdata.id);

    if (response.error) console.log(response.error);
    else setPlants(response.data);
  };

  const deletePro = async (id) => {
    const { error } = await supabase.from("saved").delete().eq("id", id);
  };

  const deleteNotification = async (id) => {
    const { error } = await supabase
      .from("owned")
      .update({ notify: false })
      .eq("id", id);
    if (error) console.log(error);
  };

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

  _renderOwnedItem = ({ item }) => (
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
        style={{ width: "100%", height: 100, borderRadius: 10 }}
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
      <Text style={styles.btnText}>
        {item.notify ? "1 new Notification" : "No new Notification"}
      </Text>
      {item.notify ? (
        <TouchableOpacity
          onPress={() => deleteNotification(item?.id)}
          style={{
            backgroundColor: myColors.dark,
            elevation: 20,
            padding: 10,
            borderRadius: 10,
            borderColor: myColors.light,
            borderWidth: 0.4,
            marginBottom: 10,
          }}
        >
          <Text style={styles.btnText}>Water your plant!</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      <SafeAreaView style={[styles.container]}>
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
              paddingTop: 20,
            }}
          >
            {isThisSaved ? "SAVED" : "OWNED"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              isThisSaved ? setIsThisSaved(false) : setIsThisSaved(true)
            }
          >
            {isThisSaved ? (
              <>
                {ownNoti.state === true ? (
                  <View
                    style={{
                      backgroundColor: myColors.dark,
                      borderRadius: 50,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: myColors.light,
                      borderColor: myColors.dark,
                      borderWidth: 0.3,
                      alignSelf: "flex-end",
                      zIndex: 2000,
                      height: 30,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        color: myColors.dark,
                        fontFamily: "judsonBold",
                      }}
                    >
                      {ownNoti.num}
                    </Text>
                  </View>
                ) : null}
                <Text
                  style={{
                    fontFamily: "algreyaBold",
                    fontSize: 28,
                    color: myColors.dark,
                    marginTop: -15,
                    marginRight: 15,
                  }}
                >
                  Owned
                </Text>
              </>
            ) : (
              <Text
                style={{
                  fontFamily: "algreyaBold",
                  fontSize: 28,
                  color: myColors.dark,
                }}
              >
                Saved
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={[{ flex: 1 }]}>
          {compLoading ? (
            <View
              style={[
                {
                  backgroundColor: myColors.lightGreen,
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  height: 100,
                  shadowColor: "black",
                  paddingVertical: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <ActivityIndicator size={"large"} color={myColors.light} />
            </View>
          ) : null}
          {isThisSaved && plants?.length == 0 ? (
            <View
              style={[
                {
                  backgroundColor: myColors.lightGreen,
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  height: 100,
                  shadowColor: "black",
                  paddingVertical: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontFamily: "lusitana",
                  fontSize: 22,
                }}
              >
                You havn't saved anything!
              </Text>
            </View>
          ) : null}
          {!isThisSaved && owned?.length == 0 ? (
            <View
              style={[
                {
                  backgroundColor: myColors.lightGreen,
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  height: 100,
                  shadowColor: "black",
                  paddingVertical: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontFamily: "lusitana",
                  fontSize: 22,
                }}
              >
                You havn't owned anything!
              </Text>
            </View>
          ) : null}
          <View
            style={{
              height: "100%",
              flex: 1,
              width: "100%",
              paddingVertical: 30,
              gap: 20,
            }}
          >
            {isThisSaved ? (
              <FlatList
                key={"_"}
                data={plants}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                style={{ flex: 1 }}
                ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              />
            ) : (
              <FlatList
                key={"#"}
                data={owned}
                renderItem={this._renderOwnedItem}
                keyExtractor={(item) => item.id}
                style={{ flex: 1 }}
                ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              />
            )}
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
    padding: 60,
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
