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
  const [mapboxToken, setMapboxToken] = useState('pk.eyJ1IjoiZmFpdGhtYXAiLCJhIjoiY21kNGIwdGhoMGYyczJrb29xMXRtdXJndCJ9.rmmK4c2BTfqFvwNmpXcLhQ');

  // 重庆地区宗教场所数据
  const temples: Temple[] = [
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

    // Initialize map focused on Chongqing area
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapboxStyle(mapStyle),
      center: [106.5805, 29.5647], // Chongqing center
      zoom: 9, // 更适合重庆市区的缩放级别
      pitch: 0, // 减少倾斜角度
      bearing: 0,
      antialias: true,
      maxBounds: [
        [104.0, 28.0], // 西南边界
        [110.0, 32.0]  // 东北边界
      ] // 限制地图范围在重庆周边
    });

    console.log('Map initialized');

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
      }),
      'top-right'
    );

    // Wait for map to load before adding markers
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      updateMarkers();
    });

    map.current.on('error', (e) => {
      console.error('Map error:', e);
    });

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
    if (!map.current) {
      console.log('Map not ready yet');
      return;
    }

    console.log('Updating markers - map ready');
    console.log('Filtered temples count:', filteredTemples.length);
    console.log('Current year:', currentYear);

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    filteredTemples.forEach((temple, index) => {
      console.log(`Creating marker ${index + 1} for:`, temple.name, 'at coordinates:', temple.coordinates);
      
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
      el.style.position = 'relative';
      el.style.zIndex = '10';

      // 增强点击区域
      el.style.minWidth = '20px';
      el.style.minHeight = '20px';
      el.style.padding = '3px';

      el.addEventListener('mouseenter', () => {
        el.style.zIndex = '1000';
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
        el.style.border = '3px solid white';
      });

      el.addEventListener('mouseleave', () => {
        el.style.zIndex = '10';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.border = '2px solid white';
      });

      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat(temple.coordinates)
          .addTo(map.current!);

        console.log(`Marker ${index + 1} added successfully`);

        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('Marker clicked:', temple.name);
          onTempleSelect(temple);
        });

        markers.current.push(marker);
      } catch (error) {
        console.error(`Failed to create marker for ${temple.name}:`, error);
      }
    });

    console.log('Total markers created:', markers.current.length);
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