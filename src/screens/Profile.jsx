import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ImageBackground,
  Switch,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
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
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import text from "../data/terms.json";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PASS_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{8,15}$/;

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
  const [margin, setMargin] = useState(0);
  const [open, setOpen] = useState(false);
  const [ddValue, setDdValue] = useState(null);
  const [isNotiEnabled, setIsNotiEnabled] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [photo, setPhoto] = useState("");
  const [items, setItems] = useState([
    { label: "Dhaka", value: "dhaka" },
    { label: "Outside Dhaka", value: "outside" },
  ]);
  const [errorText, setErrorText] = useState();

  const toggleSwitch = () =>
    setIsNotiEnabled((previousState) => !previousState);

  const [form, setForm] = useState({
    name: "",
    number: "",
    profession: "",
    age: "",
  });

  const [addrForm, setaddrForm] = useState({
    address: "",
  });

  const [passForm, setPassForm] = useState({
    newPass: "",
    confirmPass: "",
  });

  useEffect(() => {
    getUsers();
  }, [userData]);

  const onChangeHandler = (value, name) => {
    setDisabled(false);
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  const onChangeAddrHandler = (value, name) => {
    setDisabled(false);
    setaddrForm((addrForm) => ({
      ...addrForm,
      [name]: value,
    }));
  };

  const onChangePassHandler = (value, name) => {
    setDisabled(false);
    setPassForm((passForm) => ({
      ...passForm,
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

  const handleFormSubmit = async () => {
    setIfSuccess(false);
    setIfWrong(false);
    setLogText("");
    if (form.name) {
      setIfLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update([{ full_name: form.name }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        setLogText("Check your Inputs");
      } else {
        setLogText("Fullname changed");
        setIfSuccess(true);
        setIfLoading(false);
      }
    }
    if (form.number) {
      setIfLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update([{ phn_no: form.number }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        setLogText("Check your Inputs");
      } else {
        setLogText("Phone no. changed");
        setIfSuccess(true);
        setIfLoading(false);
      }
    }
    if (form.age) {
      setIfLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update([{ age: form.age }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        setLogText("Check your Inputs");
      } else {
        setLogText("Age changed");
        setIfSuccess(true);
        setIfLoading(false);
      }
    }
    if (form.profession) {
      setIfLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update([{ profession: form.profession }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        setLogText("Check your Inputs");
      } else {
        setLogText("Profession changed");
        setIfSuccess(true);
        setIfLoading(false);
      }
    }
  };

  const handleAddrFormSubmit = async () => {
    setIfSuccess(false);
    setIfWrong(false);
    setLogText("");

    if (ddValue) {
      const { data, error } = await supabase
        .from("users")
        .update([{ location: ddValue }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        console.log(error);
        // setLogText(error);
      } else {
        setLogText("Location changed");
        setIfSuccess(true);
        setIfLoading(false);
      }
    }

    if (addrForm.address) {
      setIfLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update([{ address: addrForm.address }])
        .eq("id", userData?.id);
      if (error) {
        setIfWrong(true);
        setLogText("Check your Inputs");
      } else {
        setLogText("Address changed");
        setIfSuccess(true);
        setIfLoading(false);
      }
    }
  };

  const handlePassFormSubmit = async () => {
    setIfSuccess(false);
    setIfWrong(false);
    setLogText("");

    if (passForm.newPass === passForm.confirmPass) {
      setIfLoading(true);
      setIfSuccess(true);
      console.log(passForm.newPass);
      if (PASS_REGEX.test(passForm.newPass)) {
        const response = await supabase.auth.updateUser({
          password: passForm.newPass,
        });
        console.log(response);
        setIfLoading(false);
        setLogText("Password changed!");
      } else {
        setLogText("Password isn't secure. Use capital letters and symboles");
      }
    } else {
      setIfWrong(true);
      setLogText("Passwords don't match");
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

  const handleTxtFile = () => {
    return text.text;
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
              thumbColor={isNotiEnabled ? myColors.dark : myColors.light}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isNotiEnabled}
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
            setLogText("");
            setIfLoading(false);
            setIfSuccess(false);
            setIfWrong(false);
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
                setAddrModule(false);
                setElavatedBg(false);
                setLogText("");
                setIfLoading(false);
                setIfSuccess(false);
                setIfWrong(false);
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
          {/* <ScrollView > */}
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
              My Address
            </Text>

            <View
              style={[
                styles.inputContainer,
                { height: 60, marginBottom: margin },
              ]}
            >
              <Text style={styles.label}>Location: </Text>
              <DropDownPicker
                open={open}
                value={ddValue || userData?.location}
                items={items}
                setOpen={setOpen}
                setValue={setDdValue}
                setItems={setItems}
                style={[
                  {
                    backgroundColor: myColors.light,
                    borderColor: myColors.lightGreen,
                    width: 220,
                  },
                ]}
                containerStyle={{
                  width: 220,
                  backgroundColor: myColors.light,
                  borderColor: myColors.light,
                  zIndex: 3000,
                }}
                dropDownContainerStyle={{
                  backgroundColor: myColors.light,
                  borderColor: myColors.lightGreen,
                  borderTopColor: myColors.light,
                  zIndex: 10000,
                  color: myColors.light,
                }}
                zIndex={5000}
                textStyle={styles.textInput}
                onPress={() => {
                  margin === 0 ? setMargin(70) : setMargin(0);
                }}
                onSelectItem={() => setMargin(0)}
              />
            </View>
            <View style={[styles.inputContainer, { zIndex: 1000 }]}>
              <Text style={styles.label}>Address: </Text>
              <TextInput
                style={styles.textInput}
                value={form.address || userData?.address}
                onChangeText={(value) => onChangeAddrHandler(value, "address")}
              ></TextInput>
            </View>

            <TouchableOpacity
              style={{
                alignSelf: "center",
                backgroundColor: myColors.darkAlt,
                borderRadius: 10,
                padding: 10,
              }}
              disabled={false}
              onPress={handleAddrFormSubmit}
            >
              <Text
                style={[styles.label, { fontSize: 20, color: myColors.light }]}
              >
                Submit
              </Text>
            </TouchableOpacity>
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
            setIfSuccess(false);
            setIfWrong(false);
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
                setIfSuccess(false);
                setIfWrong(false);
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
            setLogText("");
            setIfLoading(false);
            setIfSuccess(false);
            setIfWrong(false);
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
                setPassModule(false);
                setElavatedBg(false);
                setLogText("");
                setIfLoading(false);
                setIfSuccess(false);
                setIfWrong(false);
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
                Change Password
              </Text>

              <View style={[styles.inputContainer, { width: 300 }]}>
                <Text style={styles.label}>New Password: </Text>
                <TextInput
                  style={styles.textInput}
                  value={form.newPass}
                  onChangeText={(value) =>
                    onChangePassHandler(value, "newPass")
                  }
                  secureTextEntry={true}
                ></TextInput>
              </View>

              <View style={[styles.inputContainer, { width: 300 }]}>
                <Text style={styles.label}>Confirm Password: </Text>
                <TextInput
                  style={styles.textInput}
                  value={form.confirmPass}
                  onChangeText={(value) =>
                    onChangePassHandler(value, "confirmPass")
                  }
                  secureTextEntry={true}
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
                onPress={handlePassFormSubmit}
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
              height: 600,
            }}
          >
            <ScrollView>
              <View style={{ width: "100%", padding: 20 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "algreyaBold",
                    fontSize: 26,
                  }}
                >
                  {settings[4].title}
                </Text>
              </View>
              <Text
                style={{
                  textAlign: "justify",
                  fontFamily: "lusitana",
                  fontSize: 16,
                }}
              >
                {handleTxtFile()}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  getAnimation();
                  setTermModule(false);
                  setElavatedBg(false);
                }}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    width: 80,
                    padding: 15,
                    backgroundColor: myColors.dark,
                    borderRadius: 10,
                    color: myColors.light,
                    textAlign: "center",
                    fontSize: 16,
                    fontFamily: "lusitanaBold",
                  }}
                >
                  I Agree
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </GestureRecognizer>
      </>
    );
  };

  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showAlert(true);
      errorText("You've refused to allow this appp to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      setImageLoading(true);
      let base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/di7kzjary/upload";
      let data = {
        file: base64Img,
        upload_preset: "greenery",
      };
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data.url);
          setPhoto(data.url);
          photoUpToDB(data.url);
        })
        .catch((err) => {
          showAlert(true);
          errorText(err);
        });
    }
  };

  const photoUpToDB = async (url) => {
    const { data, error } = await supabase
      .from("users")
      .update({ avatar_url: url })
      .eq("id", userData?.id)
      .select();
    if (!error) {
      setImageLoading(false);
    } else {
      console.log(error);
      showAlert(true);
      errorText("Upload failed");
      setImageLoading(false);
    }
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

        {showAlert && !errorText ? (
          <CustomAlert
            alertType="alert"
            title={"Alert!!"}
            isVisible={showAlert ? true : false}
            onExit={() => setShowAlert(false)}
            message="Logging you out in a second...."
          />
        ) : null}

        {showAlert && errorText ? (
          <CustomAlert
            alertType="error"
            title={"Alert!!"}
            isVisible={showAlert ? true : false}
            onExit={() => setShowAlert(false)}
            message="Logging you out in a second...."
          />
        ) : null}

        <ImageBackground style={styles.profileBanner}>
          <View style={styles.uploadBtn}></View>
          <ImageBackground
            source={{
              uri: userData && !imageLoading ? userData.avatar_url : null,
            }}
            style={styles.avatar}
          >
            {imageLoading ? (
              <ActivityIndicator size={"large"} color={myColors.light} />
            ) : (
              <TouchableOpacity
                style={[styles.uploadBtn, { margin: 15 }]}
                onPress={() => showImagePicker()}
              >
                <FontAwesomeIcon
                  size={14}
                  icon={faUpload}
                  style={{
                    color: "white",
                  }}
                />
              </TouchableOpacity>
            )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtn: {
    position: "absolute",
    bottom: "-2%",
    // right: "30%",
    width: 50,
    backgroundColor: myColors.transDark,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
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
    zIndex: 1000,
  },
  textInput: {
    color: myColors.darkAlt,
    fontFamily: "lusitanaBold",
    fontSize: 16,
    width: 190,
  },
  label: { color: myColors.dark, fontFamily: "lusitanaBold", fontSize: 16 },
});
