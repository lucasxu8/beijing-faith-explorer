import { useEffect, useRef, useState } from "react";
import { Layers, ZoomIn, ZoomOut, Locate, RotateCcw, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Temple } from "@/types/temple";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  currentYear: number;
  onTempleSelect: (temple: Temple) => void;
  selectedTemple: Temple | null;
  selectedReligions?: string[];
  temples: Temple[]; // 新增：从父组件接收寺庙数据
}

export const MapView = ({ currentYear, onTempleSelect, selectedTemple, selectedReligions = [], temples }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapStyle, setMapStyle] = useState<'vintage' | 'terrain'>('vintage');
  const [zoom, setZoom] = useState(10);
  const [showClusters, setShowClusters] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('pk.eyJ1IjoiZmFpdGhtYXAiLCJhIjoiY21kNGIwdGhoMGYyczJrb29xMXRtdXJndCJ9.rmmK4c2BTfqFvwNmpXcLhQ');

  const filteredTemples = temples.filter(temple => {
    const yearFilter = temple.establishedYear <= currentYear;
    const religionFilter = selectedReligions.length === 0 || selectedReligions.includes(temple.religion);
    return yearFilter && religionFilter;
  });

  const getReligionColor = (religion: string) => {
    switch (religion) {
      case 'buddhism': return '#FF6B35';
      case 'taoism': return '#4ECDC4';
      case 'catholic': return '#9B59B6';
      case 'islam': return '#2ECC71';
      default: return '#8B5A3C';
    }
  };

  const getReligionIcon = (religion: string) => {
    switch (religion) {
      case "buddhism":
        return "🏯";
      case "catholic":
        return "⛪";
      case "islam":
        return "🕌";
      case "taoism":
        return "⛩️";
      default:
        return "🏛️";
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
      center: [116.40, 39.90], // Chongqing center
      zoom: 11, // 更适合重庆市区的缩放级别
      pitch: 0, // 减少倾斜角度
      bearing: 0,
      antialias: true,
      maxBounds: [
      [115.0, 39.4], // 西南
      [117.2, 40.5]  // 东北
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
      applyChineseLabels();
      updateMarkers();
    });

    map.current.on('styledata', () => {
      applyChineseLabels();
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

  // Update markers when temples or filters change
  useEffect(() => {
    if (map.current) {
      updateMarkers();
    }
  }, [temples, currentYear, selectedReligions]);

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

  const applyChineseLabels = () => {
    if (!map.current?.isStyleLoaded()) return;

    const style = map.current.getStyle();
    style.layers?.forEach((layer) => {
      if (layer.type !== "symbol" || !layer.layout || !("text-field" in layer.layout)) return;
      try {
        map.current?.setLayoutProperty(layer.id, "text-field", [
          "coalesce",
          ["get", "name_zh-Hans"],
          ["get", "name_zh"],
          ["get", "name"],
        ]);
      } catch (_error) {
        // Some symbol layers cannot be overridden; skip them.
      }
    });
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
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.display = 'block';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      el.style.background = 'rgba(255,255,255,0.92)';
      el.style.border = '1px solid rgba(255,255,255,0.95)';
      el.style.borderRadius = '999px';
      el.style.transition = 'box-shadow 0.2s ease';
      el.style.zIndex = '10';

      const icon = document.createElement('span');
      icon.textContent = getReligionIcon(temple.religion);
      icon.style.display = 'block';
      icon.style.width = '100%';
      icon.style.height = '100%';
      icon.style.textAlign = 'center';
      icon.style.lineHeight = '28px';
      icon.style.fontSize = '18px';
      icon.style.userSelect = 'none';
      icon.style.pointerEvents = 'none';
      el.appendChild(icon);

      el.addEventListener('mouseenter', () => {
        el.style.zIndex = '1000';
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.zIndex = '10';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      });

      try {
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
          offset: [0, 0],
          pitchAlignment: 'map',
          rotationAlignment: 'map',
        })
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
            <span className="text-lg">🏯</span>
            <span className="text-sm font-medium">佛教寺庙</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">⛪</span>
            <span className="text-sm font-medium">天主教堂</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">🕌</span>
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