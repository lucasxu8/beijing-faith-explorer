import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
}

export const FilterPanel = ({ isOpen, onToggle, isMobile }: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    religion: true,
    period: true,
    scale: false,
    status: false,
  });

  const religions: FilterOption[] = [
    { id: "buddhism", label: "佛教", count: 156, color: "bg-buddhism" },
    { id: "taoism", label: "道教", count: 89, color: "bg-taoism" },
    { id: "folk", label: "民间信仰", count: 67, color: "bg-folk" },
  ];

  const periods: FilterOption[] = [
    { id: "ancient", label: "古代 (618-1911)", count: 198 },
    { id: "modern", label: "近现代 (1912-2024)", count: 114 },
  ];

  const scales: FilterOption[] = [
    { id: "national", label: "国家级", count: 12, color: "bg-national" },
    { id: "provincial", label: "省级", count: 34, color: "bg-provincial" },
    { id: "municipal", label: "市级", count: 78, color: "bg-municipal" },
    { id: "district", label: "区县级", count: 188, color: "bg-district" },
  ];

  const statuses: FilterOption[] = [
    { id: "active", label: "正常开放", count: 245 },
    { id: "renovation", label: "修缮中", count: 35 },
    { id: "ruins", label: "遗址", count: 32 },
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
          title="规模等级"
          options={scales}
          sectionKey="scale"
          showColors={true}
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