import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TimeSliderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export const TimeSlider = ({ 
  currentYear, 
  onYearChange, 
  isPlaying, 
  onPlayToggle 
}: TimeSliderProps) => {
  const minYear = 618; // Tang Dynasty
  const maxYear = 2024; // Current year
  
  const dynasties = [
    { name: "唐", year: 618, color: "bg-buddhism" },
    { name: "宋", year: 960, color: "bg-taoism" },
    { name: "明", year: 1368, color: "bg-folk" },
    { name: "清", year: 1644, color: "bg-primary" },
    { name: "民国", year: 1912, color: "bg-secondary" },
    { name: "现代", year: 1949, color: "bg-accent" },
  ];

  const handleReset = () => {
    onYearChange(maxYear);
  };

  const getPositionPercent = (year: number) => {
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  return (
    <div className="bg-card border-t border-border shadow-panel p-4">
      <div className="max-w-6xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPlayToggle}
              className="w-20"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  播放
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              重置
            </Button>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {currentYear}年
            </div>
            <div className="text-sm text-muted-foreground">
              {currentYear < 1912 ? "古代" : currentYear < 1949 ? "民国" : "现代"}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            播放速度: 10年/秒
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Dynasty markers */}
          <div className="relative h-12 mb-2">
            {dynasties.map((dynasty, index) => (
              <div
                key={dynasty.name}
                className="absolute transform -translate-x-1/2 cursor-pointer group"
                style={{ left: `${getPositionPercent(dynasty.year)}%` }}
                onClick={() => onYearChange(dynasty.year)}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${dynasty.color} border-2 border-background shadow-sm group-hover:scale-125 transition-transform`} />
                  <div className="text-xs font-medium mt-1 text-foreground group-hover:text-primary transition-colors">
                    {dynasty.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dynasty.year}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider */}
          <div className="px-4">
            <Slider
              value={[currentYear]}
              onValueChange={(value) => onYearChange(value[0])}
              min={minYear}
              max={maxYear}
              step={1}
              className="w-full"
            />
          </div>

          {/* Year labels */}
          <div className="flex justify-between mt-2 px-4">
            <span className="text-xs text-muted-foreground">{minYear}</span>
            <span className="text-xs text-muted-foreground">{maxYear}</span>
          </div>
        </div>

        {/* Timeline legend */}
        <div className="flex justify-center items-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-buddhism" />
            <span>寺庙建立</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-taoism" />
            <span>重大事件</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-folk" />
            <span>历史人物</span>
          </div>
        </div>
      </div>
    </div>
  );
};