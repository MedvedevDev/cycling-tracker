import type * as Location from "expo-location";
import { StyleSheet, Text, View } from "react-native";

type GpsStatusBannerProps = {
  location: Location.LocationObject | null;
  locationError: string | null;
};

export function GpsStatusBanner({
  location,
  locationError,
}: GpsStatusBannerProps) {
  return (
    <View style={styles.gpsBanner}>
      <Text style={styles.gpsText}>
        {locationError
          ? `⚠️ ${locationError}`
          : location
            ? `🛰️ Live: ${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}`
            : "🛰️ Searching for GPS signal..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
