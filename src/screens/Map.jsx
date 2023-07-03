import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { View } from 'react-native';

export default function TabOneScreen() {

const LATITUDE = 29.9990674;
const LONGITUDE = -90.0852767;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [region, setRegion] = useState({
    latitude: LATITUDE,    // initial location latitude
    longitude: LONGITUDE,  // initial location longitude
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        zoomTapEnabled={false}
      ></MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
