import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
  Image,
  Modal,
  Switch,
  ScrollView,
} from "react-native";
import { myColors } from "../styles/Colors";
import { supabase } from "../data/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAngleRight,
  faBell,
  faCartPlus,
  faDollarSign,
  faKey,
  faMap,
  faNoteSticky,
  faRightFromBracket,
  faUpload,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { CustomAlert } from "../styles/CustomAlert";
import GestureRecognizer from "react-native-swipe-gestures";
import { FILE_NAME } from "@env";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Product = ({ route }) => {
  const [plant, setPlant] = useState({});
  const [margin, setMargin] = useState(-20);
  const scrollViewRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  const [elavatedBg, setElavatedBg] = useState(false);

  async function getPlant() {
    const response = await supabase
      .from("plant")
      .select(`*`)
      .eq("id", route.params.id);

    if (response.error) {
      console.log(response.error);
    } else {

      setPlant(response?.data[0]);
    }
  }

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 50,
      create: { type: "easeIn", property: "opacity" },
    });
  };

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    setScrollY(offset);
    if (scrollY > 200) {
      setElavatedBg(true);
      setMargin(-330);
    } else {
      setElavatedBg(false);
      setMargin(-20);
    }
  };

  useEffect(() => {
    getPlant();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />

      <SafeAreaView style={styles.container}>
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
            <View style={styles.plantDes}>
              <Text style={{color: "white", fontFamily: "lusitanaBold", fontSize: 18}}>{plant && plant.plant_description}</Text>
            </View>
            <View
              style={[styles.quickInfo]}
            >
              <View
                style={{
                  padding: 15,
                  width: 75,
                  borderRadius: 10,
                  backgroundColor: myColors.lightAlt,
                  flexDirection: "column",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 10,
                }}
              >
                <FontAwesomeIcon
                  size={20}
                  icon={faDollarSign}
                  style={{ color: myColors.dark }}
                />
                <Text
                  style={{
                    color: myColors.dark,
                    fontFamily: "lusitanaBold",
                    fontSize: 20,
                  }}
                >
                  {plant && plant.price}
                </Text>
              </View>
              <View
                style={{
                  padding: 15,
                  width: 75,
                  borderRadius: 10,
                  backgroundColor: myColors.lightAlt,
                  flexDirection: "column",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 10,
                }}
              >
                <FontAwesomeIcon
                  size={20}
                  icon={faDollarSign}
                  style={{ color: myColors.dark }}
                />
                <Text
                  style={{
                    color: myColors.dark,
                    fontFamily: "lusitanaBold",
                    fontSize: 20,
                  }}
                >
                  {plant && plant.price}
                </Text>
              </View>

              <View
                style={{
                  padding: 15,
                  width: 75,
                  borderRadius: 10,
                  backgroundColor: myColors.lightAlt,
                  flexDirection: "column",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 10,
                }}
              >
                <FontAwesomeIcon
                  size={20}
                  icon={faDollarSign}
                  style={{ color: myColors.dark }}
                />
                <Text
                  style={{
                    color: myColors.dark,
                    fontFamily: "lusitanaBold",
                    fontSize: 20,
                  }}
                >
                  {plant && plant.price}
                </Text>
              </View>
              <View
                style={{
                  padding: 15,
                  width: 75,
                  borderRadius: 10,
                  backgroundColor: myColors.lightAlt,
                  flexDirection: "column",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 10,
                }}
              >
                <FontAwesomeIcon
                  size={20}
                  icon={faDollarSign}
                  style={{ color: myColors.dark }}
                />
                <Text
                  style={{
                    color: myColors.dark,
                    fontFamily: "lusitanaBold",
                    fontSize: 20,
                  }}
                >
                  {plant && plant.price}
                </Text>
              </View>
            
            </View>

            <View style={[styles.quickInfo, {}]}>
              <View
                style={{
                  padding: 15,
                  width: 75,
                  borderRadius: 10,
                  backgroundColor: myColors.lightAlt,
                  flexDirection: "column",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 10,
                }}
              >
                <FontAwesomeIcon
                  size={20}
                  icon={faDollarSign}
                  style={{ color: myColors.dark }}
                />
                <Text
                  style={{
                    color: myColors.dark,
                    fontFamily: "lusitanaBold",
                    fontSize: 20,
                  }}
                >
                  {plant && plant.price}
                </Text>
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
              borderWidth: 1
            }}
          >
            <TouchableOpacity>
              <FontAwesomeIcon
                size={26}
                icon={faHeart}
                style={{ marginLeft: 20, color: myColors.dark }}
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
            >
              <FontAwesomeIcon
                icon={faCartPlus}
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
                Add to Cart
              </Text>
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
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  product: {
    zIndex: 800,
    gap: 20,
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
  plantDes:{
    backgroundColor: myColors.lightGreen,
    elevation: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  }
});
