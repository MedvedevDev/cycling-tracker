import AsyncStorage from "@react-native-async-storage/async-storage";

// local storage key
const STORAGE_KEY = "@elbe_ride_active_index";

export async function loadActiveParkIndex() {
  const savedIndex = await AsyncStorage.getItem(STORAGE_KEY);

  if (savedIndex === null) {
    return 0;
  }

  const parsedIndex = Number.parseInt(savedIndex, 10);

  return Number.isNaN(parsedIndex) ? 0 : parsedIndex;
}

export async function saveActiveParkIndex(index: number) {
  await AsyncStorage.setItem(STORAGE_KEY, String(index));
}
