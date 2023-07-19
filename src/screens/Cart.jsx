import React, { Component, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBagShopping,
  faBan,
  faCircleMinus,
  faCirclePlus,
  faFileCircleCheck,
  faHandHoldingDollar,
  faSpinner,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { CustomAlert } from "../styles/CustomAlert";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Cart = ({ navigation }) => {
  const [plants, setPlants] = useState();
  const [orderedPlants, setOrderedPlants] = useState();
  const [orderList, setOrderList] = useState();
  const [loading, setLoading] = useState({ item: null, state: false });
  const [isThisCart, setIsThisCart] = useState(true);
  const proCount = useRef(null);
  const [compLoading, setCompLoading] = useState(false);
  const [logText, setLogText] = useState("");
  const [sumLoading, setSumLoading] = useState(false);
  const [ownedPropmt, setOwnedPrompt] = useState(false);
  const [canclePrompt, setCanclePrompt] = useState(false);
  const [owned, setOwned] = useState();
  const [orderId, setOrderId] = useState();

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
    getLoading(plants);
  }, [plants]);

  useEffect(() => {
    getOrderList();
    getLoading(orderList);
  }, [orderList]);

  useEffect(() => {
    getOwned();
  }, [owned]);

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

  const getOwned = async () => {
    let userdata = await getUsers();
    const response = await supabase
      .from("owned")
      .select("*")
      .eq("user_id", userdata.id);

    if (response.error) console.log(response.error);
    else setOwned(response.data);
  };

  const getOrderList = async () => {
    let userdata = await getUsers();
    const response = await supabase
      .from("order")
      .select("*")
      .eq("user_id", userdata.id);

    if (response.error) console.log(response.error);
    else {
      setOrderList(response.data);
    }
  };

  const getLoading = (item) => {
    if (item) {
      setCompLoading(false);
    } else {
      setCompLoading(true);
    }
  };

  async function editOrder(action, cartId, price) {
    setOrderedPlants(plants?.slice());

    let item = plants.filter((a) => a.id == cartId);

    if (action == "+") {
      if (item.length > 0) {
        setLoading({ item: cartId });
        let newQty = item[0].amount + 1;
        let newPrice = newQty * price;
        const { data, error } = await supabase
          .from("cart")
          .update([{ amount: newQty, totalAmount: newPrice }])
          .eq("id", cartId);
        if (error) {
          console.log(error);
        } else {
          setLoading({ item: null });
        }
      }
    } else {
      if (item.length > 0) {
        if (item[0]?.amount > 0) {
          let newQty = item[0].amount - 1;
          if (newQty > 0) {
            setLoading({ item: cartId });
            let newPrice = newQty * price;
            const { data, error } = await supabase
              .from("cart")
              .update([{ amount: newQty, totalAmount: newPrice }])
              .eq("id", cartId);
            if (error) {
              console.log(error);
            } else {
              setLoading({ item: null });
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

  function getCartItemCount() {
    let itemCount = plants?.filter((a) => a.check == true);
    return itemCount?.length;
  }

  async function selectItem(cartId) {
    let item = plants.filter((a) => a.id == cartId);
    // console.log(item[0].check, item[0].product_id.price);

    if (item[0].check) {
      setSumLoading(true);
      const { data, error } = await supabase
        .from("cart")
        .update({ check: false })
        .eq("id", cartId);
      if (error) {
        console.log(error);
      } else {
        setSumLoading(false);
      }
    } else if (!item[0].check) {
      setSumLoading(true);
      let newQty = item[0].amount;
      let newPrice = newQty * item[0].product_id.price;
      const { data, error } = await supabase
        .from("cart")
        .update({ check: true, totalAmount: newPrice })
        .eq("id", cartId);
      if (error) {
        console.log(error);
      } else {
        setSumLoading(false);
      }
    }
  }

  function sumOrder() {
    let itemCount = plants?.filter((a) => a.check == true);
    let total = itemCount?.reduce((a, b) => a + (b.totalAmount || 0), 0);
    return total?.toFixed(2);
  }

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: "linear", property: "opacity" },
    });
  };

  const showLogText = (text) => {
    getAnimation();
    setLogText(text);
    setTimeout(() => {
      getAnimation();
      setLogText("");
    }, 4000);
  };

  async function ownedIt() {
    let userdata = await getUsers();
    let orderItem = orderList?.filter(async (a) => a.id == orderId);
    orderItem[0].plants_id.forEach(async (item) => {
      let ownedItem = owned?.filter((a) => a.product_id === item);
      if (ownedItem.length === 0) {
        const { data, error } = await supabase
          .from("owned")
          .insert([{ product_id: item, user_id: userdata.id }])
          .select();
        if (!error) {
          if (ownedPropmt) setOwnedPrompt(false);
          if (!logText) showLogText("You owned the plant(s).");
        } else console.log(error);
      } else {
        if (ownedPropmt) setOwnedPrompt(false);
        if (!logText) showLogText("You already owned it/them");
      }
    });
  }

  async function deleteIt() {
    const { error } = await supabase.from("order").delete().eq("id", orderId);
    if (!error) {
      setCanclePrompt(false);
    }
  }

  return (
    <>
      <SafeAreaView style={[styles.container]}>
        {!isThisCart && ownedPropmt ? (
          <CustomAlert
            alertType="pompt"
            title={"User Prompt"}
            isVisible={ownedPropmt ? true : false}
            onExit={() => setOwnedPrompt(false)}
            message="You want to set this product as owned?"
            onCancle={() => setOwnedPrompt(false)}
            onYes={() => ownedIt()}
          />
        ) : null}
        {!isThisCart && canclePrompt ? (
          <CustomAlert
            alertType="pompt"
            title={"User Prompt"}
            isVisible={canclePrompt ? true : false}
            onExit={() => setCanclePrompt(false)}
            message="You want to delete this order/history?"
            onCancle={() => setCanclePrompt(false)}
            onYes={() => deleteIt()}
          />
        ) : null}
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
            {isThisCart ? "CART" : "HISTORY"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              isThisCart ? setIsThisCart(false) : setIsThisCart(true)
            }
          >
            <Text
              style={{
                fontFamily: "algreyaBold",
                fontSize: 28,
                color: myColors.dark,
              }}
            >
              {isThisCart ? "Order History" : "Cart"}
            </Text>
          </TouchableOpacity>
        </View>
        {isThisCart ? (
          <View style={[{ flex: 1 }]}>
            {compLoading ? (
              <View
                style={[
                  {
                    backgroundColor: myColors.lightGreen,
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                    height: 100,
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
            ) : null}
            {isThisCart && plants?.length == 0 ? (
              <View
                style={[
                  {
                    backgroundColor: myColors.lightGreen,
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                    height: 100,
                    shadowColor: "black",
                    paddingVertical: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    fontFamily: "lusitana",
                    fontSize: 22,
                  }}
                >
                  You have no items in cart!
                </Text>
              </View>
            ) : null}
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
                              borderColor: myColors.dark,
                              borderWidth: 0.5,
                              shadowColor: "black",
                              paddingVertical: 20,
                              borderRadius: 10,
                              alignItems: "center",
                            },
                          ]}
                          key={key}
                        >
                          <BouncyCheckbox
                            size={25}
                            fillColor={myColors.dark}
                            unfillColor={myColors.light}
                            iconStyle={{ borderColor: myColors.dark }}
                            innerIconStyle={{ borderWidth: 1 }}
                            style={{ padding: 10 }}
                            isChecked={item.check ? true : false}
                            onPress={() => selectItem(item.id)}
                          />
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
                                gap: 10,
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
                                style={{
                                  fontFamily: "judsonBold",
                                  fontSize: 26,
                                }}
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
                                gap: 15,
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
        ) : (
          // ORDER HISTORY
          <View style={[{ flex: 1 }]}>
            {compLoading ? (
              <View
                style={[
                  {
                    backgroundColor: myColors.lightGreen,
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                    height: 100,
                    paddingVertical: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <ActivityIndicator size={"large"} color={myColors.light} />
              </View>
            ) : null}

            {logText ? (
              <View
                style={[
                  {
                    backgroundColor: myColors.light,
                    width: "100%",
                    padding: 5,
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: myColors.dark,
                    borderWidth: 0.5,
                    elevation: 10,
                  },
                ]}
              >
                <Text>{logText}</Text>
              </View>
            ) : null}

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
                {orderList
                  ? orderList.map((item, key) => {
                      return (
                        <View
                          style={[
                            {
                              backgroundColor: myColors.lightGreen,
                              width: "100%",
                              paddingHorizontal: 10,
                              flexDirection: "column",
                              shadowColor: "black",
                              borderRadius: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingLeft: 30,
                              paddingVertical: 20,
                              gap: 15,
                              borderColor: myColors.dark,
                              borderWidth: 0.5,
                            },
                          ]}
                          key={key}
                        >
                          <Text
                            style={{
                              padding: 10,
                              fontFamily: "judsonBold",
                              fontSize: 20,
                              borderRadius: 10,
                              backgroundColor: myColors.light,
                              elevation: 10,
                              alignItems: "center",
                              borderColor: myColors.dark,
                              borderWidth: 0.5,
                              opacity: 0.8,
                              flexWrap: "wrap",
                            }}
                          >
                            Id: {item.id}
                          </Text>
                          <View
                            style={[
                              {
                                borderRadius: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 10,
                                gap: 15,
                                justifyContent: "space-between",
                              },
                            ]}
                          >
                            <Text
                              style={{
                                fontFamily: "judsonBold",
                                fontSize: 26,
                                textDecorationLine: "underline",
                              }}
                            >
                              {key + 1}
                            </Text>
                            <Text
                              style={{
                                justifyContent: "center",
                                flexWrap: "wrap",
                                fontFamily: "judsonBold",
                                fontSize: 20,
                                textAlign: "center",
                                width: 200,
                              }}
                            >
                              {item.details}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "judsonBold",
                                fontSize: 26,
                                paddingRight: 20,
                              }}
                            >
                              $ {item.totalAmount}
                            </Text>
                          </View>
                          <View
                            style={[
                              {
                                flex: 1,
                                justifyContent: "space-between",
                                alignItems: "center",
                              },
                            ]}
                          >
                            <View
                              style={{
                                width: 200,
                                height: 40,
                                backgroundColor: myColors.lightGreen,
                                elevation: 10,
                                borderRadius: 10,
                                justifyContent: "space-around",
                                alignItems: "center",
                                flexDirection: "row",
                                borderColor: myColors.dark,
                                borderWidth: 0.5,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => showLogText("Cash On Delivery")}
                              >
                                <FontAwesomeIcon
                                  size={24}
                                  icon={faHandHoldingDollar}
                                  style={{ color: myColors.darkAlt }}
                                />
                              </TouchableOpacity>

                              {item.status === "processing" ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    showLogText(
                                      `Your order status:  ${item.status}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon
                                    size={24}
                                    icon={faSpinner}
                                    style={{ color: myColors.darkAlt }}
                                  />
                                </TouchableOpacity>
                              ) : null}
                              {item.status === "delivering" ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    showLogText(
                                      `Your order status:  ${item.status}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon
                                    size={24}
                                    icon={faTruckRampBox}
                                    style={{ color: myColors.darkAlt }}
                                  />
                                </TouchableOpacity>
                              ) : null}

                              {item.status === "paid" ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    setOrderId(item.id);
                                    setOwnedPrompt(true);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    size={24}
                                    icon={faFileCircleCheck}
                                    style={{ color: myColors.darkAlt }}
                                  />
                                </TouchableOpacity>
                              ) : null}
                              <TouchableOpacity
                                onPress={() => {
                                  setOrderId(item.id);
                                  setCanclePrompt(true);
                                }}
                              >
                                <FontAwesomeIcon
                                  size={24}
                                  icon={faBan}
                                  style={{ color: myColors.errorText }}
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
        )}
        {isThisCart ? (
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
                Selected Items: {getCartItemCount()}
              </Text>
              <Text
                style={{
                  fontFamily: "judsonBold",
                  fontSize: 20,
                  color: myColors.lightAlt,
                }}
              >
                Total Price:
              </Text>
              {sumLoading ? (
                <ActivityIndicator
                  size={"small"}
                  color={myColors.light}
                ></ActivityIndicator>
              ) : (
                <Text
                  style={{
                    fontFamily: "judsonBold",
                    fontSize: 20,
                    color: myColors.lightAlt,
                  }}
                >
                  ${sumOrder()}
                </Text>
              )}
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
              onPress={() =>
                navigation.navigate("order", { total: sumOrder() })
              }
            >
              <FontAwesomeIcon
                size={24}
                icon={faBagShopping}
                style={{ color: myColors.dark }}
              />
              <Text
                style={{
                  fontFamily: "judsonBold",
                  fontSize: 26,
                  color: myColors.dark,
                }}
              >
                Checkout!
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
