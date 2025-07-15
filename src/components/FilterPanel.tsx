import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TimeSlider } from "@/components/TimeSlider";

// 寺庙数据类型
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
}

export const FilterPanel = ({ isOpen, onToggle, isMobile, currentYear, onYearChange, onTempleSelect }: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    timeControl: true,
    templeList: true,
    religion: true,
    period: true,
    status: false,
  });

  // 寺庙数据（只显示重庆及周边的寺庙）
  const temples: Temple[] = [
    {
      id: "cq1",
      name: "重庆大足石刻宝顶山石窟",
      location: "重庆市大足区",
      religion: "buddhism",
      establishedYear: 1179,
      status: "active",
      description: "大足石刻是重庆大足区境内主要表现为摩崖造像的石窟艺术的总称，为联合国世界文化遗产。",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [105.7242, 29.7056] as [number, number],
      relatedPeople: ["赵智凤"],
      relatedEvents: ["1179年开凿", "1999年列入世界遗产"]
    },
    {
      id: "cq2", 
      name: "重庆慈云寺",
      location: "重庆市南岸区",
      religion: "buddhism",
      establishedYear: 1927,
      status: "active",
      description: "慈云寺位于重庆南岸区玄坛庙狮子山，是重庆市著名的佛教寺院之一。",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      coordinates: [106.5805, 29.5647] as [number, number],
      relatedPeople: ["太虚法师"],
      relatedEvents: ["1927年重建", "现代修复"]
    },
    {
      id: "cq3",
      name: "重庆华岩寺",
      location: "重庆市九龙坡区",
      religion: "buddhism", 
      establishedYear: 1650,
      status: "active",
      description: "华岩寺位于重庆市九龙坡区华岩镇，始建于清顺治七年，是重庆市著名的佛教寺院。",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
      coordinates: [106.4647, 29.4774] as [number, number],
      relatedPeople: ["寂光法师"],
      relatedEvents: ["1650年建寺", "现代重修"]
    },
    {
      id: "cq4",
      name: "重庆老君洞道观",
      location: "重庆市南岸区",
      religion: "taoism",
      establishedYear: 1700,
      status: "active", 
      description: "老君洞道观位于重庆南岸区黄桷垭附近，是重庆著名的道教宫观。",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [106.6158, 29.5086] as [number, number],
      relatedPeople: ["张三丰传人"],
      relatedEvents: ["1700年建观", "现代修缮"]
    },
    {
      id: "cq5",
      name: "重庆天主教堂（若瑟堂）",
      location: "重庆市渝中区",
      religion: "catholic",
      establishedYear: 1900,
      status: "active",
      description: "若瑟堂位于重庆市渝中区民生路，是重庆重要的天主教教堂。",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      coordinates: [106.5692, 29.5628] as [number, number],
      relatedPeople: ["法国传教士"],
      relatedEvents: ["1900年建堂", "现代修复"]
    },
    {
      id: "cq6",
      name: "重庆清真寺",
      location: "重庆市渝中区",
      religion: "islam",
      establishedYear: 1850,
      status: "active",
      description: "重庆清真寺位于重庆市渝中区，是重庆回族穆斯林的重要宗教活动场所。",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop", 
      coordinates: [106.5770, 29.5647] as [number, number],
      relatedPeople: ["回族商人"],
      relatedEvents: ["1850年建寺", "现代修缮"]
    },
    {
      id: "cq7",
      name: "重庆罗汉寺",
      location: "重庆市渝中区",
      religion: "buddhism",
      establishedYear: 1000,
      status: "active",
      description: "罗汉寺位于重庆市渝中区民族路，始建于北宋治平年间，是重庆最古老的佛教寺院之一。",
      imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [106.5692, 29.5647] as [number, number],
      relatedPeople: ["智真法师"],
      relatedEvents: ["1000年建寺", "明清重修", "现代保护"]
    },
    {
      id: "cq8",
      name: "重庆绍龙观",
      location: "重庆渝北区",
      religion: "taoism",
      establishedYear: 1368,
      status: "active",
      description: "绍龙观位于重庆渝北区，是重庆地区重要的道教宫观之一。",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      coordinates: [106.6435, 29.7167] as [number, number],
      relatedPeople: ["道教宗师"],
      relatedEvents: ["1368年建观", "历代修缮"]
    },
    {
      id: "cq9",
      name: "重庆双桂堂",
      location: "重庆市梁平区",
      religion: "buddhism",
      establishedYear: 1653,
      status: "active",
      description: "双桂堂位于重庆梁平区金带镇，由破山禅师创建，是西南地区著名的佛教寺院。",
      imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop",
      coordinates: [107.8000, 30.6742] as [number, number],
      relatedPeople: ["破山禅师"],
      relatedEvents: ["1653年创建", "清代兴盛", "现代修复"]
    }
  ];

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