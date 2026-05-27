import { useEffect, useState } from "react";
import { X, MapPin, Calendar, Clock, ExternalLink, Heart, Share, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Temple } from "@/types/temple";

interface DetailPanelProps {
  temple: Temple | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const DetailPanel = ({ temple, isOpen, onClose, isMobile }: DetailPanelProps) => {
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (!temple?.imageUrl?.trim()) {
      setImageStatus("error");
      return;
    }
    setImageStatus("loading");
  }, [temple?.id, temple?.imageUrl]);

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
  const imageUrl = temple.imageUrl?.trim() ?? "";

  return (
    <div className={`
      ${isMobile 
        ? 'fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl shadow-2xl' 
        : 'w-[28rem] h-full overflow-y-auto border-l-2'
      }
      bg-background border-border backdrop-blur-lg
    `}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-6 px-6 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{religion.icon}</span>
                <h2 className="text-2xl font-bold text-foreground leading-tight">{temple.name}</h2>
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

        <CardContent className="space-y-6 px-6 pb-6">
          {/* Main Image */}
          <div className="aspect-video rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 relative">
            {imageStatus !== "error" && imageUrl && (
              <img
                src={imageUrl}
                alt={temple.name}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  imageStatus === "loaded" ? "opacity-100" : "opacity-0"
                }`}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setImageStatus("loaded")}
                onError={() => setImageStatus("error")}
              />
            )}
            {imageStatus === "loading" && imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                图片加载中...
              </div>
            )}
            {imageStatus === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground px-4 text-center">
                <ImageOff className="h-8 w-8 opacity-60" />
                <span className="text-sm">图片无法加载</span>
                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline break-all"
                  >
                    在浏览器中打开图片链接
                  </a>
                )}
              </div>
            )}
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

            {temple.openingHours.trim() && (
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-foreground">{temple.openingHours}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">简介</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {temple.description}
            </p>
          </div>

          {temple.historicalBackground.trim() && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-2">历史背景</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {temple.historicalBackground}
                </p>
              </div>
            </>
          )}

          {temple.architecturalFeatures.trim() && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-2">建筑特点</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {temple.architecturalFeatures}
                </p>
              </div>
            </>
          )}

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
