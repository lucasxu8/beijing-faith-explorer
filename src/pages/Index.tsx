import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { MapView } from "@/components/MapView";
import { TimeSlider } from "@/components/TimeSlider";
import { DetailPanel } from "@/components/DetailPanel";
import { useIsMobile } from "@/hooks/use-mobile";

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

const Index = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header 
        onMenuToggle={() => setIsFilterOpen(!isFilterOpen)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Filter Panel */}
        {(!isMobile || isFilterOpen) && (
          <div className={isMobile ? "absolute inset-0 z-40" : ""}>
            <FilterPanel
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Map View */}
        <div className="flex-1 relative">
          <MapView
            currentYear={currentYear}
            onTempleSelect={handleTempleSelect}
            selectedTemple={selectedTemple}
          />
        </div>

        {/* Detail Panel */}
        {isDetailOpen && (
          <div className={isMobile ? "absolute inset-0 z-50" : ""}>
            <DetailPanel
              temple={selectedTemple}
              isOpen={isDetailOpen}
              onClose={handleDetailClose}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>

      {/* Time Slider */}
      <TimeSlider
        currentYear={currentYear}
        onYearChange={handleYearChange}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
      />
    </div>
  );
};

export default Index;
