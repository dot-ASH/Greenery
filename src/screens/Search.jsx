import React, { useState, useEffect } from "react";
import {
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Search = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [searchedText, setSearchText] = useState("");
  const [searchFound, setSearchFound] = useState(false);
  const [plants, setPlants] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [filterScreen, setFilterScreen] = useState(false);
  const [filter, setFilter] = useState("regular");
  const [viewedPlants, setViewedPlants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlants = async () => {
    const response = await supabase.from("plant").select(`*`);
    if (response.error) {
      console.log(response.error);
    } else {
      setPlants(response?.data);
    }
  };

  useEffect(() => {
    fetchPlants();
    getViewedPlant();
  }, [plants]);

  useEffect(() => {}, [viewedPlants]);

  const handleSearchData = (value) => {
    setSearchText(value);
    let plantItems = plants?.slice();

    if (filter === "regular") {
      const newSearch = plantItems?.filter((value) => {
        return value.plant_name
          .toLowerCase()
          .includes(searchedText.toLowerCase());
      });
      if (newSearch.length > 0) {
        setSearchFound(true);
        setSearchedData(newSearch);
      } else setSearchFound(false);
    } else if (filter === "case") {
      const newSearch = plantItems?.filter((value) => {
        return value.plant_name.toLowerCase() == searchedText.toLowerCase();
      });
      console.log(newSearch);
      if (newSearch.length > 0) {
        setSearchFound(true);
        setSearchedData(newSearch);
      } else setSearchFound(false);
    } else if (filter === "indoor") {
      const newSearch = plantItems?.filter((value) => {
        if (
          value.plant_type == "Indoor" ||
          value.plant_type == "Indoor/Outdoor"
        ) {
          return value.plant_name.includes(searchedText);
        }
      });
      if (newSearch.length > 0) {
        setSearchFound(true);
        setSearchedData(newSearch);
      } else setSearchFound(false);
    } else if (filter === "outdoor") {
      const newSearch = plantItems?.filter((value) => {
        if (
          value.plant_type == "Outdoor" ||
          value.plant_type == "Indoor/Outdoor"
        ) {
          return value.plant_name.includes(searchedText);
        }
      });
      if (newSearch.length > 0) {
        setSearchFound(true);
        setSearchedData(newSearch);
      } else setSearchFound(false);
    }
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
      return response?.data[0];
    }
  }

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: "easeIn", property: "opacity" },
    });
  };

  async function addView(newId) {
    setLoading(true);
    navigateProduct(newId);
    let user = await getUsers();
    let viewedIds = await getView();
    if (viewedIds == null) {
      const respose = await supabase
        .from("users")
        .update([{ last_view: [newId] }])
        .eq("id", user?.id);
      if (respose.error) console.log(respose.error);
      else {
        setLoading(false);
        // navigateProduct(newId);
      }
    } else {
      let index = viewedIds?.indexOf(newId);
      if (index > -1) {
        viewedIds.splice(index, 1);
        viewedIds.unshift(newId);
      } else {
        viewedIds.unshift(newId);
      }
      const respose = await supabase
        .from("users")
        .update([{ last_view: viewedIds.slice(0, 3) }])
        .eq("id", user?.id);
      if (respose.error) console.log(respose.error);
      else {
        setLoading(false);
        // navigateProduct(newId);
      }
    }
  }

  async function getView() {
    let user = await getUsers();
    const respose = await supabase
      .from("users")
      .select("last_view")
      .eq("id", user?.id);
    return respose?.data[0].last_view;
  }

  async function getViewedPlant() {
    if (plants) {
      let viewedIds = await getView();
      let plantData = [];
      viewedIds?.forEach((element) => {
        let plantsItem = plants.filter((a) => a.id == element);
        plantData.push(plantsItem[0]);
      });
      setViewedPlants(plantData);
    }
  }

  const navigateProduct = (id) => {
    navigation.navigate("product", {
      id: id,
    });
  };

  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />
      {filterScreen ? (
        <View style={styles.filterContainer}>
          <View
            style={{
              width: 300,
              backgroundColor: myColors.light,
              borderRadius: 15,
              alignItems: "center",
              padding: 20,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 0, right: 10 }}
              onPress={() => {
                getAnimation();
                setFilterScreen(false);
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                style={{ margin: 30 }}
                size={22}
                color={myColors.dark}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("case")}
              style={{
                padding: 20,
                alignSelf: "center",
                backgroundColor: filter === "case" ? myColors.dark : null,
                borderRadius: 10,
                marginTop: 50,
              }}
            >
              <Text
                style={[
                  styles.checkText,
                  { color: filter === "case" ? myColors.light : null },
                ]}
              >
                Case Sensitive
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("outdoor")}
              style={{
                padding: 20,
                alignSelf: "center",
                backgroundColor: filter === "outdoor" ? myColors.dark : null,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  styles.checkText,
                  { color: filter === "outdoor" ? myColors.light : null },
                ]}
              >
                Outdoor Only
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("indoor")}
              style={{
                padding: 20,
                alignSelf: "center",
                backgroundColor: filter === "indoor" ? myColors.dark : null,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  styles.checkText,
                  { color: filter === "indoor" ? myColors.light : null },
                ]}
              >
                Indoor Only
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {loading ? (
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
        {/* <Map /> */}
        <View style={styles.header}>
          <View
            style={{
              alignItems: "center",
              gap: 10,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faSearch} color={myColors.light} size={22} />
            <Text style={styles.pageTitle}>Search for plants</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 15,
            }}
          >
            <TextInput
              style={styles.textArea}
              placeholderTextColor={myColors.dark}
              placeholder="Search anything..."
              onChangeText={(value) => handleSearchData(value)}
            ></TextInput>
            <TouchableOpacity
              style={{
                backgroundColor: myColors.light,
                padding: 12,
                borderRadius: 15,
              }}
              onPress={() => {
                getAnimation();
                setFilterScreen(true);
              }}
            >
              <FontAwesomeIcon
                icon={faFilter}
                color={myColors.dark}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <View
            style={{
              marginTop: 20,
              borderRadius: 25,
              marginHorizontal: 15,
              backgroundColor: myColors.light,
              height: 300,
              elevation: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {searchedText ? (
              <View style={styles.resultBox}>
                <View style={{ width: "100%" }}>
                  <Text style={styles.resultText}>
                    Search Results for: "{searchedText}"
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {!searchFound ? (
                    <Text style={styles.resultText}>No results found.</Text>
                  ) : (
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flex: 1,
                        width: "100%",
                        padding: 20,
                        paddingTop: 0,
                      }}
                    >
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.itemScroll}
                      >
                        {searchedData.map((item, key) => {
                          return (
                            <TouchableOpacity
                              key={key}
                              style={[
                                styles.resultItem,
                                {
                                  borderBottomWidth:
                                    key < searchedData?.length ? 0.5 : 0,
                                },
                              ]}
                              onPress={() => {
                                addView(item.id);
                              }}
                            >
                              <View
                                style={{
                                  borderRadius: 10,
                                  width: 60,
                                  height: 60,
                                  borderWidth: 1,
                                  overflow: "hidden",
                                }}
                              >
                                <Image
                                  source={item.image_url}
                                  style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  contentFit="cover"
                                  transition={1000}
                                ></Image>
                              </View>

                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: "lusitana",
                                }}
                              >
                                {item.plant_name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.noSearchText}>
                Start typing to see results.
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginHorizontal: 20,
                padding: 10,
                gap: 25,
                width: "100%",
              }}
            >
              {viewedPlants?.length > 0 ? (
                viewedPlants.map((item) => {
                  return (
                    <View
                      style={{
                        backgroundColor: myColors.dark,
                        borderRadius: 20,
                        height: 120,
                        width: 100,
                        elevation: 5,
                      }}
                      key={item.id}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: myColors.dark,
                          zIndex: 1000,
                          borderRadius: 20,
                          gap: 20,
                          flex: 1,
                        }}
                        onPress={() => addView(item.id)}
                      >
                        <Image
                          source={item.image_url}
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
                })
              ) : (
                <Text
                  style={{
                    marginVertical: 30,
                    marginHorizontal: 10,
                    textAlign: "center",
                    alignSelf: "center",
                    fontFamily: "lusitana",
                    fontSize: 22,
                  }}
                >
                  You haven't searched anything yet.
                </Text>
              )}
            </View>
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
    gap: 20,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: "algreyaBold",
    color: myColors.light,
    fontSize: 28,
  },
  header: {
    flex: 0.3,
    backgroundColor: myColors.darkAlt,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 30,
    justifyContent: "flex-end",
    gap: 50,
    elevation: 5,
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 30,
  },
  textArea: {
    flex: 1,
    height: 50,
    backgroundColor: myColors.light,
    borderRadius: 15,
    padding: 15,
    color: myColors.dark,
    fontSize: 18,
    fontFamily: "lusitana",
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: "algreyaBold",
    marginBottom: 20,
    color: myColors.darkAlt,
    paddingHorizontal: 20,
  },
  noSearchText: {
    fontSize: 20,
    fontFamily: "lusitana",
  },
  resultBox: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  resultText: {
    margin: 25,
    textAlign: "left",
    fontSize: 18,
    fontFamily: "lusitanaBold",
  },
  resultItem: {
    paddingVertical: 15,
    borderColor: myColors.lightGreen,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  itemScroll: {
    flex: 1,
    width: "100%",
    borderColor: myColors.lightGreen,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: myColors.light,
    borderTopWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 20,
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
  checkText: {
    color: myColors.dark,
    fontSize: 18,
    fontFamily: "lusitana",
  },
});
