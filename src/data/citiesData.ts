export interface City {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  route?: string;
  available: boolean;
}

export const citiesData: City[] = [
  {
    id: "beijing",
    name: "北京",
    description: "六朝古都，汉传、藏传、伊斯兰与天主教文化交汇之地。",
    highlights: ["雍和宫", "东堂", "牛街清真寺"],
    route: "/beijing",
    available: true,
  },
  {
    id: "shanghai",
    name: "上海",
    description: "近代开埠城市，中西宗教建筑并存。",
    highlights: ["徐家汇天主堂", "静安寺", "小桃园清真寺"],
    available: false,
  },
  {
    id: "xian",
    name: "西安",
    description: "丝绸之路起点，佛教、道教与伊斯兰文化重镇。",
    highlights: ["大雁塔", "化觉巷清真寺", "楼观台"],
    available: false,
  },
  {
    id: "chengdu",
    name: "成都",
    description: "巴蜀文化中心，佛道并存、多元信仰共生。",
    highlights: ["文殊院", "青羊宫", "平安桥天主堂"],
    available: false,
  },
  {
    id: "chongqing",
    name: "重庆",
    description: "山城江湖气与码头文化中的宗教遗存。",
    highlights: ["罗汉寺", "华岩寺", "通远门教堂"],
    available: false,
  },
  {
    id: "nanjing",
    name: "南京",
    description: "六朝古都，佛教与基督教传播的重要节点。",
    highlights: ["鸡鸣寺", "毗卢寺", "莫愁路天主堂"],
    available: false,
  },
  {
    id: "hangzhou",
    name: "杭州",
    description: "江南佛国，灵隐文化与西湖周边宗教景观。",
    highlights: ["灵隐寺", "凤凰寺", "天主堂"],
    available: false,
  },
  {
    id: "guangzhou",
    name: "广州",
    description: "海上丝绸之路门户，岭南多元信仰荟萃。",
    highlights: ["光孝寺", "怀圣寺", "石室圣心大教堂"],
    available: false,
  },
  {
    id: "wuhan",
    name: "武汉",
    description: "九省通衢，长江沿岸宗教文化走廊。",
    highlights: ["归元寺", "长春观", "上海路天主堂"],
    available: false,
  },
  {
    id: "tianjin",
    name: "天津",
    description: "近代租界历史下的教堂与本土宫观并存。",
    highlights: ["天后宫", "望海楼教堂", "清真大寺"],
    available: false,
  },
  {
    id: "lhasa",
    name: "拉萨",
    description: "藏传佛教圣地，雪域高原信仰中心。",
    highlights: ["布达拉宫", "大昭寺", "色拉寺"],
    available: false,
  },
  {
    id: "quanzhou",
    name: "泉州",
    description: "宋元海洋贸易都会，世界宗教博物馆。",
    highlights: ["开元寺", "清净寺", "天后宫"],
    available: false,
  },
];
