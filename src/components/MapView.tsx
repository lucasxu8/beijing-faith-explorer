import { useEffect, useRef, useState } from "react";
import { Layers, ZoomIn, ZoomOut, Locate, RotateCcw, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import mapboxgl from 'mapbox-gl';

interface Temple {
  id: string;
  name: string;
  location: string;
  religion: "buddhism" | "taoism" | "catholic" | "islam";
  establishedYear: number;
  status: "active" | "renovation" | "ruins";
  description: string;
  imageUrl: string;
  coordinates: [number, number];
  relatedPeople: string[];
  relatedEvents: string[];
}

interface MapViewProps {
  currentYear: number;
  onTempleSelect: (temple: Temple) => void;
  selectedTemple: Temple | null;
}

export const MapView = ({ currentYear, onTempleSelect, selectedTemple }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapStyle, setMapStyle] = useState<'vintage' | 'terrain'>('vintage');
  const [zoom, setZoom] = useState(10);
  const [showClusters, setShowClusters] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');

  // Real temple data for Chinese religious sites
  const temples: Temple[] = [
    // 佛教寺庙
    {
      id: "1",
      name: "少林寺",
      location: "河南省登封市",
      religion: "buddhism",
      establishedYear: 495,
      status: "active",
      description: "少林寺位于河南省登封市嵩山少室山五乳峰下，始建于北魏太和十九年（495年），是中国佛教禅宗祖庭和中国功夫的发源地，有\"禅宗祖庭，功夫圣地\"之称。",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [113.0368, 34.5097] as [number, number],
      relatedPeople: ["达摩祖师", "慧能大师", "释永信"],
      relatedEvents: ["495年建寺", "明清重修", "1982年对外开放", "2010年申遗成功"]
    },
    {
      id: "2", 
      name: "灵隐寺",
      location: "浙江省杭州市",
      religion: "buddhism",
      establishedYear: 328,
      status: "active",
      description: "灵隐寺位于杭州市西湖西北面，始建于东晋咸和三年（328年），是江南著名古刹之一。寺内建筑雄伟，佛像庄严，香火旺盛，有\"江南禅宗五山\"之一的美誉。",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      coordinates: [120.0999, 30.2417] as [number, number],
      relatedPeople: ["慧理禅师", "济公活佛"],
      relatedEvents: ["328年建寺", "五代重建", "明清扩建", "现代修复"]
    },
    {
      id: "3",
      name: "法门寺",
      location: "陕西省宝鸡市扶风县",
      religion: "buddhism",
      establishedYear: 220,
      status: "active",
      description: "法门寺位于陕西省宝鸡市扶风县，始建于东汉末年，素有\"关中塔庙始祖\"之称。因安置释迦牟尼佛指骨舍利而成为举国仰望的佛教圣地。",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
      coordinates: [107.9006, 34.4350] as [number, number],
      relatedPeople: ["玄奘法师", "不空法师"],
      relatedEvents: ["220年建寺", "唐代重修", "1987年发现地宫", "2009年新建合十舍利塔"]
    },
    // 道教宫观
    {
      id: "4",
      name: "武当山金殿",
      location: "湖北省十堰市丹江口市",
      religion: "taoism", 
      establishedYear: 1416,
      status: "active",
      description: "武当山金殿位于湖北省十堰市丹江口市武当山天柱峰顶，建于明永乐十四年（1416年），是武当山的最高胜境，供奉真武大帝，是中国道教的重要圣地。",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      coordinates: [111.0040, 32.6656] as [number, number],
      relatedPeople: ["张三丰", "明成祖朱棣"],
      relatedEvents: ["1416年建金殿", "明代全盛时期", "1994年列入世界遗产", "现代修缮保护"]
    },
    {
      id: "5",
      name: "青城山天师洞",
      location: "四川省成都市都江堰市",
      religion: "taoism",
      establishedYear: 143,
      status: "active",
      description: "青城山天师洞位于四川省成都市都江堰市，是道教发源地之一，始建于东汉顺帝汉安二年（143年）。青城山素有\"青城天下幽\"之美誉，是中国道教的重要发祥地。",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [103.5712, 30.9006] as [number, number],
      relatedPeople: ["张道陵天师", "张鲁"],
      relatedEvents: ["143年创教", "唐宋兴盛", "2000年申遗成功", "现代旅游开发"]
    },
    // 天主教堂
    {
      id: "6",
      name: "北京东堂（王府井天主堂）",
      location: "北京市东城区王府井大街",
      religion: "catholic",
      establishedYear: 1655,
      status: "active",
      description: "北京东堂位于北京市东城区王府井大街，建于清顺治十二年（1655年），是北京最古老的天主教堂之一。教堂建筑融合了中西方文化特色，是中国天主教的重要场所。",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
      coordinates: [116.4108, 39.9139] as [number, number],
      relatedPeople: ["利玛窦", "汤若望", "南怀仁"],
      relatedEvents: ["1655年建堂", "1720年重建", "1904年扩建", "现代修复开放"]
    },
    {
      id: "7",
      name: "上海徐家汇天主教堂",
      location: "上海市徐汇区蒲西路",
      religion: "catholic",
      establishedYear: 1910,
      status: "active",
      description: "上海徐家汇天主教堂位于上海市徐汇区，建于1910年，是上海最大的天主教堂，也是远东最大的哥特式建筑之一，有\"东方巴黎圣母院\"之美誉。",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      coordinates: [121.4378, 31.1956] as [number, number],
      relatedPeople: ["徐光启", "马相伯"],
      relatedEvents: ["1910年建成", "文革期间关闭", "1979年重新开放", "2013年大修完成"]
    },
    // 伊斯兰清真寺
    {
      id: "8",
      name: "西安大清真寺",
      location: "陕西省西安市莲湖区",
      religion: "islam",
      establishedYear: 742,
      status: "active",
      description: "西安大清真寺位于陕西省西安市莲湖区化觉巷，始建于唐天宝元年（742年），是中国现存规模最大、保存最完整的伊斯兰教古建筑群之一，具有浓郁的中国传统建筑风格。",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [108.9415, 34.2636] as [number, number],
      relatedPeople: ["赛典赤·赡思丁"],
      relatedEvents: ["742年创建", "明清重修", "1956年修缮", "1988年对外开放"]
    },
    {
      id: "9",
      name: "喀什艾提尕尔清真寺",
      location: "新疆维吾尔自治区喀什市",
      religion: "islam",
      establishedYear: 1442,
      status: "active",
      description: "艾提尕尔清真寺位于新疆喀什市中心，始建于1442年，是新疆规模最大的清真寺，也是全国规模最大的清真寺之一，可同时容纳2万人做礼拜。",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
      coordinates: [75.9877, 39.4677] as [number, number],
      relatedPeople: ["莎车王后裔"],
      relatedEvents: ["1442年建寺", "清代扩建", "现代修缮", "对外开放参观"]
    }
  ];

  const filteredTemples = temples.filter(temple => temple.establishedYear <= currentYear);

  const getReligionColor = (religion: string) => {
    switch (religion) {
      case 'buddhism': return '#FF6B35';
      case 'taoism': return '#4ECDC4';
      case 'catholic': return '#9B59B6';
      case 'islam': return '#2ECC71';
      default: return '#8B5A3C';
    }
  };

  const getMarkerSize = (religion: string) => {
    // All markers same size for simplicity
    return 14;
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set access token
    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapboxStyle(mapStyle),
      center: [106.5805, 29.5647], // Chongqing center
      zoom: zoom,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
      }),
      'top-right'
    );

    // Add markers for temples
    updateMarkers();

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [mapboxToken, mapStyle]);

  // Update markers when temples or year changes
  useEffect(() => {
    if (map.current) {
      updateMarkers();
    }
  }, [currentYear, filteredTemples]);

  const getMapboxStyle = (style: string) => {
    switch (style) {
      case 'vintage':
        return 'mapbox://styles/mapbox/light-v11'; // Clean, vintage feel
      case 'terrain':
        return 'mapbox://styles/mapbox/outdoors-v12';
      default:
        return 'mapbox://styles/mapbox/light-v11'; // Default to clean vintage style
    }
  };

  const updateMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    filteredTemples.forEach((temple) => {
      const el = document.createElement('div');
      el.className = 'temple-marker';
      el.style.width = `${getMarkerSize(temple.religion)}px`;
      el.style.height = `${getMarkerSize(temple.religion)}px`;
      el.style.backgroundColor = getReligionColor(temple.religion);
      el.style.border = '2px solid white';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.transition = 'all 0.3s ease';

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = 'auto';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(temple.coordinates)
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        onTempleSelect(temple);
        // Fly to temple
        map.current?.flyTo({
          center: temple.coordinates,
          zoom: 15,
          duration: 1000
        });
      });

      markers.current.push(marker);
    });
  };

  return (
    <div className="relative flex-1 h-full">
      {/* Mapbox Token Input */}
      {!mapboxToken && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel p-8 max-w-md w-full mx-4 rounded-2xl">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 golden-accent">需要 Mapbox 访问令牌</h3>
              <p className="text-muted-foreground text-sm">
                请在 <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">mapbox.com</a> 获取您的公共访问令牌
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGt..."
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                输入您的 Mapbox 公共访问令牌以启用地图功能
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden shadow-2xl" />
      
      {/* Map Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
        <Button
          variant="outline"
          size="sm"
          className="glass-panel h-12 w-12 p-0 rounded-xl border-0 hover:scale-105 transition-transform"
          onClick={() => {
            if (map.current) {
              map.current.zoomIn();
            }
          }}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="glass-panel h-12 w-12 p-0 rounded-xl border-0 hover:scale-105 transition-transform"
          onClick={() => {
            if (map.current) {
              map.current.zoomOut();
            }
          }}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="glass-panel h-12 w-12 p-0 rounded-xl border-0 hover:scale-105 transition-transform"
          onClick={() => {
            if (map.current) {
              map.current.flyTo({
                center: [106.5805, 29.5647],
                zoom: 10,
                duration: 1000
              });
            }
          }}
        >
          <Locate className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="glass-panel h-12 w-12 p-0 rounded-xl border-0 hover:scale-105 transition-transform"
          onClick={() => {
            if (map.current) {
              map.current.resetNorth();
            }
          }}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-6 left-6 z-10">
        <div className="glass-panel p-5 space-y-4 min-w-[180px] rounded-2xl">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold golden-accent">地图样式</span>
          </div>
          
          <div className="space-y-2">
            {[
              { key: 'vintage', label: '复古地图' },
              { key: 'terrain', label: '地形图' }
            ].map((style) => (
              <Button
                key={style.key}
                variant={mapStyle === style.key ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-sm rounded-lg hover:scale-105 transition-transform"
                onClick={() => {
                  setMapStyle(style.key as any);
                  if (map.current) {
                    map.current.setStyle(getMapboxStyle(style.key));
                  }
                }}
              >
                {style.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 glass-panel p-5 z-10 max-w-xs rounded-2xl">
        <div className="text-sm font-semibold mb-4 golden-accent">图例</div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: getReligionColor('buddhism') }} />
            <span className="text-sm font-medium">佛教寺庙</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: getReligionColor('taoism') }} />
            <span className="text-sm font-medium">道教宫观</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: getReligionColor('catholic') }} />
            <span className="text-sm font-medium">天主教堂</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: getReligionColor('islam') }} />
            <span className="text-sm font-medium">伊斯兰清真寺</span>
          </div>
        </div>
      </div>

      {/* Year Display */}
      <div className="absolute bottom-6 right-6 glass-panel p-6 z-10 rounded-2xl text-center">
        <div className="text-3xl font-bold golden-accent mb-2">
          {currentYear}
        </div>
        <div className="text-sm text-muted-foreground">
          显示 <span className="font-semibold text-primary">{filteredTemples.length}</span> 处宗教场所
        </div>
      </div>
    </div>
  );
};