import { useEffect, useRef, useState } from "react";
import { Layers, ZoomIn, ZoomOut, Locate, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [mapStyle, setMapStyle] = useState<'satellite' | 'historical' | 'terrain'>('satellite');
  const [zoom, setZoom] = useState(10);
  const [showClusters, setShowClusters] = useState(true);

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // In a real implementation, this would initialize Mapbox GL JS
    // For now, we'll create a mock map interface
    const mockMapElement = document.createElement('div');
    mockMapElement.className = 'w-full h-full bg-gradient-map rounded-lg flex items-center justify-center relative overflow-hidden';
    mockMapElement.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-100"></div>
      <div class="relative z-10 text-center">
        <div class="text-2xl font-bold text-primary mb-2">重庆信仰地图</div>
        <div class="text-muted-foreground mb-4">显示 ${filteredTemples.length} 个宗教场所</div>
        <div class="text-sm text-muted-foreground">当前时间: ${currentYear}年</div>
      </div>
    `;

    // Add temple markers
    filteredTemples.forEach((temple, index) => {
      const marker = document.createElement('div');
      marker.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110';
      marker.style.left = `${30 + (index % 3) * 20}%`;
      marker.style.top = `${40 + Math.floor(index / 3) * 15}%`;
      marker.style.width = `${getScaleSize(temple.scale)}px`;
      marker.style.height = `${getScaleSize(temple.scale)}px`;
      marker.style.backgroundColor = getReligionColor(temple.religion);
      marker.style.borderRadius = '50%';
      marker.style.border = '2px solid white';
      marker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      
      marker.addEventListener('click', () => onTempleSelect(temple));
      
      // Add tooltip
      marker.title = `${temple.name} (${temple.establishedYear}年)`;
      
      mockMapElement.appendChild(marker);
    });

    mapContainer.current.appendChild(mockMapElement);

    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
      }
    };
  }, [currentYear, filteredTemples, onTempleSelect]);

  return (
    <div className="relative flex-1 h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-card shadow-panel"
          onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-card shadow-panel"
          onClick={() => setZoom(prev => Math.max(prev - 1, 1))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-card shadow-panel"
        >
          <Locate className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-card shadow-panel"
          onClick={() => setZoom(10)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-card rounded-lg shadow-panel p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">地图图层</span>
          </div>
          
          <div className="space-y-1">
            {[
              { key: 'satellite', label: '卫星图' },
              { key: 'historical', label: '历史地图' },
              { key: 'terrain', label: '地形图' }
            ].map((style) => (
              <Button
                key={style.key}
                variant={mapStyle === style.key ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setMapStyle(style.key as any)}
              >
                {style.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card rounded-lg shadow-panel p-3 z-10">
        <div className="text-sm font-medium mb-2">图例</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-buddhism" />
            <span className="text-xs">佛教</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-taoism" />
            <span className="text-xs">道教</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-folk" />
            <span className="text-xs">民间信仰</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground mb-1">规模等级</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-muted border border-foreground" />
              <span className="text-xs">国家级</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted border border-foreground" />
              <span className="text-xs">省级</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted border border-foreground" />
              <span className="text-xs">其他</span>
            </div>
          </div>
        </div>
      </div>

      {/* Year Display */}
      <div className="absolute bottom-4 right-4 bg-card rounded-lg shadow-panel p-3 z-10">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{currentYear}</div>
          <div className="text-xs text-muted-foreground">显示 {filteredTemples.length} 处</div>
        </div>
      </div>
    </div>
  );
};