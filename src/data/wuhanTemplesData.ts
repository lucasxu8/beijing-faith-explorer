import { Temple } from "@/types/temple";

const emptyMeta = {
  aliases: "",
  religiousActivities: "",
  volunteers: "",
  visitorFlow: "",
  templeNotes: "",
  dataSource: "",
  collector: "",
  collectedDate: "",
  verificationNotes: "",
  tickets: "",
  fixedActivitiesFestivals: "",
};

/** 武汉默认种子数据（可被 Firestore wuhan_temples 覆盖） */
export const wuhanTemplesData: Temple[] = [
  {
    id: "wuhan_temples_buddhism_001",
    name: "归元寺",
    location: "武汉市汉阳区翠微横路20号",
    religion: "buddhism",
    establishedYear: 1658,
    status: "active",
    description: "武汉著名的佛教丛林，以五百罗汉堂闻名，是汉阳重要的宗教与文化地标。",
    coreArchitecture:
      "山门、天王殿、大雄宝殿、罗汉堂等沿中轴线展开；罗汉堂内五百罗汉造像风格鲜明。",
    openingHours: "每日 08:00–17:00（以现场公告为准）",
    imageUrl: "",
    coordinates: [114.2465, 30.5498],
    relatedPeople: [],
    ...emptyMeta,
  },
  {
    id: "wuhan_temples_taoism_001",
    name: "长春观",
    location: "武汉市武昌区武珞路269号",
    religion: "taoism",
    establishedYear: 1200,
    status: "active",
    description: "武汉重要的道教宫观，坐落于蛇山南麓，是全真派在华中地区的重要道场。",
    coreArchitecture:
      "依山而建的道观格局，三皇殿、三清殿等为主要建筑；山门与殿宇层层递进。",
    openingHours: "每日 08:00–17:00",
    imageUrl: "",
    coordinates: [114.3165, 30.5425],
    relatedPeople: [],
    ...emptyMeta,
  },
  {
    id: "wuhan_temples_catholic_001",
    name: "上海路天主堂",
    location: "武汉市江岸区上海路16号",
    religion: "catholic",
    establishedYear: 1876,
    status: "active",
    description: "武汉重要的天主教堂，近代教堂建筑风格，是汉口天主教传播的重要见证。",
    coreArchitecture:
      "砖石结构教堂建筑，钟楼与中殿构成主体；立面简洁庄重。",
    openingHours: "每日 08:00–17:00（弥撒时间以堂内公告为准）",
    imageUrl: "",
    coordinates: [114.2895, 30.5955],
    relatedPeople: [],
    ...emptyMeta,
  },
  {
    id: "wuhan_temples_islam_001",
    name: "武汉市清真寺",
    location: "武汉市硚口区",
    religion: "islam",
    establishedYear: 1800,
    status: "active",
    description: "武汉地区重要的伊斯兰教礼拜场所，服务本地穆斯林社群。",
    coreArchitecture:
      "礼拜大殿为核心建筑，中式院落与伊斯兰礼仪空间结合。",
    openingHours: "每日 08:00–17:00（礼拜时段以现场为准）",
    imageUrl: "",
    coordinates: [114.255, 30.58],
    relatedPeople: [],
    ...emptyMeta,
  },
];
