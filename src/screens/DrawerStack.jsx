import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./Home";
import { myColors } from "../styles/Colors";
import { Profile } from "./Profile";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCartShopping,
  faHeart,
  faHouse,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Saved } from "./Saved";
import { Cart } from "./Cart";
import { Search } from "./Search";

export const DrawerStack = ({ navigation, route }) => {
  const [activeScreen, setActiveScreen] = useState("");

  useEffect(() => {
    if (route.params.active) {
      setActiveScreen("");
    }
  });

  const changeScreen = (screen) => {
    route.params.active = "";
    navigation.push(screen);
    setActiveScreen(screen);
  };

  const Stack = createNativeStackNavigator();
  return (
    <>
      <Stack.Navigator
        initialRouteName={"Home"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Saved"
          component={Saved}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <TouchableOpacity
            onPress={() => changeScreen("Home")}
            style={
              activeScreen === "Home" || route.params.active === "Home"
                ? styles.activeSecondaryBtn
                : styles.secondaryBtn
            }
          >
            <FontAwesomeIcon
              size={26}
              icon={faHouse}
              style={
                activeScreen === "Home" || route.params.active === "Home"
                  ? styles.activeSecondaryBtnText
                  : styles.secondaryBtnText
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeScreen("Search")}
            style={
              activeScreen === "Search"
                ? styles.activeSecondaryBtn
                : styles.secondaryBtn
            }
          >
            <FontAwesomeIcon
              size={26}
              icon={faSearch}
              style={
                activeScreen === "Search"
                  ? styles.activeSecondaryBtnText
                  : styles.secondaryBtnText
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeScreen("Cart")}
            style={
              activeScreen === "Cart"
                ? styles.activeSecondaryBtn
                : styles.secondaryBtn
            }
          >
            <FontAwesomeIcon
              size={26}
              icon={faCartShopping}
              style={
                activeScreen === "Cart"
                  ? styles.activeSecondaryBtnText
                  : styles.secondaryBtnText
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeScreen("Saved")}
            style={
              activeScreen === "Saved"
                ? styles.activeSecondaryBtn
                : styles.secondaryBtn
            }
          >
            <FontAwesomeIcon
              size={26}
              icon={faHeart}
              style={
                activeScreen === "Saved"
                  ? styles.activeSecondaryBtnText
                  : styles.secondaryBtnText
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeScreen("Profile")}
            style={
              route.params.active === "Profile" || activeScreen === "Profile"
                ? styles.activeSecondaryBtn
                : styles.secondaryBtn
            }
          >
            <FontAwesomeIcon
              size={28}
              icon={faUser}
              style={
                route.params.active === "Profile" || activeScreen === "Profile"
                  ? styles.activeSecondaryBtnText
                  : styles.secondaryBtnText
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myColors.light,
  },
  navbar: {
    alignSelf: "center",
    position: "absolute",
    width: Dimensions.get("window").width-20,
    bottom: 0,
    marginBottom: 5,
    height: 65,
    backgroundColor: myColors.darkAlt,
    zIndex: 2000,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: myColors.light,
    shadowColor: myColors.darkAlt,
    elevation: 10,
  },

  navContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  secondaryBtn: {
    alignSelf: "center",
    width: 50,
    marginVertical: 30,
    padding: 10,
    borderRadius: 20,
    zIndex: 2000,
  },
  activeSecondaryBtn: {
    alignSelf: "center",
    width: 50,
    marginVertical: 30,
    padding: 10,
    borderRadius: 20,
    zIndex: 2000,
    backgroundColor: myColors.light,
  },

  secondaryBtnText: {
    alignSelf: "center",
    color: myColors.light,
  },

  activeSecondaryBtnText: {
    alignSelf: "center",
    color: myColors.dark,
  },
});
