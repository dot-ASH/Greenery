import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Buffer } from "buffer";
import { supabase } from "./src/data/Supabase";
import { Image } from "expo-image";

import { Registration } from "./src/screens/Registration";
import { Login } from "./src/screens/Login";
import { Welcome } from "./src/screens/Welcome";
import { DrawerStack } from "./src/screens/DrawerStack";
import { PostSignup } from "./src/screens/PostSignup";
import { Product } from "./src/screens/Product";
import { Order } from "./src/screens/Order";

global.Buffer = Buffer;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState(false);
  const [redirect, setRedirect] = useState("");
  const [userData, setUserData] = useState();

  const [fontsLoaded] = useFonts({
    algreyaBold: require("./assets/fonts/AlegreyaSans-Bold.ttf"),
    lusitanaBold: require("./assets/fonts/Lusitana-Bold.ttf"),
    lusitana: require("./assets/fonts/Lusitana-Regular.ttf"),
    judson: require("./assets/fonts/Judson-Regular.ttf"),
    judsonItalic: require("./assets/fonts/Judson-Italic.ttf"),
    judsonBold: require("./assets/fonts/Judson-Bold.ttf"),
  });

  useEffect(() => {
    auth();

    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session);
    });
  }, []);

  useEffect(() => {
    if (!fontsLoaded) {
      setLoading(true);
    } else setLoading(false);
  });

  const auth = async () => {
    let id = await getUID();
    if (id) {
      await getUsers(id).then((res) => {
        if (res.full_name) {
          setRedirect("Drawerstack");
        } else {
          setRedirect("postSignup");
        }
      });
    } else {
      setRedirect("Welcome");
    }
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

  console.log(redirect);

  const Stack = createNativeStackNavigator();
  return redirect && !loading ? (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={`${redirect}`}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerLeft: null }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="Reg" component={Registration} />
        <Stack.Screen
          name="postSignup"
          component={PostSignup}
          initialParams={{ active: "Home" }}
        />
        <Stack.Screen name="product" component={Product} />
        <Stack.Screen name="order" component={Order} />

          {/* DRAWERSTACK */}
        <Stack.Screen
          name="Drawerstack"
          component={DrawerStack}
          initialParams={{ active: "Home" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <>
    {/* SPLASH SCREEN ON LOAD */}
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"#E4E8D2"}
        hidden={false}
      />
      <Image
        source={require("./assets/splash.png")}
        style={{
          flex: 1,
          width: null,
          height: null,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
