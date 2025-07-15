import { useState } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TimeSliderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export const TimeSlider = ({ 
  currentYear, 
  onYearChange,
  isPlaying = false,
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
    <div className="glass-panel p-6 mx-4 max-w-4xl w-full rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">时间轴控制</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPlayToggle}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onYearChange(618)}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="relative">
          <Slider
            value={[currentYear]}
            onValueChange={(value) => onYearChange(value[0])}
            max={2024}
            min={618}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-6 gap-4 text-center">
          {[
            { year: 618, dynasty: '唐朝' },
            { year: 960, dynasty: '宋朝' },
            { year: 1368, dynasty: '明朝' },
            { year: 1644, dynasty: '清朝' },
            { year: 1912, dynasty: '民国' },
            { year: 2024, dynasty: '现代' }
          ].map((period) => (
            <button
              key={period.year}
              onClick={() => onYearChange(period.year)}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{period.year}</span>
              <span className="text-xs text-gray-500">{period.dynasty}</span>
            </button>
          ))}
        </div>
        
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentYear}
          </div>
          <div className="text-sm text-gray-600 mt-1">当前年份</div>
        </div>
      </div>
    </div>
  );
};