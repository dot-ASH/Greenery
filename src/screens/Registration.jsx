import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { myColors } from "../styles/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { supabase } from "../data/Supabase";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import {
  faEye as darkEye,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { CustomAlert } from "../styles/CustomAlert";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const USER_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W\_])[a-zA-Z0-9\W\_]{8,15}$/;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Registration = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passW, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [showEmailValid, setShowEmailValid] = useState(false);
  const [validMail, setValidMail] = useState(false);
  const [showPassValid, setShowUserValid] = useState(false);
  const [validPassword, setValiduserName] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(null);
  const [errorMssg, setErrorMssg] = useState("You Have error!");
  const [passMatch, setPassMatch] = useState();
  const [showPassMatch, setShowPassMatch] = useState(false);

  const handleForm = async (id) => {
    const { error } = await supabase
      .from("users")
      .insert({ email: email, username: id });

    if (error) {
      console.log(error);
    }
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    const response = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (response.error) {
      console.log(response.error)
      setErrorMssg(response.error);
      LayoutAnimation.configureNext({
        duration: 250,
        create: { type: "linear", property: "opacity" },
      });
      setSignUpSuccess(false);
      setTimeout(() => {
        setSignUpSuccess(null);
        setLoading(false);
      }, 2000);
    } else {
      console.log(response.data.user.id);
      handleForm(response.data.user.id);
      LayoutAnimation.configureNext({
        duration: 250,
        create: { type: "linear", property: "opacity" },
      });
      setLoading(false);
      setSignUpSuccess(true);
      setTimeout(() => {
        navigation.push("Login");
        setSignUpSuccess(null);
      }, 10000);
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

  const passValidation = (pass) => {
    setPass(pass);
    if (USER_REGEX.test(passW)) {
      setValiduserName(true);
    } else setValiduserName(false);
  };

  const checkMatch = () => {
    if (passW === password) {
      setPassMatch(true);
    } else setPassMatch(false);
  };
  const onExitFunc = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: "linear", property: "opacity" },
    });
    setSignUpSuccess(null);
  };

  useEffect(() => {
    checkMatch();
  });

  return (
    <SafeAreaView style={styles.container}>
      {signUpSuccess === true ? (
        <CustomAlert
          alertType="success"
          title={"Signup Successful!!"}
          isVisible={signUpSuccess === null ? false : true}
          onExit={onExitFunc}
          message={`Account Creation Successful\nverify your email and login afterwards`}
        />
      ) : null}
      {signUpSuccess === false ? (
        <CustomAlert
          alertType="error"
          title={"Singup Failed!!"}
          isVisible={signUpSuccess === null ? false : true}
          onExit={onExitFunc}
          message={errorMssg}
        />
      ) : null}

      <View
        style={{
          flex: 0.2,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.pageTitle}>Registration</Text>
      </View>
      <View
        style={{
          flex: 0.7,
        }}
      >
        <View>
          <View>
            <Text style={styles.label}>Email Adress:</Text>
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
                onChangeText={(pass) => passValidation(pass)}
                onFocus={() => setShowUserValid(true)}
                onBlur={() =>
                  passW ? setShowUserValid(true) : setShowUserValid(false)
                }
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
            {!validPassword && showPassValid ? (
              <View style={styles.error}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ color: myColors.errorText }}
                />
                <Text style={styles.erroText}>
                  Use a strong pasword with lowercase, uppercase, symbols and
                  numbers
                </Text>
              </View>
            ) : null}
          </View>
          <View>
            <Text style={styles.label}>Confirm Password:</Text>
            <View>
              <TextInput
                style={styles.TextInput}
                placeholder={"password"}
                placeholderTextColor={myColors.lightGreen}
                secureTextEntry={passVisible ? false : true}
                onChangeText={(password) => setPassword(password)}
                onFocus={() => setShowPassMatch(true)}
                onBlur={() =>
                  password ? setShowPassMatch(true) : setShowPassMatch(false)
                }
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
            {!passMatch && showPassMatch ? (
              <View style={styles.error}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ color: myColors.errorText }}
                />
                <Text style={styles.erroText}>Passwords didn't match!</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.buttonStyle}
            disabled={validMail && validPassword && passMatch ? false : true}
            onPress={signUpWithEmail}
          >
            <Text style={styles.buttonText}>
              {loading ? "loading..." : "Sign up"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
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
              already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.label, { textDecorationLine: "underline" }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
    marginTop: -5,
    padding: 10,
    paddingLeft: 0,

    gap: 5,
  },
  erroText: {
    color: myColors.errorText,
    fontFamily: "lusitanaBold",
    fontSize: 16,
  },
});
