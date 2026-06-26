import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// STORAGE KEY
const STORAGE_KEY = "@elbe_ride_active_index";

const ROUTE_DATA = [
  { id: "1", name: "Jenischpark", latitude: 53.5451, longitude: 9.8669 },
  { id: "2", name: "Hirsch Park", latitude: 53.5552, longitude: 9.8242 },
  {
    id: "3",
    name: "Waldpark Falkenstein",
    latitude: 53.5601,
    longitude: 9.7614,
  },
  { id: "4", name: "Klövensteen", latitude: 53.5938, longitude: 9.7401 },
  { id: "5", name: "Hetlinger Schanze", latitude: 53.6015, longitude: 9.635 },
  { id: "6", name: "Haseldorfer Marsch", latitude: 53.6334, longitude: 9.5982 },
  {
    id: "7",
    name: "Stadtpark Glückstadt",
    latitude: 53.7912,
    longitude: 9.4245,
  },
];

export default function HomeScreen() {
  const [activeParkIndex, setActiveParkIndex] = useState(0);

  // save progress to local storage
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

  // button handlers
  const nextPark = async () => {
    if (activeParkIndex < ROUTE_DATA.length - 1) {
      const nextIndex = activeParkIndex + 1;
      setActiveParkIndex(nextIndex);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, nextIndex.toString());
      } catch (err) {
        console.error("Failed to save nextIndex.", err);
      }
    }
  };

  const previousPark = async () => {
    if (activeParkIndex > 0) {
      const prevIndex = activeParkIndex - 1;
      setActiveParkIndex(prevIndex);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, prevIndex.toString());
      } catch (err) {
        console.error("Failed to save prevIndex.", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[
            styles.button,
            activeParkIndex === 0 && styles.buttonDisabled,
          ]}
          onPress={previousPark}
          disabled={activeParkIndex === 0}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeParkIndex === ROUTE_DATA.length - 1 && styles.buttonDisabled,
          ]}
          onPress={nextPark}
          disabled={activeParkIndex === ROUTE_DATA.length - 1}
        >
          <Text style={styles.buttonText}>Move</Text>
        </TouchableOpacity>
      </View>
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

  // --- BUTTON CONTROL PANEL STYLES ---
  controlPanel: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e1f20",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2d2f31",
  },
  button: {
    flex: 1,
    backgroundColor: "#004a77",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#2d2f31",
    opacity: 0.5,
  },
  buttonText: {
    color: "#e3e3e3",
    fontWeight: "bold",
    fontSize: 16,
  },
});
