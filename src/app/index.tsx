import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {ROUTE_DATA.map((park, index) => {
          const isLastPark = index === ROUTE_DATA.length - 1;

          return (
            <View key={park.id} style={styles.row}>
              <View style={styles.timelineColumn}>
                <View style={styles.node} />
                {!isLastPark && <View style={styles.line} />}
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
  node: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#a8c7fa",
  },
  line: {
    width: 4,
    height: 60,
    backgroundColor: "#444746",
  },
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
});
