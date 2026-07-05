import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PARKS } from "../constants/parks";
import { getNextActiveParkIndex } from "../features/ride/getNextActiveParkIndex";
import {
  requestLocationPermission,
  watchLocation,
} from "../services/gps/locationService";
import {
  loadActiveParkIndex,
  saveActiveParkIndex,
} from "../services/storage/rideProgressStorage";
import { GpsStatusBanner } from "@/components/ride/GpsStatusBanner";

export default function HomeScreen() {
  const [activeParkIndex, setActiveParkIndex] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  // --- request permissions and start watching GPS on load
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        setLocationError("GPS permissions denied.");
        return;
      }

      locationSubscription = await watchLocation((newLocation) => {
        setLocation(newLocation);

        // --- check if we are inside polygon area
        // --- check if we reached the next park
        setActiveParkIndex((currentIndex) =>
          getNextActiveParkIndex({
            currentIndex,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            parks: PARKS,
          }),
        );
      });
    };
    startLocationTracking();

    return () => {
      locationSubscription?.remove(); // cleanup the GPS watcher when component unmounts
    };
  }, []);

  // load ride progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedIndex = await loadActiveParkIndex();
        setActiveParkIndex(savedIndex);
      } catch (err) {
        console.error("Failed to load ride progress from storage.", err);
      }
    };

    loadProgress();
  }, []);

  // save ride progress
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await saveActiveParkIndex(activeParkIndex);
      } catch (err) {
        console.error("Failed to save ride progress.", err);
      }
    };
    saveProgress();
  }, [activeParkIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <GpsStatusBanner location={location} locationError={locationError} />

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
        {PARKS.map((park, index) => {
          const isLastPark = index === PARKS.length - 1;

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
