import React, { useEffect, useState } from "react";
import {
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
  ScrollView
} from "react-native";
import { myColors } from "../styles/Colors";
import { supabase } from "../data/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAngleRight,
  faBell,
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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Product = ({ route }) => {
  const [plant, setPlant] = useState({});

  async function getPlant() {
    const response = await supabase
      .from("plant")
      .select(`*`)
      .eq("id", route.params.id);

    if (response.error) {
      console.log(response.error);
    } else {
      // console.log(response?.data);
      setPlant(response?.data[0]);
    }
  }

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
        {/* {elavatedBg ? <View style={styles.elavatedbg}></View> : null}
        {notiModule ? notifyModule() : null} */}

        <View style={styles.profileBanner}>
          <Image
            source={{ uri: plant ? plant.image_url : null }}
            style={styles.img}
          ></Image>
        </View>
        <ScrollView style={styles.product}>
          <View style={{height: "100%", width:"100%", backgroundColor: myColors.light, borderColor:"black"}}></View>
          {/* <View style={styles.settingSection}>
            {settings.map((item, key) => {
              if (item.id <= 2) {
                return (
                  <View
                    style={
                      item.id !== 2
                        ? [styles.settingItems, styles.miDivider]
                        : [styles.settingItems]
                    }
                    key={key}
                  >
                    {item.icon}
                    <TouchableOpacity
                      onPress={item.onpress}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "80%",
                      }}
                    >
                      <Text
                        style={{
                          color: myColors.darkAlt,
                          fontFamily: "lusitanaBold",
                          fontSize: 16,
                        }}
                      >
                        {item.title}
                      </Text>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        style={{
                          color: myColors.dark,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          </View>

          <View style={styles.settingSection}>
            {settings.map((item, key) => {
              if (item.id >= 3 && item.id <= 5) {
                return (
                  <View
                    style={
                      item.id !== 5
                        ? [styles.settingItems, styles.miDivider]
                        : [styles.settingItems]
                    }
                    key={key}
                  >
                    {item.icon}
                    <TouchableOpacity
                      onPress={item.onpress}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "80%",
                      }}
                    >
                      <Text
                        style={{
                          color: myColors.darkAlt,
                          fontFamily: "lusitanaBold",
                          fontSize: 16,
                        }}
                      >
                        {item.title}
                      </Text>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        style={{
                          color: myColors.dark,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          </View>

          <View style={styles.settingSection}>
            {settings.map((item, key) => {
              if (item.id >= 6) {
                return (
                  <View style={[styles.settingItems]} key={key}>
                    {item.icon}
                    <TouchableOpacity
                      onPress={item.onpress}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "80%",
                      }}
                    >
                      <Text
                        style={{
                          color: myColors.errorText,
                          fontFamily: "lusitanaBold",
                          fontSize: 16,
                        }}
                      >
                        {item.title}
                      </Text>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        style={{
                          color: myColors.errorText,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          </View>*/}
        </ScrollView>
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
    paddingBottom: 80,
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
    height: 350,
    width: Dimensions.get("window").width,
    zIndex: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 80
  },
  product: {
    flex: 1,
    marginTop: -10,
    zIndex: 800,
    width: Dimensions.get("window").width,
    borderRadius: 30,
    gap: 20,
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
    height:500
  },
});
