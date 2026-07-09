import * as Location from "expo-location";
import { useEffect, useState } from "react";

import { PARKS } from "@/constants/parks";
import { getNextActiveParkIndex } from "@/features/ride/getNextActiveParkIndex";
import {
  getCurrentLocation,
  requestLocationPermission,
  watchLocation,
} from "@/services/gps/locationService";
import {
  loadActiveParkIndex,
  saveActiveParkIndex,
} from "@/services/storage/rideProgressStorage";

export function useRideProgress() {
  const [activeParkIndex, setActiveParkIndex] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);

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

      setActiveParkIndex((currentIndex) =>
        getNextActiveParkIndex({
          currentIndex,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          parks: PARKS,
        }),
      );

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

  return {
    activeParkIndex,
    location,
    locationError,
    parks: PARKS,
  };
}
