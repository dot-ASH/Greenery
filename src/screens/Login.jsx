import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { supabase, supabaseUrl } from "../data/Supabase";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import {
  faEye as darkEye,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { CustomAlert } from "../styles/CustomAlert";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validMail, setValidMail] = useState(false);
  const [userFullName, setUserFullName] = useState();
  const [userCheck, setUserCheck] = useState(false);
  const [showEmailValid, setShowEmailValid] = useState(false);
  const [loginSucess, setLoginSuccess] = useState(null);
  const [errorMssg, setErrorMssg] = useState("You Have error!");
  const [userData, setUserData] = useState([]);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMssg(error.message);
      LayoutAnimation.configureNext({
        duration: 250,
        create: { type: "linear", property: "opacity" },
      });
      setLoginSuccess(false);
      setTimeout(() => {
        setLoginSuccess(null);
        setLoading(false);
      }, 5000);
    } else {
      LayoutAnimation.configureNext({
        duration: 250,
        create: { type: "linear", property: "opacity" },
      });
      setLoading(false);
      setLoginSuccess(true);

      let id = await getUID();
      if (id) {
        await getUsers(id).then((res) => {
          if (res.full_name) {
            setTimeout(() => {
              navigation.push("Drawerstack");
              setLoginSuccess(null);
            }, 2000);
          } else {
            setTimeout(() => {
              navigation.push("postSignup");
              setLoginSuccess(null);
            }, 2000);
          }
        });
      }
    }
  };

  const showPass = () => {
    if (passVisible === true) {
      setPassVisible(false);
    } else setPassVisible(true);
  };

  const mailValidation = (mail) => {
    setEmail(mail);
    if (EMAIL_REGEX.test(email)) {
      setValidMail(true);
    } else setValidMail(false);
  };

  async function getUsers(uid) {
    const response = await supabase
      .from("users")
      .select(`*`)
      .eq("username", uid);

    if (response.error) {
      console.log(response.error);
    } else {
      return response?.data[0];
    }
  }

  const getUID = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data.session?.user) {
      return data.session.user.id;
    }
  };

  useEffect(() => {});

  return (
    <SafeAreaView style={styles.container}>
      {/* PRIO AND MAMUN */}
      {loginSucess === true ? (
        <CustomAlert
          alertType="success"
          title={"Login Successful!!"}
          isVisible={loginSucess === null ? false : true}
          onExit={() => setLoginSuccess(null)}
          message="Logging you in a second...."
        />
      ) : null}
      {loginSucess === false ? (
        <CustomAlert
          alertType="error"
          title={"Login Failed!!"}
          isVisible={loginSucess === null ? false : true}
          onExit={() => setLoginSuccess(null)}
          message={errorMssg}
        />
      ) : null}
      <View
        style={{
          flex: 0.3,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.pageTitle}>Login</Text>
      </View>
      <View
        style={{
          flex: 0.7,
        }}
      >
        <View>
          <View>
            <Text style={styles.label}>Email Address:</Text>
            <View>
              <TextInput
                style={styles.TextInput}
                placeholder="Enter email address"
                placeholderTextColor={myColors.lightGreen}
                onChangeText={(mail) => mailValidation(mail)}
                onFocus={() => setShowEmailValid(true)}
                onBlur={() =>
                  email ? setShowEmailValid(true) : setShowEmailValid(false)
                }
              />
              {showEmailValid ? (
                <TouchableOpacity
                  style={{ position: "relative", left: "90%", bottom: "45%" }}
                  disabled={validMail ? true : false}
                >
                  <FontAwesomeIcon
                    size={18}
                    icon={validMail ? faCheck : faXmark}
                    style={{
                      color: myColors.dark,
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {!validMail && showEmailValid ? (
              <View style={styles.error}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ color: myColors.errorText }}
                />
                <Text style={styles.erroText}>
                  Use a valid email address. (e.g. xyz@gmail.com)
                </Text>
              </View>
            ) : null}
          </View>

          <View>
            <Text style={styles.label}>Password:</Text>
            <View>
              <TextInput
                style={styles.TextInput}
                placeholder={"password"}
                placeholderTextColor={myColors.lightGreen}
                secureTextEntry={passVisible ? false : true}
                onChangeText={(password) => setPassword(password)}
              />
              <TouchableOpacity
                style={{ position: "relative", left: "90%", bottom: "45%" }}
                onPress={showPass}
              >
                <FontAwesomeIcon
                  size={18}
                  icon={passVisible ? darkEye : faEye}
                  style={{
                    color: myColors.dark,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            disabled={validMail && !loading ? false : true}
            style={styles.buttonStyle}
            onPress={() => signInWithEmail()}
          >
            <Text style={styles.buttonText}>
              {loading ? "loading..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: 10,
            gap: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "judson",
              fontSize: 19,
              color: myColors.darkAlt,
            }}
          >
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Reg")}>
            <Text style={[styles.label, { textDecorationLine: "underline" }]}>
              Create a new Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: myColors.light,
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 20,
  },
  pageTitle: {
    textTransform: "uppercase",
    fontSize: 36,
    color: myColors.dark,
    textAlign: "center",
    fontFamily: "algreyaBold",
  },
  label: {
    position: "relative",
    fontSize: 20,
    color: myColors.dark,
    fontFamily: "lusitanaBold",
    paddingVertical: 10,
  },

  buttonStyle: {
    marginVertical: 20,
    backgroundColor: myColors.dark,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 12,
    shadowColor: myColors.dark,
    shadowOpacity: 0.9,
    elevation: 10,
  },
  buttonText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 22,
    color: myColors.light,
    fontFamily: "lusitanaBold",
  },
  image: {
    flex: 1,
    width: "130%",
    height: "130%",
    borderRadius: 20,
  },
  TextInput: {
    height: 55,
    fontFamily: "judson",
    fontSize: 22,
    color: myColors.dark,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    paddingLeft: 20,
    zIndex: 0,
    borderColor: myColors.darkAlt,
  },
  TextInputFocus: {
    height: 55,
    fontFamily: "judson",
    fontSize: 22,
    color: myColors.dark,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    paddingLeft: 20,
    zIndex: 0,
    borderColor: myColors.dark,
  },
  secondaryBtn: {
    alignSelf: "center",
    width: 60,
    marginTop: -10,
    marginVertical: 30,
    borderWidth: 1,
    borderColor: myColors.dark,
    padding: 10,
    borderRadius: 10,
  },
  secondaryBtnText: {
    alignSelf: "center",
    color: myColors.dark,
  },
  error: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingLeft: -10,
    padding: 10,
    gap: 5,
  },
  erroText: {
    color: myColors.errorText,
    fontFamily: "lusitanaBold",
    fontSize: 16,
  },
});
