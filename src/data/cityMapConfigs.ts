export type CityMapId = "beijing" | "shanghai";

export interface CityMapConfig {
  id: CityMapId;
  name: string;
  center: [number, number];
  zoom: number;
  maxBounds: [[number, number], [number, number]];
}

export const cityMapConfigs: Record<CityMapId, CityMapConfig> = {
  beijing: {
    id: "beijing",
    name: "北京",
    center: [116.4, 39.9],
    zoom: 11,
    maxBounds: [
      [115.0, 39.4],
      [117.2, 40.5],
    ],
  },
  shanghai: {
    id: "shanghai",
    name: "上海",
    center: [121.4737, 31.2304],
    zoom: 11,
    maxBounds: [
      [120.85, 30.7],
      [122.0, 31.55],
    ],
  },
};
