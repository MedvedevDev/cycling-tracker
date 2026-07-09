import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PARKS } from "../constants/parks";
import { GpsStatusBanner } from "@/components/ride/GpsStatusBanner";
import { RouteTimeline } from "@/components/ride/RouteTImeline";
import { useRideProgress } from "@/features/ride/useRideProgress";

export default function HomeScreen() {
  const { activeParkIndex, location, locationError, parks } = useRideProgress();

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
