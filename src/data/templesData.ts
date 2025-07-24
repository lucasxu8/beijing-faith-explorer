import { Temple } from "@/types/temple";

// 重庆地区宗教场所数据
export const templesData: Temple[] = [
  {
    id: "cq1",
    name: "重庆大足石刻宝顶山石窟",
    location: "重庆市大足区",
    religion: "buddhism",
    establishedYear: 1179,
    status: "active",
    description: "大足石刻是重庆大足区境内主要表现为摩崖造像的石窟艺术的总称，为联合国世界文化遗产。",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
    coordinates: [105.7242, 29.7056] as [number, number],
    relatedPeople: ["赵智凤"],
    relatedEvents: ["1179年开凿", "1999年列入世界遗产"]
  },
  {
    id: "cq2", 
    name: "重庆慈云寺",
    location: "重庆市南岸区",
    religion: "buddhism",
    establishedYear: 1927,
    status: "active",
    description: "慈云寺位于重庆南岸区玄坛庙狮子山，是重庆市著名的佛教寺院之一。",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
    coordinates: [106.5805, 29.5647] as [number, number],
    relatedPeople: ["太虚法师"],
    relatedEvents: ["1927年重建", "现代修复"]
  },
  {
    id: "cq3",
    name: "重庆华岩寺",
    location: "重庆市九龙坡区",
    religion: "buddhism", 
    establishedYear: 1650,
    status: "active",
    description: "华岩寺位于重庆市九龙坡区华岩镇，始建于清顺治七年，是重庆市著名的佛教寺院。",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
    coordinates: [106.4647, 29.4774] as [number, number],
    relatedPeople: ["寂光法师"],
    relatedEvents: ["1650年建寺", "现代重修"]
  },
  {
    id: "cq4",
    name: "重庆老君洞道观",
    location: "重庆市南岸区",
    religion: "taoism",
    establishedYear: 1700,
    status: "active", 
    description: "老君洞道观位于重庆南岸区黄桷垭附近，是重庆著名的道教宫观。",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
    coordinates: [106.6158, 29.5086] as [number, number],
    relatedPeople: ["张三丰传人"],
    relatedEvents: ["1700年建观", "现代修缮"]
  },
  {
    id: "cq5",
    name: "重庆天主教堂（若瑟堂）",
    location: "重庆市渝中区",
    religion: "catholic",
    establishedYear: 1900,
    status: "active",
    description: "若瑟堂位于重庆市渝中区民生路，是重庆重要的天主教教堂。",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
    coordinates: [106.5692, 29.5628] as [number, number],
    relatedPeople: ["法国传教士"],
    relatedEvents: ["1900年建堂", "现代修复"]
  },
  {
    id: "cq6",
    name: "重庆清真寺",
    location: "重庆市渝中区",
    religion: "islam",
    establishedYear: 1850,
    status: "active",
    description: "重庆清真寺位于重庆市渝中区，是重庆回族穆斯林的重要宗教活动场所。",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop", 
    coordinates: [106.5770, 29.5647] as [number, number],
    relatedPeople: ["回族商人"],
    relatedEvents: ["1850年建寺", "现代修缮"]
  },
  {
    id: "cq7",
    name: "重庆罗汉寺",
    location: "重庆市渝中区",
    religion: "buddhism",
    establishedYear: 1000,
    status: "active",
    description: "罗汉寺位于重庆市渝中区民族路，始建于北宋治平年间，是重庆最古老的佛教寺院之一。",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
    coordinates: [106.5692, 29.5647] as [number, number],
    relatedPeople: ["智真法师"],
    relatedEvents: ["1000年建寺", "明清重修", "现代保护"]
  },
  {
    id: "cq8",
    name: "重庆绍龙观",
    location: "重庆市渝北区",
    religion: "taoism",
    establishedYear: 1368,
    status: "active",
    description: "绍龙观位于重庆渝北区，是重庆地区重要的道教宫观之一。",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
    coordinates: [106.6435, 29.7167] as [number, number],
    relatedPeople: ["道教宗师"],
    relatedEvents: ["1368年建观", "历代修缮"]
  },
  {
    id: "cq9",
    name: "重庆双桂堂",
    location: "重庆市梁平区",
    religion: "buddhism",
    establishedYear: 1653,
    status: "active",
    description: "双桂堂位于重庆梁平区金带镇，由破山禅师创建，是西南地区著名的佛教寺院。",
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
    coordinates: [107.8000, 30.6742] as [number, number],
    relatedPeople: ["破山禅师"],
    relatedEvents: ["1653年创建", "清代兴盛", "现代修复"]
  }
]; 