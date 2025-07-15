import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { MapView } from "@/components/MapView";
import { TimeSlider } from "@/components/TimeSlider";
import { DetailPanel } from "@/components/DetailPanel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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

const Index = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTimeSliderVisible, setIsTimeSliderVisible] = useState(true);
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  
  const isMobile = useIsMobile();

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentYear(prev => {
        if (prev <= 618) {
          setIsPlaying(false);
          return 618;
        }
        return prev - 10; // Go back 10 years per second
      });
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTempleSelect = (temple: Temple) => {
    console.log('Temple selected:', temple); // 调试信息
    setSelectedTemple(temple);
    setIsDetailOpen(true);
    // Close filter panel on mobile when selecting temple
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedTemple(null);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setIsPlaying(false); // Stop playing when manually changing year
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuToggle={() => setIsFilterOpen(!isFilterOpen)}
        isMobile={isMobile}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <FilterPanel 
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          isMobile={isMobile}
          currentYear={currentYear}
          onYearChange={handleYearChange}
          onTempleSelect={handleTempleSelect}
          selectedReligions={selectedReligions}
          onReligionFilter={setSelectedReligions}
        />
        <div className="flex-1 flex flex-col relative">
          <MapView 
            currentYear={currentYear}
            onTempleSelect={handleTempleSelect}
            selectedTemple={selectedTemple}
            selectedReligions={selectedReligions}
          />
        </div>
        {selectedTemple && (
          <DetailPanel 
            temple={selectedTemple}
            onClose={() => setSelectedTemple(null)}
            isOpen={!!selectedTemple}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
