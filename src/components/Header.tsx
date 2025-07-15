import { Search, Download, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export const Header = ({ onMenuToggle, isMobile }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border shadow-panel h-16 flex items-center px-4 gap-4 z-50">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">信</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">重庆信仰地图</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索寺庙、人物、事件..."
            className="pl-10 bg-background border-muted"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Download className="h-4 w-4 mr-2" />
          导出数据
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};