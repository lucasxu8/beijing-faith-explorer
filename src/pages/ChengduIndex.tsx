import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { MapView } from "@/components/MapView";
import { DetailPanel } from "@/components/DetailPanel";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { Temple } from "@/types/temple";
import { getTemples } from "@/services/chengduTempleService";
import { getChengduTempleData, saveChengduTempleData } from "@/lib/chengduDataManager";
import { searchableTempleText } from "@/lib/templeDataManager";
import { AlertCircle, Loader2 } from "lucide-react";

const ChengduIndex = () => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const isMobile = useIsMobile();

  const { data: temples, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["chengdu-temples"],
    queryFn: async () => {
      const remote = await getTemples();
      saveChengduTempleData(remote);
      return remote;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const cachedTemples = getChengduTempleData();
  const sourceTemples = temples ?? cachedTemples;
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const searchSuggestions =
    normalizedKeyword.length === 0
      ? []
      : sourceTemples
          .filter((temple) =>
            searchableTempleText(temple).toLowerCase().includes(normalizedKeyword)
          )
          .slice(0, 8);

  const filteredTemples = sourceTemples.filter((temple) => {
    const yearFilter = temple.establishedYear <= currentYear;
    const religionFilter =
      selectedReligions.length === 0 || selectedReligions.includes(temple.religion);
    const periodFilter =
      selectedPeriods.length === 0 ||
      selectedPeriods.some((period) => {
        if (period === "ancient") {
          return temple.establishedYear >= 618 && temple.establishedYear <= 1911;
        }
        if (period === "modern") {
          return temple.establishedYear >= 1912 && temple.establishedYear <= 2024;
        }
        return false;
      });
    const searchFilter =
      normalizedKeyword.length === 0 ||
      searchableTempleText(temple).toLowerCase().includes(normalizedKeyword);

    return yearFilter && religionFilter && periodFilter && searchFilter;
  });

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentYear((prev) => {
        if (prev <= 618) {
          setIsPlaying(false);
          return 618;
        }
        return prev - 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTempleSelect = (temple: Temple) => {
    setSelectedTemple(temple);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setIsPlaying(false);
  };

  const handleSuggestionSelect = (temple: Temple) => {
    setSearchKeyword(temple.name);
    setSelectedTemple(temple);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(sourceTemples, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "chengdu-temples-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading && sourceTemples.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium mb-2">正在加载寺庙数据...</p>
          <p className="text-sm text-muted-foreground">从云端获取成都最新的宗教场所信息</p>
        </div>
      </div>
    );
  }

  if (error && sourceTemples.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>数据加载失败</strong>
              <br />
              {error instanceof Error ? error.message : "未知错误"}
              <br />
              <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-3">
                重试加载
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cityName="成都"
        adminLoginPath="/chengdu/data-admin-login"
        onMenuToggle={() => setIsFilterOpen(!isFilterOpen)}
        isMobile={isMobile}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        searchSuggestions={searchSuggestions}
        onSuggestionSelect={handleSuggestionSelect}
        onExportJson={handleExportJson}
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
          selectedPeriods={selectedPeriods}
          onPeriodFilter={setSelectedPeriods}
          temples={sourceTemples}
          listTemples={filteredTemples}
        />
        <div className="flex-1 flex flex-col relative">
          <MapView
            cityId="chengdu"
            currentYear={currentYear}
            onTempleSelect={handleTempleSelect}
            selectedTemple={selectedTemple}
            selectedReligions={selectedReligions}
            temples={filteredTemples}
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

      <div className="fixed bottom-4 left-4 glass-panel p-3 z-10 rounded-lg text-sm">
        <span className="text-muted-foreground">
          数据来源: Firestore chengdu_temples{isFetching ? "（同步中）" : ""} | 显示{" "}
          {filteredTemples.length} / {sourceTemples.length} 个场所
        </span>
      </div>
    </div>
  );
};

export default ChengduIndex;
