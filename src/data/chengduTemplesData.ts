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

/** 成都默认种子数据（可被 Firestore chengdu_temples 覆盖） */
export const chengduTemplesData: Temple[] = [
  {
    id: "chengdu_temples_buddhism_001",
    name: "文殊院",
    location: "成都市青羊区文殊院街66号",
    religion: "buddhism",
    establishedYear: 605,
    status: "active",
    description: "成都著名的汉传佛教寺院，川西“四大丛林”之一，香火旺盛。",
    coreArchitecture:
      "中轴对称寺院格局，天王殿、大雄宝殿、说法堂等依次展开；院内古木、碑刻与佛教艺术并存。",
    openingHours: "每日 08:00–17:00（以现场公告为准）",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Wenshu_Monastery.jpg",
    coordinates: [104.0712, 30.6765],
    relatedPeople: [],
    ...emptyMeta,
  },
  {
    id: "chengdu_temples_taoism_001",
    name: "青羊宫",
    location: "成都市青羊区一环路西二段9号",
    religion: "taoism",
    establishedYear: 618,
    status: "active",
    description: "成都最重要的道教宫观之一，与老子传说及蜀地道教传统密切相关。",
    coreArchitecture:
      "三清殿、斗姥殿、八卦亭等为主要建筑；八卦亭石雕精美，是青羊宫标志。",
    openingHours: "每日 08:00–18:00",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Qingyang_Palace.jpg",
    coordinates: [104.0418, 30.6608],
    relatedPeople: [],
    ...emptyMeta,
    aliases: "青羊观",
  },
  {
    id: "chengdu_temples_catholic_001",
    name: "平安桥天主堂",
    location: "成都市青羊区西华门街25号",
    religion: "catholic",
    establishedYear: 1897,
    status: "active",
    description: "成都重要的天主教堂，罗马式建筑风格，是近代成都天主教传播的重要见证。",
    coreArchitecture:
      "罗马式砖石结构，高大中殿与钟楼构成主要立面；内部空间纵深感强。",
    openingHours: "每日 08:00–17:00（弥撒时间以堂内公告为准）",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Ping_An_Bridge_Church.jpg",
    coordinates: [104.0635, 30.6702],
    relatedPeople: [],
    ...emptyMeta,
  },
  {
    id: "chengdu_temples_islam_001",
    name: "皇城清真寺",
    location: "成都市青羊区西华门街",
    religion: "islam",
    establishedYear: 1600,
    status: "active",
    description: "成都重要的伊斯兰教清真寺，服务本地穆斯林社群礼拜与文化活动。",
    coreArchitecture:
      "中式院落与伊斯兰礼拜空间结合，礼拜大殿为核心建筑。",
    openingHours: "每日 08:00–17:00（礼拜时段以现场为准）",
    imageUrl: "",
    coordinates: [104.062, 30.668],
    relatedPeople: [],
    ...emptyMeta,
  },
];
