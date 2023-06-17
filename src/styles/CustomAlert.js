import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { myColors } from "./Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faBell, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height + 50;

export const CustomAlert = (props) => {
  const [visible, setVisible] = useState(props.isVisible);
  const [alertTypeName, setAlertTypeName] = useState("");

  return (
    <View
      style={{
        display: visible ? "flex" : "none",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: width,
        height: height,
        backgroundColor: "rgba(52, 52, 52, 0.6)",
        zIndex: 1000,
      }}
    >
      <View style={styles.gradBg}>
        <View style={styles.alertHeader}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              fontWeight: "bold",
              color:
                props.alertType === "error"
                  ? myColors.errorText
                  : myColors.highText,
            }}
          >
            {props.title}
          </Text>

          <TouchableOpacity onPress={props.onExit}>
            <Text
              style={{
                color:
                  props.alertType === "error"
                    ? myColors.errorText
                    : myColors.dark,
                fontFamily: "lusitanaBold",
                fontWeight: "bold",
                fontSize: 32,
              }}
            >
              X
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          {props.alertType === "alert" ? (
            <FontAwesomeIcon
              icon={faBell}
              size={60}
              style={{ marginTop: -20, opacity: 0.9, color: myColors.dark }}
            />
          ) : null}
          {props.alertType === "error" ? (
            <FontAwesomeIcon
              icon={faXmarkCircle}
              size={60}
              style={{
                marginTop: -20,
                opacity: 0.9,
                color: myColors.errorText,
              }}
            />
          ) : null}
          {props.alertType === "success" ? (
            <FontAwesomeIcon
              icon={faCheckSquare}
              size={60}
              style={{ marginTop: -20, color: myColors.lightGreen }}
            />
          ) : null}
          <Text
            style={{
              fontSize: 20,
              fontFamily: "lusitanaBold",
              color:
                props.alertType === "error"
                  ? myColors.errorText
                  : myColors.highText,
              textAlign: "center",
            }}
          >
            {props.message}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    zIndex: 1000,
  },
  gradBg: {
    flex: 1,
    position: "absolute",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(246, 252, 214, 0.85)",
    elevation: 80,
  },

  alertHeader: {
    flex: 1,
    maxWidth: width - 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 40,
    shadowColor: myColors.dark,
  },

  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    paddingHorizontal: 30,
    paddingBottom: 30,
    gap: 20,
  },
});
