import { Park } from "@/types/location";
import { isPointInPolygon } from "@/utils/geo/isPointInPolygon";

type Params = {
  currentIndex: number;
  latitude: number;
  longitude: number;
  parks: Park[];
};

export function getNextActiveParkIndex({
  currentIndex,
  latitude,
  longitude,
  parks,
}: Params) {
  const targetPark = parks[currentIndex];

  if (!targetPark?.boundary) {
    return currentIndex;
  }

  const isInsideTargetPark = isPointInPolygon(
    { latitude, longitude },
    targetPark.boundary,
  );

  if (isInsideTargetPark && currentIndex < parks.length - 1) {
    return currentIndex + 1;
  }

  return currentIndex;
}
