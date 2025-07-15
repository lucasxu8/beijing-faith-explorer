import { useEffect, useRef, useState } from "react";
import { Layers, ZoomIn, ZoomOut, Locate, RotateCcw, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import mapboxgl from 'mapbox-gl';

interface Temple {
  id: string;
  name: string;
  location: string;
  religion: "buddhism" | "taoism" | "folk";
  establishedYear: number;
  scale: "national" | "provincial" | "municipal" | "district";
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
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets' | 'outdoors'>('streets');
  const [zoom, setZoom] = useState(10);
  const [showClusters, setShowClusters] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');

  // Mock temple data - in real app this would come from your backend
  const temples: Temple[] = [
    {
      id: "1",
      name: "华岩寺",
      location: "南岸区华岩镇",
      religion: "buddhism",
      establishedYear: 1825,
      scale: "national",
      status: "active",
      description: "华岩寺位于重庆市南岸区华岩镇，始建于清道光五年（1825年），是重庆市区最大的佛教寺院之一。寺院建筑宏伟，香火旺盛，为国家级文物保护单位。",
      imageUrl: "/placeholder-temple.jpg",
      coordinates: [106.4817, 29.5016] as [number, number],
      relatedPeople: ["慈云老和尚", "太虚大师"],
      relatedEvents: ["1825年建寺", "1980年恢复开放", "2001年扩建"]
    },
    {
      id: "2", 
      name: "罗汉寺",
      location: "渝中区罗汉寺街",
      religion: "buddhism",
      establishedYear: 1036,
      scale: "municipal",
      status: "active",
      description: "罗汉寺始建于北宋治平年间（1036年），位于重庆市渝中区。寺内供奉五百罗汉，是重庆主城区历史最悠久的佛寺之一。",
      imageUrl: "/placeholder-temple.jpg",
      coordinates: [106.5805, 29.5647] as [number, number],
      relatedPeople: ["无际大师"],
      relatedEvents: ["1036年建寺", "明代重修", "现代修缮"]
    },
    {
      id: "3",
      name: "老君洞",
      location: "南岸区黄桷垭",
      religion: "taoism", 
      establishedYear: 1400,
      scale: "provincial",
      status: "active",
      description: "老君洞道观建于明代，位于南岸区黄桷垭，是重庆主要的道教活动场所。洞内供奉太上老君，环境清幽，是道教信众朝拜之地。",
      imageUrl: "/placeholder-temple.jpg",
      coordinates: [106.6188, 29.5155] as [number, number],
      relatedPeople: ["张三丰"],
      relatedEvents: ["明代建观", "抗战时期重修"]
    }
  ];

  const filteredTemples = temples.filter(temple => temple.establishedYear <= currentYear);

  const getReligionColor = (religion: string) => {
    switch (religion) {
      case 'buddhism': return '#FF6B35';
      case 'taoism': return '#4ECDC4';
      case 'folk': return '#45B7D1';
      default: return '#8B5A3C';
    }
  };

  const getScaleSize = (scale: string) => {
    switch (scale) {
      case 'national': return 16;
      case 'provincial': return 12;
      case 'municipal': return 10;
      case 'district': return 8;
      default: return 8;
    }
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
      case 'satellite':
        return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'outdoors':
        return 'mapbox://styles/mapbox/outdoors-v12';
      default:
        return 'mapbox://styles/mapbox/streets-v12';
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
      el.style.width = `${getScaleSize(temple.scale)}px`;
      el.style.height = `${getScaleSize(temple.scale)}px`;
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
          <div className="floating-panel p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">需要 Mapbox 访问令牌</h3>
              <p className="text-muted-foreground text-sm">
                请在 <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a> 获取您的公共访问令牌
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGt..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="floating-panel h-10 w-10 p-0"
          onClick={() => {
            if (map.current) {
              map.current.zoomIn();
            }
          }}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="floating-panel h-10 w-10 p-0"
          onClick={() => {
            if (map.current) {
              map.current.zoomOut();
            }
          }}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="floating-panel h-10 w-10 p-0"
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
          <Locate className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="floating-panel h-10 w-10 p-0"
          onClick={() => {
            if (map.current) {
              map.current.resetNorth();
            }
          }}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className="floating-panel p-4 space-y-3 min-w-[160px]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">地图样式</span>
          </div>
          
          <div className="space-y-1">
            {[
              { key: 'streets', label: '街道地图' },
              { key: 'satellite', label: '卫星图像' },
              { key: 'outdoors', label: '户外地图' }
            ].map((style) => (
              <Button
                key={style.key}
                variant={mapStyle === style.key ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs"
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
      <div className="absolute bottom-4 left-4 floating-panel p-4 z-10 max-w-xs">
        <div className="text-sm font-medium mb-3">图例</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getReligionColor('buddhism') }} />
            <span className="text-sm">佛教寺庙</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getReligionColor('taoism') }} />
            <span className="text-sm">道教宫观</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getReligionColor('folk') }} />
            <span className="text-sm">民间信仰</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-muted-foreground mb-2">规模等级</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 border border-gray-400" />
              <span className="text-xs">国家级 (16px)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400" />
              <span className="text-xs">省级 (12px)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300 border border-gray-400" />
              <span className="text-xs">其他 (8-10px)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Year Display */}
      <div className="absolute bottom-4 right-4 floating-panel p-4 z-10">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentYear}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            显示 {filteredTemples.length} 处宗教场所
          </div>
        </div>
      </div>
    </div>
  );
};