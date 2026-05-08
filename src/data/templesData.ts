import { Temple } from "@/types/temple";

// Chongqing Faith Map Data
export const templesData: Temple[] = [
  {
    id: "church_001",
    name: "St. Joseph’s Cathedral 东堂（王府井天主教堂）",
    location: "北京市东城区王府井大街74号",
    religion: "catholic",
    establishedYear: 1655,
    status: "active",
    description: "北京最著名的天主教堂之一，始建于清顺治年间，现为北京天主教爱国会重要教堂，哥特式建筑风格。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Wangfujing_Cathedral_Beijing.jpg",
    coordinates: [116.404, 39.915],
    relatedPeople: ["利玛窦（间接影响）", "清代传教士"],
    relatedEvents: ["1655年建立", "1900年被毁", "1904年重建"]
  },
  {
    id: "temple_001",
    name: "雍和宫",
    location: "北京市东城区雍和宫大街12号",
    religion: "buddhism",
    establishedYear: 1694,
    status: "active",
    description: "北京香火最旺的藏传佛教寺院，曾为雍正帝府邸，后改为皇家寺庙。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Yonghe_Temple_Beijing.jpg",
    coordinates: [116.417, 39.949],
    relatedPeople: ["雍正帝", "乾隆帝"],
    relatedEvents: ["1694年建成", "1722年改为行宫", "1744年改为寺庙"]
  },
  {
    id: "temple_002",
    name: "白云观",
    location: "北京市西城区白云观街9号",
    religion: "taoism",
    establishedYear: 739,
    status: "active",
    description: "中国道教全真派祖庭之一，北京最重要的道教宫观。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/White_Cloud_Temple_Beijing.jpg",
    coordinates: [116.350, 39.906],
    relatedPeople: ["丘处机"],
    relatedEvents: ["唐代创建", "元代扩建", "现存建筑多为明清时期"]
  },
  {
    id: "mosque_001",
    name: "牛街清真寺",
    location: "北京市西城区牛街18号",
    religion: "islam",
    establishedYear: 996,
    status: "active",
    description: "北京历史最悠久、规模最大的清真寺，是中国伊斯兰文化重要象征。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Niujie_Mosque_Beijing.jpg",
    coordinates: [116.370, 39.891],
    relatedPeople: ["元代穆斯林社群"],
    relatedEvents: ["辽代创建", "明清多次修缮"]
  },
  {
    id: "church_002",
    name: "崇文门基督教堂",
    location: "北京市东城区崇文门内大街",
    religion: "catholic",
    establishedYear: 1870,
    status: "active",
    description: "北京重要的新教教堂之一，是中国基督教三自爱国运动的重要场所。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Chongwenmen_Church_Beijing.jpg",
    coordinates: [116.424, 39.900],
    relatedPeople: ["伦敦会传教士"],
    relatedEvents: ["1870年建立", "文化大革命关闭", "1980年代恢复"]
  }
]; 