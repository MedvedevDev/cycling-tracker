import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ROUTE_DATA = [
  { id: "1", name: "Jenischpark" },
  { id: "2", name: "Hirsch Park" },
  { id: "3", name: "Waldpark Falkenstein" },
  { id: "4", name: "Klövensteen" },
  { id: "5", name: "Hetlinger Schanze" },
  { id: "6", name: "Haseldorfer Marsch" },
  { id: "7", name: "Stadtpark Glückstadt" },
];

export default function HomeScreen() {
  const [activeParkIndex, setActiveParkIndex] = useState(0);

  // button handlers
  const nextPark = () => {
    if (activeParkIndex < ROUTE_DATA.length - 1) {
      setActiveParkIndex(activeParkIndex + 1);
    }
  };

  const previousPark = () => {
    if (activeParkIndex > 0) {
      setActiveParkIndex(activeParkIndex - 1);
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
