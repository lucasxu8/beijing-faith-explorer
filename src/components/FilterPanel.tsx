import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TimeSlider } from "@/components/TimeSlider";

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
}

export const FilterPanel = ({ isOpen, onToggle, isMobile, currentYear, onYearChange }: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    timeControl: true,
    religion: true,
    period: true,
    status: false,
  });

  const religions: FilterOption[] = [
    { id: "buddhism", label: "佛教", count: 3, color: "bg-buddhism" },
    { id: "taoism", label: "道教", count: 2, color: "bg-taoism" },
    { id: "catholic", label: "天主教", count: 2, color: "bg-catholic" },
    { id: "islam", label: "伊斯兰教", count: 2, color: "bg-islam" },
  ];

  const periods: FilterOption[] = [
    { id: "ancient", label: "古代 (618-1911)", count: 7 },
    { id: "modern", label: "近现代 (1912-2024)", count: 2 },
  ];

  const statuses: FilterOption[] = [
    { id: "active", label: "正常开放", count: 9 },
    { id: "renovation", label: "修缮中", count: 0 },
    { id: "ruins", label: "遗址", count: 0 },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ 
    title, 
    options, 
    sectionKey,
    showColors = false 
  }: { 
    title: string; 
    options: FilterOption[]; 
    sectionKey: string;
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
          {title}
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
            <Checkbox id={option.id} />
            {showColors && option.color && (
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
        {/* 时间轴控制 */}
        <Collapsible
          open={expandedSections.timeControl}
          onOpenChange={() => toggleSection('timeControl')}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto font-medium"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                时间轴控制
              </div>
              {expandedSections.timeControl ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {currentYear}
                </div>
                <div className="text-xs text-muted-foreground">
                  当前年份
                </div>
              </div>
              <TimeSlider 
                currentYear={currentYear}
                onYearChange={onYearChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <FilterSection
          title="宗教类型"
          options={religions}
          sectionKey="religion"
          showColors={true}
        />
        
        <FilterSection
          title="建立时期"
          options={periods}
          sectionKey="period"
        />
        
        <FilterSection
          title="现状"
          options={statuses}
          sectionKey="status"
        />
        
        <div className="pt-4 border-t border-border">
          <Button variant="outline" className="w-full">
            清空所有筛选
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};