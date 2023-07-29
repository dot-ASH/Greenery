import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  UIManager,
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
  Linking,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faUserTie, faXmark } from "@fortawesome/free-solid-svg-icons";
import GestureRecognizer from "react-native-swipe-gestures";
import text from "../data/faq.json";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Home = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [plants, setPlants] = useState([]);
  const [owned, setOwned] = useState([]);
  const [discountedPlants, setDiscountedPlants] = useState();
  const [compLoading, setCompLoading] = useState(true);
  const [elavatedBg, setElavatedBg] = useState(false);
  const [fqModule, setFaqModule] = useState(false);
  const [askedQue, setAskedQue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    getUsers();
    getPlants();
    getOwned();
  }, []);

  useEffect(() => {
    getOwned();
  }, [owned]);

  useEffect(() => {
    getDiscounts();
    getDiscountedPlants();
  }, [discounts]);

  useEffect(() => {
    if (askedQue) setDisabled(false);
    else setDisabled(true);
  }, [askedQue]);

  plants.sort((a, b) => a.id - b.id);
  let popular = plants?.sort((a, b) => b.score - a.score);

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
    if (typeof(discounts) != undefined) {
      const response = await supabase
        .from("plant")
        .select(`id, plant_name, image_url, price`)
        .eq("discounts", 1);

      if (response.error) {
        console.log(response.error);
      } else {
        setDiscountedPlants(response?.data);
      }
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

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: "easeIn", property: "opacity" },
    });
  };

  const sendQue = async () => {
    const { data, error } = await supabase
      .from("faq")
      .insert([{ user_id: userData?.id, question: askedQue }])
      .select();
    if (!error) {
      setElavatedBg(false);
      setFaqModule(false);
      getAnimation();
      setAlertText("Question sent");
      setTimeout(() => {
        setAlertText("");
      }, 4000);
    } else {
      console.log(error);
    }
  };

  const faqModule = () => {
    return (
      <>
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            setFaqModule(false);
            setElavatedBg(false);
          }}
          style={styles.gestureStyle}
        >
          <View
            style={{
              alignSelf: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
              width: "100%",
              paddingBottom: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                getAnimation();
                setFaqModule(false);
                setElavatedBg(false);
              }}
            >
              <FontAwesomeIcon
                size={20}
                icon={faXmark}
                style={{
                  color: myColors.dark,
                  alignSelf: "flex-end",
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              height: 600,
            }}
          >
            <ScrollView>
              <View style={{ width: "100%", padding: 20 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "algreyaBold",
                    fontSize: 26,
                  }}
                >
                  Frequently Asked Questions
                </Text>
              </View>
              {text.map((item, key) => {
                return (
                  <View
                    style={{ flexDirection: "column", marginVertical: 10 }}
                    key={key}
                  >
                    <Text
                      style={{
                        textAlign: "justify",
                        fontFamily: "lusitanaBold",
                        fontSize: 16,
                      }}
                    >
                      {item.que}
                    </Text>
                    <Text
                      style={{
                        textAlign: "justify",
                        fontFamily: "lusitana",
                        fontSize: 16,
                      }}
                    >
                      {"=>"} &nbsp;
                      {item.ans}
                    </Text>
                  </View>
                );
              })}
              <Text
                style={{
                  textAlign: "justify",
                  fontFamily: "lusitanaBold",
                  fontSize: 16,
                  marginTop: 20,
                }}
              >
                Have anything to ask?
              </Text>
              <View
                style={{
                  marginVertical: 20,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={{
                    width: 230,
                    height: 50,
                    borderWidth: 1,
                    borderColor: myColors.lightGreen,
                    borderRadius: 10,
                    color: myColors.darkAlt,
                    padding: 10,
                    fontSize: 18,
                    fontFamily: "lusitana",
                  }}
                  onChangeText={(value) => setAskedQue(value)}
                />
                <TouchableOpacity onPress={() => sendQue()} disabled={disabled}>
                  <Text
                    style={{
                      alignSelf: "center",
                      width: 80,
                      padding: 15,
                      backgroundColor: disabled
                        ? myColors.lightGreen
                        : myColors.dark,
                      borderRadius: 10,
                      color: myColors.light,
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "lusitanaBold",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </GestureRecognizer>
      </>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      {elavatedBg ? <View style={styles.elavatedbg}></View> : null}
      {fqModule ? faqModule() : null}
      {alertText ? (
        <View
          style={{
            position: "absolute",
            backgroundColor: myColors.lightAlt,
            zIndex: 5000,
            borderColor: myColors.dark,
            borderRadius: 15,
            borderWidth: 0.4,
            elevation: 30,
            bottom: 120,
            alignSelf: "center",
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "justify",
              fontFamily: "lusitanaBold",
              fontSize: 18,
            }}
          >
            {alertText}
          </Text>
        </View>
      ) : null}
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
                            {discounts[0]?.amount ? (
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
                                {discounts[0].amount} %
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
                  popular.slice(0, 4).map((item, key) => {
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
                  plants.slice(0, 8).map((item, key) => {
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
                <TouchableOpacity
                  style={{
                    elevation: 10,
                    width: "100%",
                    justifyContent: "center",
                    marginVertical: 10,
                  }}
                  onPress={() => {
                    changeScreen("Search");
                  }}
                >
                  <Text
                    style={[
                      styles.supportButtonText,
                      { width: 150, fontSize: 18, borderRadius: 15 },
                    ]}
                  >
                    Find more
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* SUPPORT */}
            <View style={[styles.section, { marginBottom: 80 }]}>
              <View>
                <Text style={styles.sectionTitle}>Support</Text>
              </View>
              <View style={styles.sectionContentContainer}>
                <TouchableOpacity
                  style={{ elevation: 5 }}
                  onPress={() => {
                    Linking.openURL("tel:01963606880");
                  }}
                >
                  <Text style={styles.supportButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ elevation: 5 }}
                  onPress={() => {
                    Linking.openURL("mailto:19202103403@bubt.cse.edu.com");
                  }}
                >
                  <Text style={styles.supportButtonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ elevation: 5 }}
                  onPress={() => {
                    getAnimation();
                    setElavatedBg(true);
                    setFaqModule(true);
                  }}
                >
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

  elavatedbg: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: Dimensions.get("window").height + 80,
    width: Dimensions.get("window").width,
    zIndex: 2000,
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
  gestureStyle: {
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 20,
    width: Dimensions.get("window").width - 20,
    bottom: 80,
    zIndex: 3000,
    backgroundColor: myColors.light,
    borderRadius: 20,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
