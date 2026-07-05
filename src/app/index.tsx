import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PARKS } from "../constants/parks";
import { getNextActiveParkIndex } from "../features/ride/getNextActiveParkIndex";
import {
  requestLocationPermission,
  getCurrentLocation,
  watchLocation,
} from "../services/gps/locationService";
import {
  loadActiveParkIndex,
  saveActiveParkIndex,
} from "../services/storage/rideProgressStorage";
import { GpsStatusBanner } from "@/components/ride/GpsStatusBanner";
import { RouteTimeline } from "@/components/ride/RouteTImeline";
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks";

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

      const currentLocation = await getCurrentLocation();

      setLocation(currentLocation);

      locationSubscription = await watchLocation((newLocation) => {
        setLocation(newLocation);

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

      <RouteTimeline parks={PARKS} activeParkIndex={activeParkIndex} />
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
});
