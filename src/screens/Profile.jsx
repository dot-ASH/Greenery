import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ImageBackground,
  Modal,
  Switch,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { supabase } from "../data/Supabase";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAngleRight,
  faBell,
  faCircleCheck,
  faCircleExclamation,
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
import MapView from "react-native-maps";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [notiModule, setNotiModule] = useState(false);
  const [elavatedBg, setElavatedBg] = useState(false);
  const [addrModule, setAddrModule] = useState(false);
  const [accModule, setAccModule] = useState(false);
  const [psModule, setPassModule] = useState(false);
  const [tmModule, setTermModule] = useState(false);
  const [logText, setLogText] = useState();
  const [ifLoading, setIfLoading] = useState(false);
  const [ifSuccess, setIfSuccess] = useState(false);
  const [ifWrong, setIfWrong] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [form, setForm] = useState({
    name: "",
    number: "",
    profession: "",
    age: "",
  });

  const onChangeHandler = (value, name) => {
    setDisabled(false);
    // how to handle for each state field
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
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

  useEffect(() => {
    // setForm({
    //   name: userData?.fullName,
    //   profession: userData?.fullName,
    //   age: userData?.age,
    //   number: userData?.phn_no,
    // })

    console.log(form, logText);
  }, [form]);

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: "easeIn", property: "opacity" },
    });
  };

  const getNotification = () => {
    setElavatedBg(true);
    setNotiModule(true);
  };

  const getAccount = () => {};

  const handleFormSubmit = async () => {
    if (form.name) {
      setIfLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update([{ full_name: form.name }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        setLogText(error);
      } else {
        setLogText("Fullname changed");
        setIfSuccess(true);
        setIfLoading(false);
     
      }
    }
    if (form.number) {
      console.log("age", form.number);
    }
    if (form.age) {
      console.log("age", form.age, userData?.id);
    }
    if (form.profession) {
      console.log("age", form.profession);
    }
  };

  const signOut = async () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: "linear", property: "opacity" },
    });
    if (showAlert === false) {
      setShowAlert(true);
    }
    const { error } = await supabase.auth.signOut();
    setTimeout(() => {
      navigation.navigate("Login");
    }, 1500);
  };

  const settings = [
    {
      id: 1,
      title: "My Address",
      onpress: () => {
        getAnimation();
        setElavatedBg(true);
        setAddrModule(true);
      },
      icon: (
        <FontAwesomeIcon
          icon={faMap}
          style={{
            color: myColors.dark,
          }}
        />
      ),
    },
    {
      id: 2,
      title: "Account",
      onpress: () => {
        getAnimation();
        setElavatedBg(true);
        setAccModule(true);
      },

      icon: (
        <FontAwesomeIcon
          icon={faUser}
          style={{
            color: myColors.dark,
          }}
        />
      ),
    },
    {
      id: 3,
      title: "Notification",
      onpress: () => {
        getAnimation();
        getNotification();
      },
      icon: (
        <FontAwesomeIcon
          icon={faBell}
          style={{
            color: myColors.dark,
          }}
        />
      ),
    },
    {
      id: 4,
      title: "Password",
      onpress: () => {
        getAnimation();
        setElavatedBg(true);
        setPassModule(true);
      },
      icon: (
        <FontAwesomeIcon
          icon={faKey}
          style={{
            color: myColors.dark,
          }}
        />
      ),
    },
    {
      id: 5,
      title: "Terms and Condition",
      onpress: () => {
        getAnimation();
        setElavatedBg(true);
        setTermModule(true);
      },
      icon: (
        <FontAwesomeIcon
          icon={faNoteSticky}
          style={{
            color: myColors.dark,
          }}
        />
      ),
    },
    {
      id: 6,
      title: "Sign Out",
      onpress: () => signOut(),
      icon: (
        <FontAwesomeIcon
          icon={faRightFromBracket}
          style={{
            color: myColors.errorText,
          }}
        />
      ),
    },
  ];

  settings.sort((a, b) => a.id - b.id);

  const notifyModule = () => {
    return (
      <>
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            setNotiModule(false);
            setElavatedBg(false);
          }}
          style={styles.gestureStyle}
        >
          <View
            style={{
              alignSelf: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
              width: "100%",
              paddingBottom: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                getAnimation();
                setNotiModule(false);
                setElavatedBg(false);
              }}
            >
              <FontAwesomeIcon
                size={20}
                icon={faXmark}
                style={{
                  color: myColors.dark,
                  alignSelf: "flex-end",
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: myColors.darkAlt,
                fontFamily: "algreyaBold",
                fontSize: 20,
              }}
            >
              Get Notification
            </Text>
            <Switch
              trackColor={{
                false: myColors.lightGreen,
                true: myColors.lightGreen,
              }}
              thumbColor={myColors.dark}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={toggleSwitch}
              value={true}
              style={{ elevation: 20 }}
            ></Switch>
          </View>
        </GestureRecognizer>
      </>
    );
  };

  const AddrsModule = () => {
    return (
      <>
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            setAddrModule(false);
            setElavatedBg(false);
          }}
          style={styles.gestureStyle}
        >
          <View
            style={{
              alignSelf: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
              width: "100%",
              paddingBottom: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                getAnimation();
                setAddrModule(false);
                setElavatedBg(false);
              }}
            >
              <FontAwesomeIcon
                size={20}
                icon={faXmark}
                style={{
                  color: myColors.dark,
                  alignSelf: "flex-end",
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: myColors.darkAlt,
                fontFamily: "algreyaBold",
                fontSize: 20,
              }}
            >
              Get Notification
            </Text>
            <Switch
              trackColor={{
                false: myColors.lightGreen,
                true: myColors.lightGreen,
              }}
              thumbColor={myColors.dark}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={toggleSwitch}
              value={true}
              style={{ elevation: 20 }}
            ></Switch>
          </View>
        </GestureRecognizer>
      </>
    );
  };

  const AccModule = () => {
    return (
      <>
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            setAccModule(false);
            setElavatedBg(false);
            setLogText("");
            setIfLoading(false);
            setIfSuccess(false)
            setIfWrong(false)
          }}
          style={styles.gestureStyle}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
              width: "100%",
              paddingBottom: 20,
              paddingTop: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Loading and logs */}
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: "flex-start",
              }}
            >
              {ifLoading ? (
                <ActivityIndicator
                  size={"small"}
                  color={myColors.lightGreen}
                ></ActivityIndicator>
              ) : null}
              {ifSuccess ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size={20}
                  color={myColors.dark}
                ></FontAwesomeIcon>
              ) : null}
              {ifWrong ? (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size={20}
                  color={myColors.dark}
                ></FontAwesomeIcon>
              ) : null}
              {logText ? (
                <Text
                  style={{
                    color: myColors.dark,
                    fontFamily: "lusitanaBold",
                    fontSize: 16,
                  }}
                >
                  {logText}
                </Text>
              ) : null}
            </View>
            {/* ends */}

            <TouchableOpacity
              onPress={() => {
                getAnimation();
                setAccModule(false);
                setElavatedBg(false);
                setLogText("");
                setIfLoading(false);
                setIfSuccess(false)
                setIfWrong(false)
              }}
              style={{ alignSelf: "flex-end" }}
            >
              <FontAwesomeIcon
                size={20}
                icon={faXmark}
                style={{
                  color: myColors.dark,
                  alignSelf: "flex-end",
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <ScrollView scrollEnabled>
            <View
              style={{
                paddingVertical: 10,
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                gap: 20,
              }}
            >
              {/* Module Comp  */}
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "algreyaBold",
                  fontSize: 22,
                  color: myColors.darkAlt,
                }}
              >
                Account Information
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name: </Text>
                <TextInput
                  style={styles.textInput}
                  value={form.name || userData?.full_name}
                  onChangeText={(value) => onChangeHandler(value, "name")}
                ></TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age: </Text>
                <TextInput
                  style={styles.textInput}
                  value={form.age || `${userData?.age}`}
                  onChangeText={(value) => onChangeHandler(value, "age")}
                ></TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile no.: </Text>
                <TextInput
                  style={styles.textInput}
                  value={form.number || userData?.phn_no}
                  onChangeText={(value) => onChangeHandler(value, "number")}
                ></TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Profession: </Text>
                <TextInput
                  style={styles.textInput}
                  value={form.profession || userData?.profession}
                  onChangeText={(value) => onChangeHandler(value, "profession")}
                ></TextInput>
              </View>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  backgroundColor: disabled
                    ? myColors.lightGreen
                    : myColors.darkAlt,
                  borderRadius: 10,
                  padding: 10,
                }}
                disabled={disabled}
                onPress={handleFormSubmit}
              >
                <Text
                  style={[
                    styles.label,
                    { fontSize: 20, color: myColors.light },
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </GestureRecognizer>
      </>
    );
  };

  const passModule = () => {
    return (
      <>
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            setPassModule(false);
            setElavatedBg(false);
          }}
          style={styles.gestureStyle}
        >
          <View
            style={{
              alignSelf: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
              width: "100%",
              paddingBottom: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                getAnimation();
                setPassModule(false);
                setElavatedBg(false);
              }}
            >
              <FontAwesomeIcon
                size={20}
                icon={faXmark}
                style={{
                  color: myColors.dark,
                  alignSelf: "flex-end",
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: myColors.darkAlt,
                fontFamily: "algreyaBold",
                fontSize: 20,
              }}
            >
              Get Notification
            </Text>
            <Switch
              trackColor={{
                false: myColors.lightGreen,
                true: myColors.lightGreen,
              }}
              thumbColor={myColors.dark}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={toggleSwitch}
              value={true}
              style={{ elevation: 20 }}
            ></Switch>
          </View>
        </GestureRecognizer>
      </>
    );
  };

  const termModule = () => {
    return (
      <>
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            setTermModule(false);
            setElavatedBg(false);
          }}
          style={styles.gestureStyle}
        >
          <View
            style={{
              alignSelf: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
              width: "100%",
              paddingBottom: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                getAnimation();
                setTermModule(false);
                setElavatedBg(false);
              }}
            >
              <FontAwesomeIcon
                size={20}
                icon={faXmark}
                style={{
                  color: myColors.dark,
                  alignSelf: "flex-end",
                }}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: myColors.darkAlt,
                fontFamily: "algreyaBold",
                fontSize: 20,
              }}
            >
              Get Notification
            </Text>
            <Switch
              trackColor={{
                false: myColors.lightGreen,
                true: myColors.lightGreen,
              }}
              thumbColor={myColors.dark}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={toggleSwitch}
              value={true}
              style={{ elevation: 20 }}
            ></Switch>
          </View>
        </GestureRecognizer>
      </>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={false}
      />

      <SafeAreaView style={styles.container}>
        {elavatedBg ? <View style={styles.elavatedbg}></View> : null}
        {notiModule ? notifyModule() : null}
        {addrModule ? AddrsModule() : null}
        {accModule ? AccModule() : null}
        {psModule ? passModule() : null}
        {tmModule ? termModule() : null}

        <ImageBackground style={styles.profileBanner}>
          <View style={styles.uploadBtn}></View>
          <ImageBackground
            source={{ uri: userData ? userData.avatar_url : null }}
            style={styles.avatar}
          >
            <View style={[styles.uploadBtn, { margin: 15 }]}>
              <FontAwesomeIcon
                size={14}
                icon={faUpload}
                style={{
                  color: myColors.dark,
                }}
              />
            </View>
          </ImageBackground>
          <View>
            <Text style={styles.fullName}>
              {userData && userData.full_name}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.settings}>
          <View style={styles.settingSection}>
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
          </View>
        </View>
      </SafeAreaView>
      {/* <SafeAreaView style={styles.container}>
        {showAlert ? (
          <CustomAlert
            alertType="alert"
            title={"Alert!!"}
            isVisible={showAlert ? true : false}
            onExit={() => setShowAlert(false)}
            message="Logging you out in a second...."
          />
        ) : null}
        <View style={{ gap: 20 }}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text
            style={{
              fontFamily: "lusitanaBold",
              backgroundColor: myColors.dark,
              color: "white",
              width: 250,
              borderRadius: 10,
              padding: 10,
              textAlign: "center",
              alignSelf: "center",
            }}
          >{`Welcome ${userData ? userData.full_name : null}`}</Text>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}
            onPress={signOut}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              style={{ color: myColors.darkAlt }}
            />
            <Text
              style={{
                fontFamily: "lusitana",
                fontSize: 12,
                color: myColors.darkAlt,
              }}
            >
              Sign-out
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView> */}
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
    elevation: 20,
    borderRadius: 10,
    zIndex: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  settings: {
    flex: 1,
    marginTop: -40,
    zIndex: 800,
    width: Dimensions.get("window").width - 60,
    borderRadius: 20,
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
  settingItems: {
    alignItems: "center",
    width: "80%",
    paddingVertical: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    gap: 40,
    justifyContent: "flex-start",
  },
  settingSection: {
    width: "100%",
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: myColors.light,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  miDivider: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 2,
    borderRadius: 1,
  },

  elavatedbg: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: Dimensions.get("window").height + 80,
    width: Dimensions.get("window").width,
    zIndex: 2000,
  },
  gestureStyle: {
    position: "absolute",
    paddingHorizontal: 40,
    paddingVertical: 20,
    width: Dimensions.get("window").width - 20,
    bottom: 80,
    zIndex: 3000,
    backgroundColor: myColors.light,
    borderRadius: 20,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  fullName: {
    color: myColors.light,
    fontFamily: "algreyaBold",
    fontSize: 28,
  },
  inputContainer: {
    flexDirection: "row",
    height: 50,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 10,
    borderColor: myColors.lightGreen,
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
  },
  textInput: {
    color: myColors.darkAlt,
    fontFamily: "lusitanaBold",
    fontSize: 16,
    width: 190,
  },
  label: { color: myColors.dark, fontFamily: "lusitanaBold", fontSize: 16 },
});
