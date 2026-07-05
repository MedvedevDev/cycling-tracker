import * as Location from "expo-location";

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  return status === "granted";
}

export async function getCurrentLocation() {
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
}

export async function watchLocation(
  callback: (location: Location.LocationObject) => void,
) {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
      distanceInterval: 2,
    },
    callback,
  );
}
