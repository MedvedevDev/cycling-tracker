import { Park } from "../types/location";

export const PARKS: Park[] = [
  {
    id: "1",
    name: "Jenischpark",
    boundary: [
      { latitude: 53.556, longitude: 9.86 },
      { latitude: 53.556, longitude: 9.872 },
      { latitude: 53.547, longitude: 9.872 },
      { latitude: 53.547, longitude: 9.86 },
    ],
  },
  {
    id: "2",
    name: "Hirsch Park",
    boundary: [
      { latitude: 53.559, longitude: 9.818 },
      { latitude: 53.559, longitude: 9.83 },
      { latitude: 53.551, longitude: 9.83 },
      { latitude: 53.551, longitude: 9.818 },
    ],
  },
  {
    id: "3",
    name: "Waldpark Falkenstein",
    boundary: [
      { latitude: 53.575, longitude: 9.75 },
      { latitude: 53.575, longitude: 9.785 },
      { latitude: 53.56, longitude: 9.785 },
      { latitude: 53.56, longitude: 9.75 },
    ],
  },
  {
    id: "4",
    name: "Klövensteen",
    boundary: [
      { latitude: 53.598, longitude: 9.732 },
      { latitude: 53.598, longitude: 9.748 },
      { latitude: 53.588, longitude: 9.748 },
      { latitude: 53.588, longitude: 9.732 },
    ],
  },
  { id: "5", name: "Hetlinger Schanze" },
  { id: "6", name: "Haseldorfer Marsch" },
  { id: "7", name: "Stadtpark Glückstadt" },
];
