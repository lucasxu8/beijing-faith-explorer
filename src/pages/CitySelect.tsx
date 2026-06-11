import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { citiesData } from "@/data/citiesData";

export default function CitySelect() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold">信</span>
          </div>
          <div>
            <h1 className="text-xl font-bold golden-accent">中国信仰地图</h1>
            <p className="text-sm text-muted-foreground">探索中国主要城市的宗教文化遗产</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-3">选择城市</h2>
          <p className="text-muted-foreground leading-relaxed">
            从下方选择一座城市，进入该地的信仰地图。目前北京已开放，更多城市将陆续上线。
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {citiesData.map((city) => {
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="text-lg font-semibold text-foreground">{city.name}</h3>
                  </div>
                  {city.available ? (
                    <Badge className="bg-primary text-primary-foreground border-0 shrink-0">已开放</Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">
                      <Lock className="h-3 w-3 mr-1" />
                      即将开放
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[3rem]">
                  {city.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {city.highlights.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
                {city.available && (
                  <div className="flex items-center text-sm font-medium text-primary">
                    进入地图
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                )}
              </>
            );

            if (city.available && city.route) {
              return (
                <Link
                  key={city.id}
                  to={city.route}
                  className="elegant-card p-5 block hover:border-primary/40 transition-all"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={city.id}
                className="elegant-card p-5 opacity-70 cursor-not-allowed"
                aria-disabled
              >
                {cardContent}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
