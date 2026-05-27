import { Temple } from "@/types/temple";

// Beijing Faith Map Data
export const templesData: Temple[] = [
  {
    id: "church_001",
    name: "St. Joseph’s Cathedral 东堂（王府井天主教堂）",
    location: "北京市东城区王府井大街74号",
    religion: "catholic",
    establishedYear: 1655,
    status: "active",
    description: "北京最著名的天主教堂之一，始建于清顺治年间，现为北京天主教爱国会重要教堂，哥特式建筑风格。",
    historicalBackground:
      "始建于清顺治十二年（1655年），是北京最早的天主教堂之一。1900年义和团运动中被焚毁，1904年在原址重建，历经多次修缮，见证了北京近代中西文化交流史。",
    architecturalFeatures:
      "哥特式风格，尖拱窗、玫瑰窗与高耸钟楼为主要特征；立面以石材与红砖砌筑，内部中殿纵深感强，祭坛区装饰精美。",
    openingHours: "周一至周日 08:00–17:00（弥撒时间以堂内公告为准）",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Wangfujing_Cathedral_Beijing.jpg",
    coordinates: [116.404, 39.915],
    relatedPeople: ["利玛窦（间接影响）", "清代传教士"],
    relatedEvents: ["1655年建立", "1900年被毁", "1904年重建"],
  },
  {
    id: "temple_001",
    name: "雍和宫",
    location: "北京市东城区雍和宫大街12号",
    religion: "buddhism",
    establishedYear: 1694,
    status: "active",
    description: "北京香火最旺的藏传佛教寺院，曾为雍正帝府邸，后改为皇家寺庙。",
    historicalBackground:
      "原为雍正帝即位前的贝勒府，雍正三年（1725年）改为行宫，乾隆九年（1744年）正式改为藏传佛教格鲁派寺院，成为清代皇家藏传佛教活动中心。",
    architecturalFeatures:
      "汉藏合璧布局，沿中轴线依次为牌楼、昭泰门、天王殿、雍和宫大殿、永佑殿、法轮殿、万福阁；万福阁内供奉巨型弥勒佛像，为全寺标志。",
    openingHours: "每日 09:00–16:30（16:00 停止售票，节假日可能调整）",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Yonghe_Temple_Beijing.jpg",
    coordinates: [116.417, 39.949],
    relatedPeople: ["雍正帝", "乾隆帝"],
    relatedEvents: ["1694年建成", "1722年改为行宫", "1744年改为寺庙"],
  },
  {
    id: "temple_002",
    name: "白云观",
    location: "北京市西城区白云观街9号",
    religion: "taoism",
    establishedYear: 739,
    status: "active",
    description: "中国道教全真派祖庭之一，北京最重要的道教宫观。",
    historicalBackground:
      "唐代时称天长观，金代改名白云观；元代丘处机曾在此传道，明清多次重修，是全真派龙门祖庭，在北京道教史上地位崇高。",
    architecturalFeatures:
      "中轴对称宫观格局，山门、灵官殿、玉皇殿、老律堂等依次展开；山门两侧石狮、院内古碑与松柏相映，体现传统道观清幽肃穆之气。",
    openingHours: "每日 08:30–16:00",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/White_Cloud_Temple_Beijing.jpg",
    coordinates: [116.35, 39.906],
    relatedPeople: ["丘处机"],
    relatedEvents: ["唐代创建", "元代扩建", "现存建筑多为明清时期"],
  },
  {
    id: "mosque_001",
    name: "牛街清真寺",
    location: "北京市西城区牛街18号",
    religion: "islam",
    establishedYear: 996,
    status: "active",
    description: "北京历史最悠久、规模最大的清真寺，是中国伊斯兰文化重要象征。",
    historicalBackground:
      "辽统和五年（996年）始建，元明清屡经扩建；是北京回族穆斯林重要的宗教与文化中心，见证城市穆斯林社群千年历史。",
    architecturalFeatures:
      "中式宫殿式布局与伊斯兰装饰元素结合，望月楼、礼拜大殿、邦克楼等为核心建筑；大殿内装饰简洁庄重，体现伊斯兰美学。",
    openingHours: "每日 08:00–17:00（礼拜时间对外开放情况以现场为准）",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Niujie_Mosque_Beijing.jpg",
    coordinates: [116.37, 39.891],
    relatedPeople: ["元代穆斯林社群"],
    relatedEvents: ["辽代创建", "明清多次修缮"],
  },
  {
    id: "church_002",
    name: "崇文门基督教堂",
    location: "北京市东城区崇文门内大街",
    religion: "catholic",
    establishedYear: 1870,
    status: "active",
    description: "北京重要的新教教堂之一，是中国基督教三自爱国运动的重要场所。",
    historicalBackground:
      "1870年由伦敦会传教士建立，初名亚斯立堂；历经清末、民国及新中国各时期变迁，是北京新教发展的重要见证地之一。",
    architecturalFeatures:
      "砖木结构教堂建筑，立面简洁典雅，尖拱门窗与钟楼体现哥特复兴风格影响；内部空间以中殿为主，采光良好。",
    openingHours: "周二至周日 09:00–17:00（周一闭馆维护，礼拜活动以堂内通知为准）",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Chongwenmen_Church_Beijing.jpg",
    coordinates: [116.424, 39.9],
    relatedPeople: ["伦敦会传教士"],
    relatedEvents: ["1870年建立", "文化大革命关闭", "1980年代恢复"],
  },
];
