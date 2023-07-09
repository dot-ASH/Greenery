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
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faUserTie } from "@fortawesome/free-solid-svg-icons";

export const Home = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [plants, setPlants] = useState([]);
  const [owned, setOwned] = useState([]);
  const [discountedPlants, setDiscountedPlants] = useState();
  const [compLoading, setCompLoading] = useState(true);

  useEffect(() => {
    getUsers();
    getDiscounts();
    getPlants();
    getDiscountedPlants();
    getOwned();
  }, []);

  useEffect(() => {
    getOwned();
  }, [owned]);

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

  async function getUsersId() {
    let id = await getUID();
    const response = await supabase
      .from("users")
      .select(`*`)
      .eq("username", id);
    if (response.error) console.log(response.error);
    else return response?.data[0].id;
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

  const getOwned = async () => {
    let id = await getUsersId();
    const response = await supabase
      .from("owned")
      .select("id, product_id(id, plant_name, image_url, watering), notify")
      .eq("user_id", id);

    if (response.error) console.log(response.error);
    else setOwned(response.data);
  };

  const changeScreen = (screen) => {
    navigation.navigate(screen);
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
              <View
                style={[
                  styles.sectionContentContainer,
                  { justifyContent: "flex-start", gap: 20 },
                ]}
              >
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
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    {owned.map((item) => {
                      return (
                        <View
                          style={{
                            backgroundColor: myColors.dark,
                            borderRadius: 20,
                            height: 80,
                            width: 80,
                            marginBottom: 20,
                          }}
                          key={item.id}
                        >
                          {item.notify ? (
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
                                1
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={{
                                backgroundColor: myColors.light,
                                borderRadius: 50,
                                height: 30,
                                aspectRatio: 1,
                                alignItems: "center",
                                alignSelf: "flex-end",
                                zIndex: 500,
                              }}
                            />
                          )}
                          <TouchableOpacity
                            style={{
                              backgroundColor: myColors.dark,
                              width: "100%",
                              height: "100%",
                              alignSelf: "flex-end",
                              marginTop: -30,
                              zIndex: 1000,
                              borderRadius: 20,
                            }}
                            onPress={() => changeScreen("Saved")}
                          >
                            <Image
                              source={item.product_id.image_url}
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 20,
                                elevation: 10,
                              }}
                              contentFit="cover"
                              transition={1000}
                            ></Image>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
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
                  {discountedPlants ? (
                    discountedPlants.map((item, key) => {
                      return (
                        <View style={styles.sectionContent} key={key}>
                          <ImageBackground
                            source={{ uri: item.image_url }}
                            style={[styles.image]}
                            resizeMode="cover"
                            transition={1000}
                          >
                            <TouchableOpacity
                              onPress={() => {
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
                              <Text
                                style={[
                                  styles.contentText,
                                  {
                                    position: "absolute",
                                    alignSelf: "flex-end",
                                    right: -20,
                                    width: 60,
                                    textAlign: "left",
                                    bottom: 30,
                                  },
                                ]}
                              >
                                {item.discounts.amount} %
                              </Text>
                            ) : null}
                          </ImageBackground>
                        </View>
                      );
                    })
                  ) : (
                    <View
                      style={[
                        {
                          backgroundColor: myColors.dark,
                          width: "100%",
                          padding: 10,
                          flexDirection: "row",
                          width: Dimensions.get("window").width / 2 - 50,
                          height: 250,
                          shadowColor: "black",
                          paddingVertical: 20,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <ActivityIndicator
                        size={"large"}
                        color={myColors.light}
                      />
                    </View>
                  )}
                </View>
              </View>
            ) : null}

            {/* POPULAR */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>Popular Plants</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                {plants ? (
                  plants.slice(0, 2).map((item, key) => {
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
                ) : (
                  <View
                    style={[
                      {
                        backgroundColor: myColors.dark,
                        width: "100%",
                        padding: 10,
                        flexDirection: "row",
                        width: Dimensions.get("window").width / 2 - 50,
                        height: 250,
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
                )}
              </View>
            </View>
            {/* EXPLORE */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>Explore</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                {plants ? (
                  plants.map((item, key) => {
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
                ) : (
                  <View
                    style={[
                      {
                        backgroundColor: myColors.dark,
                        width: "100%",
                        padding: 10,
                        flexDirection: "row",
                        width: Dimensions.get("window").width / 2 - 50,
                        height: 250,
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
                )}
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
