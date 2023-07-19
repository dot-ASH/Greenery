import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { myColors } from "../styles/Colors";
import { Text } from "react-native";
import { supabase } from "../data/Supabase";
import { Dropdown } from "react-native-element-dropdown";
import { StatusBar } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { CustomAlert } from "../styles/CustomAlert";

const data = [{ label: "Cash On Delivery", value: "cod" }];

export const Order = ({ navigation, route }) => {
  const [userData, setUserData] = useState();
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState([]);
  const [cartItems, setCartItems] = useState();
  const [showAlert, setShowAlert] = useState(false);

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

  const getCartItems = async () => {
    const response = await supabase
      .from("cart")
      .select(
        "amount, id, totalAmount, check ,product_id(id, plant_name ,image_url, price, score)"
      )
      .eq("user_id", userData?.id)
      .eq("check", true);

    if (response.error) console.log(response.error);
    else setCartItems(response?.data);
  };

  useEffect(() => {
    getUsers();
    getCartItems();
  }, [cartItems]);

  const orderNow = async (amount) => {
    if (!dropdown) {
      setShowAlert(true);
    } else {
      setShowAlert(true);
      let description = "";
      let plantsId=[];

      cartItems?.forEach(async(element) => {
        description =
          description + `${element.amount} ${element.product_id.plant_name}, `;
          plantsId.push(element.product_id.id)
          let totalScore = element.product_id.score + 1;
          const { data, error } = await supabase
          .from("plant")
          .update({ score: totalScore })
          .eq("id", element.product_id.id);
        if (error) console.log(error);
      });
      console.log(plantsId)
      const { data, error } = await supabase
        .from("order")
        .insert([
          {
            user_id: userData?.id,
            details: description,
            totalAmount: amount,
            status: "processing",
            pay_method: dropdown,
            plants_id: plantsId
          },
        ])
        .select();
      if (!error) {
        setShowAlert(false);
        cartItems?.forEach(async (element) => {
          const { error } = await supabase
            .from("cart")
            .delete()
            .eq("id", element.id);
        });
        if (!error) {
          setShowAlert(false);
          changeScreen("Cart");
        }
      } else console.log(error);
    }
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
      <SafeAreaView style={styles.container}>
        {showAlert && !dropdown ? (
          <CustomAlert
            alertType="error"
            title={"Alert!!"}
            isVisible={showAlert ? true : false}
            onExit={() => setShowAlert(false)}
            message="You haven't selected payment method!"
          />
        ) : null}

        {showAlert && dropdown ? (
          <CustomAlert
            alertType="success"
            title={"Alert!!"}
            isVisible={showAlert ? true : false}
            onExit={() => setShowAlert(false)}
            message="Your order is being wrapped up......"
          />
        ) : null}

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
            />
          </View>
        </View>
        {/* Product details  */}
        <View style={styles.proDetails}>
          <View
            style={{
              width: "100%",
              padding: 15,
              justifyContent: "space-between",
              height: "100%",
            }}
          >
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
                  textAlign: "center",
                }}
              >
                Billing
              </Text>
            </View>

            {/* Starts Here */}
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                padding: 15,
                paddingVertical: 30,
                gap: 10,
              }}
            >
              <ScrollView>
                {cartItems &&
                  cartItems.map((item) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                        key={item.id}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontFamily: "lusitana", fontSize: 18 }}
                          >
                            {item?.amount}x
                          </Text>
                          <Text
                            style={{ fontFamily: "lusitanaBold", fontSize: 18 }}
                          >
                            {item?.product_id.plant_name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: myColors.darkAlt,
                            fontFamily: "judsonItalic",
                            fontSize: 23,
                            textAlign: "center",
                          }}
                        >
                          ${item?.totalAmount?.toFixed(2)}
                        </Text>
                      </View>
                    );
                  })}
              </ScrollView>
            </View>

            <View
              style={{
                width: "100%",
                borderStyle: "dashed",
                borderTopColor: myColors.dark,
                borderTopWidth: 1,
                paddingTop: 15,
                justifyContent: "space-between",
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "lusitanaBold", fontSize: 18 }}>
                Total:
              </Text>
              <Text
                style={{
                  color: myColors.darkAlt,
                  fontFamily: "judsonItalic",
                  fontSize: 23,
                  textAlign: "center",
                }}
              >
                $ {route.params.total}
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
            onPress={() => orderNow(route.params.total)}
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
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 60,
    gap: 10,
    backgroundColor: myColors.lightGreen,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.darkAlt,
    fontSize: 34,
    margin: 20,
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
    height: 500,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: myColors.light,
  },
});
