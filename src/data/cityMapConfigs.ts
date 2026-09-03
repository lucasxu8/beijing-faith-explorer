export type CityMapId = "beijing" | "shanghai" | "chengdu";

export interface CityMapConfig {
  id: CityMapId;
  name: string;
  center: [number, number];
  zoom: number;
}

export const cityMapConfigs: Record<CityMapId, CityMapConfig> = {
  beijing: {
    id: "beijing",
    name: "北京",
    center: [116.4, 39.9],
    zoom: 11,
  },
  shanghai: {
    id: "shanghai",
    name: "上海",
    center: [121.4737, 31.2304],
    zoom: 11,
  },
  chengdu: {
    id: "chengdu",
    name: "成都",
    center: [104.0665, 30.5723],
    zoom: 11,
  },
};
