export interface Temple {
  id: string;
  name: string;
  location: string;
  religion: "buddhism" | "taoism" | "catholic" | "islam";
  establishedYear: number;
  status: "active" | "renovation" | "ruins";
  description: string;
  historicalBackground: string;
  architecturalFeatures: string;
  openingHours: string;
  imageUrl: string;
  coordinates: [number, number];
  relatedPeople: string[];
  relatedEvents: string[];
  /** 义工情况（可选） */
  volunteers: string;
  /** 祈福方式（可选） */
  prayerBlessing: string;
  /** 香火情况（可选） */
  incenseStatus: string;
  /** 寺庙注意事项（可选） */
  templeNotes: string;
  /** 固定活动 / 重大佛教节日（可选） */
  fixedActivitiesFestivals: string;
  /** 门票（可选） */
  tickets: string;
}
