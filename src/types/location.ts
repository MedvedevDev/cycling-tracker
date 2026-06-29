export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Park {
  id: string;
  name: string;
  boundary?: Coordinate[];
}
