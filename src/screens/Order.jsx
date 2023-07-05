import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { myColors } from "../styles/Colors";
import { Text } from "react-native";
import { supabase } from "../data/Supabase";
import { Dropdown } from "react-native-element-dropdown";
import { StatusBar } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";

const data = [{ label: "Cash On Delivery", value: "cod" }];

export const Order = ({ navigation, route }) => {
  const [userData, setUserData] = useState();
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState([]);

  const _renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
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
      setUserData(response?.data[0]);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitle}>ORDER DETAILS</Text>
        {/*Payment method  */}
        <View style={{ gap: 15 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
            
            <Text
              style={[
                styles.text,
                {
                  textDecorationLine: "underline",
                  fontFamily: "judsonItalic",
                  fontSize: 18,
                },
              ]}
            >
              Owner: 
            </Text>
            <Text style={styles.text}>{userData?.full_name}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            
            <Text
              style={[
                styles.text,
                {
                  textDecorationLine: "underline",
                  fontFamily: "judsonItalic",
                  fontSize: 18,
                },
              ]}
            >
              Delivering to:
            </Text>
            <Text style={styles.text}>{userData?.address}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={[
                styles.text,
                {
                  textDecorationLine: "underline",
                  fontFamily: "judsonItalic",
                  fontSize: 18,
                },
              ]}
            >
              Payment Method:
            </Text>
            <Dropdown
              style={[styles.dropdown, styles.roundedBorder]}
              containerStyle={styles.shadow}
              data={data}
              labelField="label"
              valueField="value"
              label="Dropdown"
              placeholder="Select item"
              value={dropdown}
              onChange={(item) => {
                setDropdown(item.value);
                console.log("selected", item);
              }}
              renderItem={(item) => _renderItem(item)}
              textError="Error"
              selectedStyle={styles.lightBg}
              activeColor={myColors.light}
              fontFamily="lusitanaBold"
              onPress={() => {
                console.log("jeihisaho");
              }}
            />
          </View>
        </View>
        {/* Product details  */}
        <View style={styles.proDetails}>
          <View style={{ width:"100%", padding: 15 }}>
            <View
              style={{
                width: "100%",
                borderStyle: "dashed",
                borderBottomColor: myColors.dark,
                borderBottomWidth: 1,
                paddingBottom: 15,
              }}
            >
              <Text
                style={{
                  color: myColors.darkAlt,
                  fontFamily: "judsonItalic",
                  fontSize: 23,
                  textAlign: "center"
                }}
              >
                Billing
              </Text>
            </View>
          </View>
          <View style={{ width:"100%", padding: 15 , flex: 1}}>
            <View
              style={{
                width: "100%",
                borderStyle: "dashed",
                borderBottomColor: myColors.dark,
                borderBottomWidth: 1,
                paddingBottom: 15,
              }}
            >
              <Text
                style={{
                  color: myColors.darkAlt,
                  fontFamily: "judsonItalic",
                  fontSize: 23,
                  textAlign: "center"
                }}
              >
                Total
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: myColors.dark,
              height: 60,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 20,
            }}
            onPress={() => navigation.navigate("order", { total: sumOrder() })}
          >
            <FontAwesomeIcon
              size={24}
              icon={faCheckDouble}
              style={{ color: myColors.light }}
            />
            <Text
              style={{
                fontFamily: "judsonBold",
                fontSize: 26,
                color: myColors.light,
              }}
            >
              Checkout!
            </Text>
          </TouchableOpacity>
        </View>
        <Text>{userData?.full_name}</Text>
        <Text>{route.params.total}</Text>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 80,
    gap: 10,
    backgroundColor: myColors.lightGreen,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.darkAlt,
    fontSize: 34,
    margin: 15,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
  },
  dropdown: {
    flex: 1,
    backgroundColor: myColors.light,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    padding: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 5,
  },
  roundedBorder: {
    borderRadius: 10,
  },
  textItem: {
    fontSize: 16,
    fontFamily: "lusitanaBold",
  },
  text: {
    fontSize: 16,
    fontFamily: "lusitanaBold",
    color: myColors.darkAlt,
  },
  shadow: {
    marginTop: -3,
    backgroundColor: myColors.light,
    paddingHorizontal: 10,

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 2,
  },
  lightBg: {
    backgroundColor: myColors.light,
  },
  proDetails: {
    marginTop: 20,
    borderColor: myColors.dark,
    borderWidth: 1,
    borderRadius: 10,
    height: 550,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: myColors.light,
  },
});
