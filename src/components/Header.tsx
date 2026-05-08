import { Search, Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Temple } from "@/types/temple";

interface HeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  searchSuggestions: Temple[];
  onSuggestionSelect: (temple: Temple) => void;
  onExportJson: () => void;
}

export const Header = ({
  onMenuToggle,
  isMobile,
  searchKeyword,
  onSearchChange,
  searchSuggestions,
  onSuggestionSelect,
  onExportJson,
}: HeaderProps) => {
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
          <h1 className="text-xl font-bold text-foreground">北京信仰地图</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索寺庙、人物、事件..."
            className="pl-10 bg-background border-muted"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((temple) => (
                  <button
                    key={temple.id}
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => onSuggestionSelect(temple)}
                  >
                    <div className="font-medium text-sm">{temple.name}</div>
                    <div className="text-xs text-muted-foreground">{temple.location}</div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">未找到相关寺庙</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex" onClick={onExportJson}>
          <Download className="h-4 w-4 mr-2" />
          导出数据
        </Button>
        <Link to="/data-admin-login">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            数据后台
          </Button>
        </Link>
      </div>
    </header>
  );
};