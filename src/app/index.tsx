import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// local storage key
const STORAGE_KEY = "@elbe_ride_active_index";

// ray-Casting Algorithm
const isPointInPolygon = (
  point: { latitude: number; longitude: number },
  polygon: { latitude: number; longitude: number }[],
) => {
  let isInside = false;
  const x = point.latitude;
  const y = point.longitude;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;

    // Checks if an imaginary horizontal line drawn from your location intersects the park's borders
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }
  return isInside;
};

// parks data
const ROUTE_DATA = [
  {
    id: "1",
    name: "Jenischpark",
    boundary: [
      { latitude: 53.556, longitude: 9.86 },
      { latitude: 53.556, longitude: 9.872 },
      { latitude: 53.547, longitude: 9.872 },
      { latitude: 53.547, longitude: 9.86 },
    ],
  },
  {
    id: "2",
    name: "Hirsch Park",
    boundary: [
      { latitude: 53.559, longitude: 9.818 },
      { latitude: 53.559, longitude: 9.83 },
      { latitude: 53.551, longitude: 9.83 },
      { latitude: 53.551, longitude: 9.818 },
    ],
  },
  {
    id: "3",
    name: "Waldpark Falkenstein",
    boundary: [
      { latitude: 53.575, longitude: 9.75 },
      { latitude: 53.575, longitude: 9.785 },
      { latitude: 53.56, longitude: 9.785 },
      { latitude: 53.56, longitude: 9.75 },
    ],
  },
  {
    id: "4",
    name: "Klövensteen",
    boundary: [
      { latitude: 53.598, longitude: 9.732 },
      { latitude: 53.598, longitude: 9.748 },
      { latitude: 53.588, longitude: 9.748 },
      { latitude: 53.588, longitude: 9.732 },
    ],
  },
  { id: "5", name: "Hetlinger Schanze" },
  { id: "6", name: "Haseldorfer Marsch" },
  { id: "7", name: "Stadtpark Glückstadt" },
];

export default function HomeScreen() {
  const [activeParkIndex, setActiveParkIndex] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  // request permissions and start watching GPS on load
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("GPS permissions denied.");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // every 3 sec
          distanceInterval: 2, // or every 2 meters you move
        },
        (newLocation) => {
          setLocation(newLocation);
          // Polygon Math
          setActiveParkIndex((currentIndex) => {
            const targetPark = ROUTE_DATA[currentIndex];

            if (targetPark && targetPark.boundary) {
              const insidePark = isPointInPolygon(
                {
                  latitude: newLocation.coords.latitude,
                  longitude: newLocation.coords.longitude,
                },
                targetPark.boundary,
              );

              if (insidePark && currentIndex < ROUTE_DATA.length - 1) {
                return currentIndex + 1;
              }
            }
            return currentIndex; // If not inside, stay on the current park
          });
        },
      );
    };
    startLocationTracking();

    // cleanup the GPS watcher if the component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // save progress to local storage and load state on boot
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedIndex = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedIndex !== null) {
          setActiveParkIndex(parseInt(savedIndex, 10));
        }
      } catch (err) {
        console.error("Failed to load ride progress from storage.", err);
      }
    };
    loadProgress();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 🛰️   DEBUG   */}
      <View style={styles.gpsBanner}>
        <Text style={styles.gpsText}>
          {locationError
            ? `⚠️ ${locationError}`
            : location
              ? `🛰️ Live: ${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}`
              : "🛰️ Searching for GPS signal..."}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <View style={styles.timelineColumn}>
            <View style={[styles.node, styles.nodeCompleted]} />
            <View
              style={[
                styles.line,
                activeParkIndex > 0
                  ? styles.lineCompleted
                  : styles.lineUpcoming,
              ]}
            />
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.parkName, styles.myLocationText]}>
              My Location
            </Text>
          </View>
        </View>
        {ROUTE_DATA.map((park, index) => {
          const isLastPark = index === ROUTE_DATA.length - 1;

          const isCompleted = index < activeParkIndex;
          const isActive = index === activeParkIndex;
          const isUpcoming = index > activeParkIndex;

          return (
            <View key={park.id} style={styles.row}>
              <View style={styles.timelineColumn}>
                <View
                  style={[
                    styles.node,
                    isCompleted && styles.nodeCompleted,
                    isActive && styles.nodeActive,
                    isUpcoming && styles.nodeUpcoming,
                  ]}
                />
                {!isLastPark && (
                  <View
                    style={[
                      styles.line,
                      isCompleted ? styles.lineCompleted : styles.lineUpcoming,
                    ]}
                  />
                )}
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.parkName}>{park.name}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131314",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  row: {
    flexDirection: "row",
  },
  timelineColumn: {
    alignItems: "center",
    width: 40,
  },
  // --- NODE STYLES ---
  node: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#444746",
  },
  nodeCompleted: {
    backgroundColor: "#a8c7fa",
  },
  nodeActive: {
    backgroundColor: "#a8c7fa",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#004a77",
  },
  nodeUpcoming: {},
  // --- TRACK LINE STYLES ---
  line: {
    height: 60,
    width: 3,
  },
  lineCompleted: {
    backgroundColor: "#a8c7fa",
  },
  lineUpcoming: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#444746",
  },
  // --- TEXT STYLES ---
  textColumn: {
    flex: 1,
    paddingLeft: 15,
  },
  parkName: {
    fontSize: 18,
    color: "#e3e3e3",
    fontWeight: "600",
    marginTop: -3,
  },
  myLocationText: {
    color: "#a8c7fa",
    fontStyle: "italic",
  },
  // --- GPS BANNER STYLES ---
  gpsBanner: {
    backgroundColor: "#004a77",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  gpsText: {
    color: "#e3e3e3",
    fontWeight: "bold",
    fontSize: 14,
  },
});
