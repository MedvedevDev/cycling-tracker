import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Park } from "@/types/location";

type RouteTimelineProps = {
  parks: Park[];
  activeParkIndex: number;
};

export function RouteTimeline({ parks, activeParkIndex }: RouteTimelineProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        <View style={styles.timelineColumn}>
          <View style={[styles.node, styles.nodeCompleted]} />
          <View
            style={[
              styles.line,
              activeParkIndex > 0 ? styles.lineCompleted : styles.lineUpcoming,
            ]}
          />
        </View>
        <View style={styles.textColumn}>
          <Text style={[styles.parkName, styles.myLocationText]}>
            My Location
          </Text>
        </View>
      </View>
      {parks.map((park, index) => {
        const isLastPark = index === parks.length - 1;

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
  );
}

const styles = StyleSheet.create({
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
});
