import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Filter, Building, Church, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Temple } from "@/types/temple";

interface FilterOption {
  id: string;
  label: string;
  count: number;
  color?: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
  currentYear: number;
  onYearChange: (year: number) => void;
  onTempleSelect?: (temple: Temple) => void;
  selectedReligions?: string[];
  onReligionFilter?: (religions: string[]) => void;
  selectedPeriods?: string[];
  onPeriodFilter?: (periods: string[]) => void;
  temples: Temple[];
}

export const FilterPanel = ({
  isOpen,
  onToggle,
  isMobile,
  currentYear,
  onYearChange,
  onTempleSelect,
  selectedReligions = [],
  onReligionFilter,
  selectedPeriods = [],
  onPeriodFilter,
  temples,
}: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    templeList: true,
    religion: true,
    period: true,
  });
  const religionMeta: Record<string, { label: string; color: string }> = {
    buddhism: { label: "佛教", color: "bg-orange-500" },
    catholic: { label: "天主教", color: "bg-purple-500" },
    islam: { label: "伊斯兰教", color: "bg-green-500" },
  };

  const religionOrder = ["buddhism", "catholic", "islam"];
  const religions: FilterOption[] = religionOrder.reduce<FilterOption[]>((acc, religionId) => {
    const count = temples.filter((temple) => temple.religion === religionId).length;
    if (count === 0) return acc;
    acc.push({
      id: religionId,
      label: religionMeta[religionId].label,
      count,
      color: religionMeta[religionId].color,
    });
    return acc;
  }, []);

  const periods: FilterOption[] = [
    {
      id: "ancient",
      label: "古代 (618-1911)",
      count: temples.filter((temple) => temple.establishedYear >= 618 && temple.establishedYear <= 1911).length,
    },
    {
      id: "modern",
      label: "近现代 (1912-2024)",
      count: temples.filter((temple) => temple.establishedYear >= 1912 && temple.establishedYear <= 2024).length,
    },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleReligionChange = (religionId: string, checked: boolean) => {
    if (!onReligionFilter) return;
    
    const availableReligionIds = religions.map((option) => option.id);
    const validSelectedReligions = selectedReligions.filter((id) => availableReligionIds.includes(id));

    let newSelected;
    if (checked) {
      newSelected = [...validSelectedReligions, religionId];
    } else {
      newSelected = validSelectedReligions.filter(id => id !== religionId);
    }
    onReligionFilter(newSelected);
  };

  const handleSectionOptionChange = (sectionKey: string, optionId: string, checked: boolean) => {
    if (sectionKey === "religion") {
      handleReligionChange(optionId, checked);
      return;
    }

    if (sectionKey === "period") {
      if (!onPeriodFilter) return;
      const newSelected = checked
        ? [...selectedPeriods, optionId]
        : selectedPeriods.filter((id) => id !== optionId);
      onPeriodFilter(newSelected);
      return;
    }

  };

  const isOptionChecked = (sectionKey: string, optionId: string) => {
    if (sectionKey === "religion") return selectedReligions.includes(optionId);
    if (sectionKey === "period") return selectedPeriods.includes(optionId);
    return false;
  };

  const getReligionIcon = (religionId: string) => {
    switch (religionId) {
      case 'buddhism': return '🏯';
      case 'catholic': return '⛪';
      case 'islam': return '🕌';
      default: return '🏛️';
    }
  };

  const FilterSection = ({ 
    title, 
    options, 
    sectionKey,
    icon,
    showColors = false 
  }: { 
    title: string; 
    options: FilterOption[]; 
    sectionKey: string;
    icon?: ReactNode;
    showColors?: boolean;
  }) => (
    <Collapsible
      open={expandedSections[sectionKey]}
      onOpenChange={() => toggleSection(sectionKey)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 h-auto font-medium"
        >
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          {expandedSections[sectionKey] ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-3 px-2">
            <Checkbox 
              id={option.id} 
              checked={isOptionChecked(sectionKey, option.id)}
              onCheckedChange={(checked) => {
                handleSectionOptionChange(sectionKey, option.id, !!checked);
              }}
            />
            {sectionKey === 'religion' && (
              <span className="text-lg">{getReligionIcon(option.id)}</span>
            )}
            {showColors && option.color && sectionKey !== 'religion' && (
              <div className={`w-3 h-3 rounded-full ${option.color}`} />
            )}
            <label
              htmlFor={option.id}
              className="text-sm font-medium flex-1 cursor-pointer"
            >
              {option.label}
            </label>
            <span className="text-xs text-muted-foreground">
              ({option.count})
            </span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  if (isMobile && !isOpen) return null;

  return (
    <Card className={`
      ${isMobile 
        ? 'absolute top-0 left-0 right-0 z-40 m-4 max-h-[80vh] overflow-y-auto' 
        : 'w-80 h-full'
      }
      shadow-panel border-border bg-card
    `}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5 text-primary" />
          筛选条件
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="ml-auto"
            >
              ×
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 寺庙列表 */}
        <Collapsible
          open={expandedSections.templeList}
          onOpenChange={() => toggleSection('templeList')}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto font-medium"
            >
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                寺庙列表
              </div>
              {expandedSections.templeList ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {temples.slice(0, 9).map((temple) => (
                <div
                  key={temple.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onTempleSelect?.(temple)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {temple.religion === 'buddhism' ? '🏯' :
                       temple.religion === 'taoism' ? '⛩️' :
                       temple.religion === 'catholic' ? '⛪' : '🕌'}
                    </span>
                    <span className="font-medium text-sm">{temple.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {temple.location} • {temple.establishedYear}年
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <FilterSection
          title="宗教类型"
          options={religions}
          sectionKey="religion"
          icon={<Church className="h-4 w-4 text-primary" />}
          showColors={true}
        />
        
        <FilterSection
          title="建立时期"
          options={periods}
          sectionKey="period"
          icon={<CalendarDays className="h-4 w-4 text-primary" />}
        />
        
        <div className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              onReligionFilter?.([]);
              onPeriodFilter?.([]);
            }}
          >
            清空所有筛选
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};