import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { myColors } from "../styles/Colors";
import { supabase } from "../data/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAngleLeft,
  faCartPlus,
  faCat,
  faCheck,
  faDollarSign,
  faDoorOpen,
  faFileImage,
  faFlag,
  faSeedling,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faSun } from "@fortawesome/free-regular-svg-icons";
import { BackHandler } from "react-native";
import { CheckBox } from "react-native-elements";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Product = ({ navigation, route }) => {
  const [userId, setUserId] = useState();
  const [plant, setPlant] = useState({});
  const [margin, setMargin] = useState(-20);
  const scrollViewRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  const [elavatedBg, setElavatedBg] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compLoading, setCompLoading] = useState(false);

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
      setUserId(response?.data[0]);
    }
  }

  useEffect(() => {
    getUsers();
    checkCart();
    checkSaved();
  });

  useEffect(() => {
    console.log(route.params.id);
  }, [route.params.id]);

  useEffect(() => {
    handleDefault();
  }, [elavatedBg]);

  useEffect(() => {
    getPlant();
    shrinkFull();
    setLiked(false);
  }, [route.params.id]);

  // useEffect(() => {
  //   if (plant) {
  //     setCompLoading(false);
  //   }
  // }, [plant]);

  async function getPlant() {
    setCompLoading(true);
    const response = await supabase
      .from("plant")
      .select(
        `id,plant_name,image_url,discounts(amount),price,plant_description,sun_exposure,toxicity,plant_type,plant_care,plant_family,soil_type,common_name,details_img`
      )
      .eq("id", route.params.id);
    if (response.error) {
      console.log(response.error);
    } else {
      setPlant(response?.data[0]);
      setCompLoading(false);
    }
  }

  const checkCart = async () => {
    const response = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId?.id)
      .eq("product_id", route.params.id);
    if (!response.error) {
      if (response.data.length > 0) {
        setAlreadyAdded(true);
      } else {
        setAlreadyAdded(false);
      }
    }
  };

  const checkSaved = async () => {
    const response = await supabase
      .from("saved")
      .select("*")
      .eq("user_id", userId?.id)
      .eq("product_id", route.params.id);
    if (!response.error) {
      if (response.data.length > 0) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  };

  const handleDefault = () => {
    navigation.addListener("beforeRemove", (e) => {
      if (elavatedBg === false) {
        return;
      }
      e.preventDefault();
    });
    // shrinkFull();
  };

  const shrinkFull = () => {
    setElavatedBg(false);
    setMargin(-20);
    setScrollY(0);
  };

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    setScrollY(offset);
    if (scrollY > 200) {
      setElavatedBg(true);
      setMargin(-330);
      BackHandler.addEventListener("hardwareBackPress", shrinkFull);
    }
  };

  const addToCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart")
      .insert([{ product_id: route.params.id, user_id: userId.id }]);

    if (!error) {
      setAlreadyAdded(true);
      setLoading(false);
    } else {
      console.log(error);
    }
  };

  const likedPro = async () => {
    const { data, error } = await supabase
      .from("saved")
      .insert([{ product_id: route.params.id, user_id: userId.id }]);
    if (!error) {
      setLiked(true);
    } else {
      console.log(error);
    }
  };

  const discountedAmount = (price, amount) => {
    return price - price * (amount / 100);
  };

  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />

      {compLoading ? (
        // <View
        //   style={{
        //     flex: 1,
        //     zIndex: 8000,
        //     position: "absolute",
        //     width: Dimensions.get("window").width,
        //     height: Dimensions.get("window").height + 80,
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        // >
        //   <View
        //     style={{
        //       backgroundColor: myColors.darkAlt,
        //       color: myColors.light,
        //       height: 200,
        //       width: 250,
        //       justifyContent: "center",
        //       alignItems: "center",
        //       borderRadius: 15
        //     }}
        //   >
        //     <ActivityIndicator size={"large"} color={myColors.light} />
        //   </View>
        // </View>
        <View style={[styles.filterContainer, { opacity: 0.8 }]}>
          <View
            style={{
              width: 300,
              height: 200,
              backgroundColor: "white",
              borderRadius: 15,
              alignItems: "center",
              padding: 20,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator
              size={"large"}
              color={myColors.darkAlt}
            ></ActivityIndicator>
          </View>
        </View>
      ) : null}

      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 60,
            left: 30,
            zIndex: 4000,
            backgroundColor: myColors.transDark,
            padding: 5,
            borderRadius: 10,
            opacity: 0.5,
          }}
          onPress={() => {
            navigation.push("Drawerstack");
          }}
        >
          <FontAwesomeIcon
            size={24}
            icon={faAngleLeft}
            style={{ color: myColors.darkAlt }}
          />
        </TouchableOpacity>
        <View style={styles.profileBanner}>
          {elavatedBg ? <View style={styles.elavatedbg}></View> : null}
          <Image
            source={{ uri: plant ? plant.image_url : null }}
            style={styles.img}
          ></Image>
        </View>
        <View style={[styles.scrollContainer, { marginTop: margin }]}>
          <View
            style={{
              width: "95%",
              height: 60,
              marginTop: 10,
              borderRadius: 20,
              backgroundColor: myColors.lightAlt,
              elevation: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "algreyaBold",
                fontSize: 26,
                color: myColors.dark,
              }}
            >
              {plant && plant.plant_name}
            </Text>
          </View>
          <ScrollView
            style={[styles.product]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={160}
          >
            <View style={{ width: "100%" }}>
              <View style={styles.quickContainer}>
                <View style={styles.plantDes}>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "lusitanaBold",
                      fontSize: 18,
                    }}
                  >
                    {plant && plant.plant_description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.quickInfo,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: myColors.lightAlt,
                      flexDirection: "column",
                      gap: 10,
                      elevation: 10,
                      flex: 1,
                      flexWrap: "wrap",
                      flexShrink: 1,
                      alignContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      size={20}
                      icon={faDollarSign}
                      style={{ color: myColors.dark, alignSelf: "center" }}
                    />
                    {plant?.discounts ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: myColors.dark,
                            fontFamily: "lusitanaBold",
                            fontSize: 18,
                            textAlign: "center",
                            alignSelf: "center",
                            textDecorationLine: "line-through",
                            textDecorationStyle: "solid",
                          }}
                        >
                          {plant?.price}
                        </Text>
                        <Text
                          style={{
                            color: myColors.dark,
                            fontFamily: "lusitanaBold",
                            fontSize: 18,
                            textAlign: "center",
                            alignSelf: "center",
                          }}
                        >
                          {discountedAmount(
                            plant?.price,
                            plant?.discounts.amount
                          )}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={{
                          color: myColors.dark,
                          fontFamily: "lusitanaBold",
                          fontSize: 18,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        {plant?.price}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: myColors.lightAlt,
                      flexDirection: "column",
                      gap: 10,
                      elevation: 10,
                      flex: 1,
                      flexWrap: "wrap",
                      flexShrink: 1,
                      alignContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      size={20}
                      icon={faDoorOpen}
                      style={{ color: myColors.dark, alignSelf: "center" }}
                    />
                    <Text
                      style={{
                        color: myColors.dark,
                        fontFamily: "lusitanaBold",
                        fontSize: 18,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {plant && plant.plant_type}
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: myColors.lightAlt,
                      flexDirection: "column",
                      gap: 10,
                      elevation: 10,
                      flex: 1,
                      flexWrap: "wrap",
                      flexShrink: 1,
                      alignContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      size={20}
                      icon={faSun}
                      style={{ color: myColors.dark, alignSelf: "center" }}
                    />
                    <Text
                      style={{
                        color: myColors.dark,
                        fontFamily: "lusitanaBold",
                        fontSize: 18,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {plant && plant.sun_exposure ? "full-sun" : "low-light"}
                    </Text>
                  </View>
                </View>

                <View style={[styles.quickInfo, {}]}>
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: myColors.lightAlt,
                      flexDirection: "column",
                      gap: 10,
                      elevation: 10,
                      flex: 1,
                      flexWrap: "wrap",
                      flexShrink: 1,
                      alignContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      size={20}
                      icon={faCat}
                      style={{ color: myColors.dark, alignSelf: "center" }}
                    />
                    <Text
                      style={{
                        color: myColors.dark,
                        fontFamily: "lusitanaBold",
                        fontSize: 18,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {plant && plant.toxicity}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: myColors.lightAlt,
                      flexDirection: "column",
                      gap: 10,
                      elevation: 10,
                      flex: 1,
                      flexWrap: "wrap",
                      flexShrink: 1,
                      alignContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      size={20}
                      icon={faSeedling}
                      style={{ color: myColors.dark, alignSelf: "center" }}
                    />
                    <Text
                      style={{
                        color: myColors.dark,
                        fontFamily: "lusitanaBold",
                        fontSize: 18,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {plant && plant.soil_type}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.plantDes,
                    {
                      flexDirection: "row",
                      gap: 20,
                      flexShrink: 1,
                      padding: 30,
                    },
                  ]}
                >
                  <FontAwesomeIcon
                    icon={faFlag}
                    style={{ color: myColors.highText }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "lusitanaBold",
                      fontSize: 18,
                    }}
                  >
                    However, The plant {plant && plant.plant_care}.
                  </Text>
                </View>

                <View style={styles.sectionHeader}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFileImage}
                      style={{ color: myColors.lightAlt }}
                    />
                    <Text
                      style={{
                        color: myColors.lightAlt,
                        fontFamily: "lusitanaBold",
                        fontSize: 20,
                      }}
                    >
                      More images
                    </Text>
                  </View>

                  <View style={styles.imageContainer}>
                    {plant.details_img
                      ? plant.details_img.map((item, key) => {
                          return (
                            <View
                              style={{
                                height: 250,
                                flex: 0.5,
                                borderRadius: 15,
                                overflow: "hidden",
                                elevation: 10,
                              }}
                              key={key}
                            >
                              <Image
                                source={{
                                  uri: item,
                                }}
                                contentFit="cover"
                                transition={1000}
                                style={{ width: "100%", height: "100%" }}
                              />
                            </View>
                          );
                        })
                      : null}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              width: "95%",
              height: 60,
              borderRadius: 20,
              backgroundColor: myColors.lightAlt,
              elevation: 30,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 5,
              gap: 20,
              borderColor: myColors.dark,
              borderWidth: 1,
              marginBottom: 10
            }}
          >
            <TouchableOpacity onPress={likedPro}>
              <FontAwesomeIcon
                size={26}
                icon={liked ? faHeartSolid : faHeart}
                style={{
                  marginLeft: 20,
                  color: liked ? myColors.errorText : myColors.dark,
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 30,
                backgroundColor: myColors.dark,
                borderRadius: 15,
                padding: 10,
                width: "80%",
              }}
              onPress={() => addToCart()}
            >
              {loading ? (
                <ActivityIndicator size="small" color={myColors.light} />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={alreadyAdded ? faCheck : faCartPlus}
                    size={26}
                    style={{ color: myColors.light }}
                  />
                  <Text
                    style={{
                      fontFamily: "lusitanaBold",
                      fontSize: 22,
                      color: myColors.light,
                    }}
                  >
                    {alreadyAdded ? "Added to the Cart" : "Add to Cart"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: myColors.light,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.darkAlt,
    fontSize: 32,
  },
  profileBanner: {
    backgroundColor: myColors.dark,
    top: 0,
    height: 500,
    width: Dimensions.get("window").width,
    zIndex: 200,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 500,
  },

  scrollContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: Dimensions.get("window").width,
    backgroundColor: myColors.lightGreen,
    flex: 1,
    zIndex: 3000,
    justifyContent: "center",
    alignItems: "center",
  },

  product: {
    zIndex: 800,
    gap: 20,
  },
  quickContainer: {
    marginLeft: 5,
    marginTop: 10,
    marginRight: 20,
    justifyContent: "center",
    flex: 1,
    overflow: "hidden",
  },
  quickInfo: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 15,
    margin: 20,
  },
  avatar: {
    width: 150,
    aspectRatio: 1,
    borderRadius: 80,
    backgroundColor: myColors.lightGreen,
    elevation: 20,
    overflow: "hidden",
  },
  uploadBtn: {
    position: "absolute",
    top: "10%",
    right: "10%",
  },
  img: {
    width: "100%",
    height: 500,
  },
  section: {
    paddingVertical: 10,
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
  elavatedbg: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: Dimensions.get("window").height + 80,
    width: Dimensions.get("window").width,
    zIndex: 2000,
  },
  plantDes: {
    backgroundColor: myColors.lightGreen,
    elevation: 10,
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    gap: 10,
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: myColors.darkAlt,
    elevation: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 15,
    marginVertical: 10,
    alignItems: "center",
    textAlign: "center",
  },
  filterContainer: {
    position: "absolute",
    flex: 1,
    backgroundColor: myColors.transDark,
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 80,
    zIndex: 8000,
    justifyContent: "center",
    alignItems: "center",
  },
});
