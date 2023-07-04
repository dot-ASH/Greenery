import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faUserTie } from "@fortawesome/free-solid-svg-icons";

export const Home = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [trefle, setTrefle] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [plants, setPlants] = useState([]);
  const [discountedPlants, setDiscountedPlants] = useState([]);

  useEffect(() => {
    getUsers();
    getDiscounts();
    getPlants();
    getDiscountedPlants();
  }, []);

  plants.sort((a, b) => a.id - b.id);

  const getUID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data.session?.user) {
      return data.session.user.id;
    }
  };

  async function getUsers() {
    let id = await getUID();
    const response = await supabase
      .from("users")
      .select(`*`)
      .eq("username", id);

    if (response.error) {
      console.log(response.error);
    } else {
      setUserData(response?.data[0]);
    }
  }

  async function getDiscounts() {
    const response = await supabase.from("discounts").select(`*`);

    if (response.error) {
      console.log(response.error);
    } else {
      setDiscounts(response?.data);
    }
  }

  async function getDiscountedPlants() {
    const response = await supabase
      .from("plant")
      .select(`id, plant_name, image_url, price, discounts(amount)`)
      .eq("discounts", 1);

    if (response.error) {
      console.log(response.error);
    } else {
      setDiscountedPlants(response?.data);
    }
  }

  async function getPlants() {
    const response = await supabase.from("plant").select(`*`);

    if (response.error) {
      console.log(response.error);
    } else {
      setPlants(response?.data);
    }
  }

  const changeScreen = (screen) => {
    navigation.push(screen);
    navigation.navigate("Drawerstack", { active: screen });
  };

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />

      <ScrollView
        showsVerticalScrollIndicator
        style={{ flex: 1, width: Dimensions.get("window").width }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => changeScreen("Profile")}
            >
              {userData && userData.avatar_url ? (
                <Image
                  source={userData.avatar_url}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  contentFit="cover"
                  transition={1000}
                ></Image>
              ) : (
                <FontAwesomeIcon
                  icon={faUserTie}
                  size={24}
                  style={{ color: myColors.light, margin: 23 }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            {/* MY PLANTS */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>My plants</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                <View
                  style={{
                    backgroundColor: myColors.dark,
                    borderRadius: 20,
                    height: 80,
                    width: 80,
                    marginBottom: 20,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ color: myColors.light }}
                      icon={faPlus}
                      size={46}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* DISCOUNTS */}
            {discounts ? (
              <View style={styles.section}>
                {/* DIS BANNER */}
                <View style={styles.disBanner}>
                  <Text
                    style={{
                      color: myColors.darkAlt,
                      fontFamily: "lusitanaBold",
                      fontSize: 18,
                    }}
                  >
                    Flash sales
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 72,
                        color: myColors.dark,
                        fontFamily: "lusitanaBold",
                      }}
                    >
                      {discounts[0] && discounts[0].amount}%
                    </Text>
                    <Text
                      style={{
                        color: myColors.darkAlt,
                        fontFamily: "lusitana",
                        fontSize: 22,
                      }}
                    >
                      off
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: myColors.darkAlt,
                      fontFamily: "lusitanaBold",
                      fontSize: 18,
                    }}
                  >
                    {discounts[0] && discounts[0].description}
                  </Text>
                </View>
                {/* DIS CONTENT */}
                <View style={styles.sectionContentContainer}>
                  {discountedPlants
                    ? discountedPlants.map((item, key) => {
                        return (
                          <View style={styles.sectionContent} key={key}>
                            <ImageBackground
                              source={{ uri: item.image_url }}
                              style={[styles.image , {gap:100}]}
                              resizeMode="cover"
                              transition={1000}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  console.log(item.id);
                                  navigation.navigate("product", {
                                    id: item.id,
                                  });
                                }}
                              >
                                <Text style={styles.contentText}>
                                  {item.plant_name}
                                </Text>
                             
                              </TouchableOpacity>
                                 {item.discounts ? (
                                  <Text style={[styles.contentText, {alignSelf: "flex-end", marginRight: -40, width: 60, textAlign:"left"}]}>
                                    {item.discounts.amount} %
                                  </Text>
                                ) : null}
                            </ImageBackground>
                          </View>
                        );
                      })
                    : null}
                </View>
              </View>
            ) : null}

            {/* POPULAR */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>Popular Plants</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                {plants
                  ? plants.slice(0, 2).map((item, key) => {
                      return (
                        <View style={styles.sectionContent} key={key}>
                          <ImageBackground
                            source={{ uri: item.image_url }}
                            style={styles.image}
                            resizeMode="cover"
                            transition={1000}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("product", { id: item.id })
                              }
                            >
                              <Text style={styles.contentText}>
                                {item.plant_name}
                              </Text>
                            </TouchableOpacity>
                          </ImageBackground>
                        </View>
                      );
                    })
                  : null}
              </View>
            </View>
            {/* EXPLORE */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>Explore</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                {plants
                  ? plants.map((item, key) => {
                      return (
                        <View style={styles.sectionContent} key={key}>
                          <ImageBackground
                            source={{ uri: item.image_url }}
                            style={styles.image}
                            resizeMode="cover"
                            transition={1000}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("product", { id: item.id })
                              }
                            >
                              <Text style={styles.contentText}>
                                {item.plant_name}
                              </Text>
                            </TouchableOpacity>
                          </ImageBackground>
                        </View>
                      );
                    })
                  : null}
              </View>
            </View>
            {/* SUPPORT */}
            <View style={[styles.section, { marginBottom: 80 }]}>
              <View>
                <Text style={styles.sectionTitle}>Support</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                <TouchableOpacity style={{ elevation: 5 }}>
                  <Text style={styles.supportButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ elevation: 5 }}>
                  <Text style={styles.supportButtonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ elevation: 5 }}>
                  <Text style={styles.supportButtonText}>FAQ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: myColors.light,
    paddingHorizontal: 30,
    paddingTop: 80,
    gap: 10,
  },
  titleContainer: {},
  profileIcon: {
    backgroundColor: myColors.dark,
    width: 70,
    borderRadius: 50,
    height: 70,
    alignSelf: "flex-end",
    overflow: "hidden",
    elevation: 10,
    marginBottom: -10,
  },
  section: {
    paddingVertical: 10,

    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: "algreyaBold",
    marginBottom: 20,
    color: myColors.darkAlt,
  },
  sectionContentContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  sectionContent: {
    margin: 1,
    borderRadius: 20,
    width: Dimensions.get("window").width / 2 - 50,
    height: 250,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
  },
  image: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: myColors.darkAlt,
  },
  contentText: {
    fontFamily: "lusitanaBold",
    backgroundColor: myColors.transDark,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
  },
  disBanner: {
    backgroundColor: myColors.lightGreen,
    borderRadius: 25,
    width: "100%",
    padding: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
    elevation: 5,
  },
  supportButtonText: {
    fontFamily: "lusitanaBold",
    backgroundColor: myColors.dark,
    color: "white",
    width: 100,
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
});
