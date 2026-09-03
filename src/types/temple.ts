export interface Temple {
  id: string;
  /** 寺庙名称 */
  name: string;
  /** 别名/曾用名 */
  aliases: string;
  /** 宗教类型 */
  religion: "buddhism" | "taoism" | "catholic" | "islam";
  /** 地址 */
  location: string;
  /** [经度, 纬度] */
  coordinates: [number, number];
  /** 现状 */
  status: "active" | "renovation" | "ruins";
  /** 始建年代（年份，用于筛选） */
  establishedYear: number;
  /** 简介 */
  description: string;
  /** 核心建筑 */
  coreArchitecture: string;
  /** 开放时间 */
  openingHours: string;
  /** 门票 */
  tickets: string;
  /** 固定活动/重大宗教节日 */
  fixedActivitiesFestivals: string;
  /** 相关人物 */
  relatedPeople: string[];
  /** 宗教活动内容 */
  religiousActivities: string;
  /** 义工情况 */
  volunteers: string;
  /** 人流/香火情况 */
  visitorFlow: string;
  /** 寺庙注意事项 */
  templeNotes: string;
  /** 数据来源 */
  dataSource: string;
  /** 采集人 */
  collector: string;
  /** 采集日期 */
  collectedDate: string;
  /** 照片链接 */
  imageUrl: string;
  /** 待核实备注 */
  verificationNotes: string;
}

export type TempleFormState = {
  name: string;
  aliases: string;
  religion: Temple["religion"];
  location: string;
  lng: number;
  lat: number;
  status: Temple["status"];
  establishedYear: number;
  description: string;
  coreArchitecture: string;
  openingHours: string;
  tickets: string;
  fixedActivitiesFestivals: string;
  relatedPeopleText: string;
  religiousActivities: string;
  volunteers: string;
  visitorFlow: string;
  templeNotes: string;
  dataSource: string;
  collector: string;
  collectedDate: string;
  imageUrl: string;
  verificationNotes: string;
};
