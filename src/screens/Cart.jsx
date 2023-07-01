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
} from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheckDouble,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
import { addons } from "react-native";

export const Cart = () => {
  const [plants, setPlants] = useState();
  const [orderedPlants, setOrderedPlants] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [updateValue, setUpdateValue] = useState(false);
  const [elavatedBg, setElavatedBg] = useState(false);
  const [loading, setLoading] = useState({item: null,state:false});
  const proCount = useRef(null);
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

  useEffect(() => {
    getPlants();
  }, [plants]);

  const getPlants = async () => {
    let userdata = await getUsers();
    const response = await supabase
      .from("cart")
      .select(
        "amount, id, totalAmount, check ,product_id(plant_name ,image_url, price)"
      )
      .eq("user_id", userdata.id);

    if (response.error) console.log(response.error);
    else setPlants(response.data);
  };

  async function editOrder(action, cartId, price) {
    setOrderedPlants(plants?.slice());

    let item = plants.filter((a) => a.id == cartId);

    if (action == "+") {
      if (item.length > 0) {
        setLoading({item: cartId});
        let newQty = item[0].amount + 1;
        let newPrice = newQty * price;
        const { data, error } = await supabase
          .from("cart")
          .update([{ amount: newQty, totalAmount: newPrice }])
          .eq("id", cartId);
        if (error) {
          console.log(error);
        } else {
          setLoading({item: null});
        }
      }
    } else {
      if (item.length > 0) {
        if (item[0]?.amount > 0) {
          let newQty = item[0].amount - 1;
          if (newQty > 0) {
            setLoading({item: cartId});
            let newPrice = newQty * price;
            const { data, error } = await supabase
              .from("cart")
              .update([{ amount: newQty, totalAmount: newPrice }])
              .eq("id", cartId);
            if (error) {
              console.log(error);
            } else {
              setLoading({item: null});
            }
          } else {
            const { error } = await supabase
              .from("cart")
              .delete()
              .eq("id", cartId);
          }
        }
      }
    }
  }

  plants?.sort((a, b) => b.id - a.id);

  function getCartQty(cartId) {
    let orderItem = plants?.filter((a) => a.id == cartId);
    if (orderItem.length > 0) {
      return orderItem[0].amount;
    }
    return 1;
  }

  return (
    <>
      <SafeAreaView style={[styles.container, styles.showBorder]}>
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
            }}
          >
            {"CART"}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontFamily: "algreyaBold",
                fontSize: 28,
                color: myColors.dark,
              }}
            >
              {"Order History"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[{ flex: 1 }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                height: "100%",
                flex: 1,
                width: "100%",
                paddingVertical: 30,
                gap: 20,
              }}
            >
              {plants
                ? plants.map((item, key) => {
                    return (
                      <View
                        style={[
                          {
                            backgroundColor: myColors.lightGreen,
                            width: "100%",
                            padding: 10,
                            flexDirection: "row",

                            shadowColor: "black",
                            paddingVertical: 20,
                            borderRadius: 10,
                            alignItems: "center",
                          },
                        ]}
                        key={key}
                      >
                        <CheckBox
                          checked={item.check ? true : false}
                          style={{ width: 20, color: myColors.dark }}
                        ></CheckBox>
                        <View
                          style={[
                            {
                              flex: 0.6,
                              aspectRatio: 1,
                              borderRadius: 10,
                              overflow: "hidden",
                            },
                          ]}
                        >
                          <Image
                            source={{ uri: item.product_id.image_url }}
                            style={{ height: "100%", width: "100%" }}
                            contentFit="cover"
                            transition={1000}
                          />
                        </View>
                        <View
                          style={[
                            {
                              flex: 1,
                              justifyContent: "center",
                              paddingHorizontal: 10,
                            },
                          ]}
                        >
                          <Text
                            style={{ fontFamily: "judsonBold", fontSize: 20 }}
                          >
                            {item.product_id.plant_name}
                          </Text>
                        </View>
                        <View
                          style={[
                            {
                              flex: 1,
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingHorizontal: 20,
                            },
                          ]}
                        >
                          {loading.item === item.id ? (
                            <ActivityIndicator
                              size="small"
                              color={myColors.dark}
                            />
                          ) : (
                            <Text
                              style={{ fontFamily: "judsonBold", fontSize: 26 }}
                            >
                              ${" "}
                              {item.totalAmount
                                ? item.totalAmount
                                : item.product_id.price}
                            </Text>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                editOrder("-", item.id, item.product_id.price)
                              }
                            >
                              <FontAwesomeIcon
                                size={24}
                                icon={faCircleMinus}
                                style={{ color: myColors.dark }}
                              />
                            </TouchableOpacity>
                            {loading.item === item.id ? (
                              <ActivityIndicator
                                size="small"
                                color={myColors.dark}
                              />
                            ) : (
                              <Text
                                ref={proCount}
                                style={{
                                  fontSize: 26,
                                  fontFamily: "judsonBold",
                                }}
                              >
                                {getCartQty(item.id)}
                              </Text>
                            )}
                            <TouchableOpacity
                              onPress={() =>
                                editOrder("+", item.id, item.product_id.price)
                              }
                            >
                              <FontAwesomeIcon
                                size={24}
                                icon={faCirclePlus}
                                style={{ color: myColors.dark }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })
                : null}
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            alignItems: "center",
            height: 140,
            borderRadius: 15,
            backgroundColor: myColors.dark,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: 60,
              borderRadius: 10,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "judsonBold",
                fontSize: 20,
                color: myColors.lightAlt,
              }}
            >
              Selected Items: 1
            </Text>
            <Text
              style={{
                fontFamily: "judsonBold",
                fontSize: 20,
                color: myColors.lightAlt,
              }}
            >
              Total Price ${1600}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: "90%",
              backgroundColor: myColors.light,
              height: 60,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 20,
            }}
          >
            <FontAwesomeIcon
              size={24}
              icon={faCheckDouble}
              style={{ color: myColors.dark }}
            />
            <Text
              style={{
                fontFamily: "judsonBold",
                fontSize: 26,
                color: myColors.dark,
              }}
            >
              Order Now!
            </Text>
          </TouchableOpacity>
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
    padding: 80,
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
});
