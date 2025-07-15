import { X, MapPin, Calendar, Building, ExternalLink, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface DetailPanelProps {
  temple: Temple | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const DetailPanel = ({ temple, isOpen, onClose, isMobile }: DetailPanelProps) => {
  if (!temple || !isOpen) return null;

  const religionConfig = {
    buddhism: { label: "佛教", color: "bg-buddhism", icon: "🏯" },
    taoism: { label: "道教", color: "bg-taoism", icon: "⛩️" },
    catholic: { label: "天主教", color: "bg-catholic", icon: "⛪" },
    islam: { label: "伊斯兰教", color: "bg-islam", icon: "🕌" }
  };

  const statusConfig = {
    active: { label: "正常开放", color: "bg-green-500" },
    renovation: { label: "修缮中", color: "bg-yellow-500" },
    ruins: { label: "遗址", color: "bg-gray-500" }
  };

  const religion = religionConfig[temple.religion];
  const status = statusConfig[temple.status];

  return (
    <div className={`
      ${isMobile 
        ? 'fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto' 
        : 'w-96 h-full overflow-y-auto'
      }
      bg-card border-l border-border shadow-floating
    `}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{religion.icon}</span>
                <h2 className="text-xl font-bold text-foreground">{temple.name}</h2>
              </div>
              <Badge 
                variant="secondary" 
                className={`${religion.color} text-white border-0`}
              >
                {religion.label}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img 
              src={temple.imageUrl} 
              alt={temple.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjMtZjQtZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2LTctOSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veS4rTwvdGV4dD48L3N2Zz4=";
              }}
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{temple.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                建立于 {temple.establishedYear}年
                {temple.establishedYear < 1000 ? " (唐代)" : 
                 temple.establishedYear < 1368 ? " (宋代)" :
                 temple.establishedYear < 1644 ? " (明代)" :
                 temple.establishedYear < 1912 ? " (清代)" : " (近现代)"}
              </span>
            </div>
            

            <div className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${status.color}`} />
              <span className="text-foreground">{status.label}</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">简介</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {temple.description}
            </p>
          </div>

          {/* Related People */}
          {temple.relatedPeople.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-2">相关人物</h3>
                <div className="flex flex-wrap gap-2">
                  {temple.relatedPeople.map((person, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                      {person}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Related Events */}
          {temple.relatedEvents.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-2">相关事件</h3>
                <div className="space-y-2">
                  {temple.relatedEvents.map((event, index) => (
                    <div key={index} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                      • {event}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              收藏
            </Button>
            <Button variant="outline" className="w-full">
              <Share className="h-4 w-4 mr-2" />
              分享
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button className="w-full bg-gradient-primary">
              <ExternalLink className="h-4 w-4 mr-2" />
              查看详细资料
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};