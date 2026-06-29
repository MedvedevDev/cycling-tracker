import { Coordinate } from "@/types/location";

export function isPointInPolygon(point: Coordinate, polygon: Coordinate[]) {
  let isInside = false;
  const x = point.latitude;
  const y = point.longitude;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;

    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}
