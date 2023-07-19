import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
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
import { supabase } from "../data/Supabase";

export const DrawerStack = ({ navigation, route }) => {
  const [activeScreen, setActiveScreen] = useState("");
  const [userId, setUserId] = useState();
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [cartCount, setCartCount] = useState();
  const [disabledButton, setDisabledButton] = useState("home");

  useEffect(() => {
    if (route.params.active) {
      setActiveScreen("");
    }
  });
  const changeScreen = (screen) => {
    route.params.active = "";
    navigation.navigate(screen);
    setActiveScreen(screen);
  };

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
  }, []);

  const checkCart = async () => {
    const response = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId?.id);
    if (!response.error) {
      if (response.data.length > 0) {
        setAlreadyAdded(true);
        setCartCount(response.data.length);
      } else {
        setAlreadyAdded(false);
      }
    }
  };

  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      <Stack.Navigator
        initialRouteName={"Home"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Saved" component={Saved} />
        <Stack.Screen name="Profile" component={Profile} />
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
            disabled={activeScreen == "Home" ? true : false}
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
            disabled={activeScreen == "Search" ? true : false}
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
            disabled={activeScreen == "Cart" ? true : false}
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
            disabled={activeScreen == "Saved" ? true : false}
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
            disabled={activeScreen == "Profile" ? true : false}
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
    width: Dimensions.get("window").width - 20,
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
    elevation: 10,
  },
});
