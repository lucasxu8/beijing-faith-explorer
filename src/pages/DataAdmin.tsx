import { ChangeEvent, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2, Plus, RefreshCw, Save, Trash2, Upload } from "lucide-react";
import { Temple } from "@/types/temple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { clearTempleData, generateBeijingTempleId, getTempleData, normalizeTemple, saveTempleData } from "@/lib/templeDataManager";
import {
  deleteTempleFromFirestore,
  getTemples,
  syncTemplesToFirestore,
} from "@/services/templeService";

const RELIGION_OPTIONS: { value: Temple["religion"]; label: string }[] = [
  { value: "buddhism", label: "佛教寺庙 (buddhism)" },
  { value: "taoism", label: "道教 (taoism)" },
  { value: "catholic", label: "天主教 (catholic)" },
  { value: "islam", label: "伊斯兰教 (islam)" },
];

const STATUS_OPTIONS: { value: Temple["status"]; label: string }[] = [
  { value: "active", label: "正常开放 (active)" },
  { value: "renovation", label: "修缮中 (renovation)" },
  { value: "ruins", label: "遗址 (ruins)" },
];

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {label}
    </Label>
    {children}
  </div>
);

const EMPTY_FORM = {
  name: "",
  location: "",
  religion: "buddhism" as Temple["religion"],
  establishedYear: 2000,
  status: "active" as Temple["status"],
  description: "",
  historicalBackground: "",
  architecturalFeatures: "",
  openingHours: "",
  imageUrl: "",
  lng: 116.404,
  lat: 39.915,
};

export default function DataAdmin() {
  const queryClient = useQueryClient();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [jsonText, setJsonText] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingTempleId, setEditingTempleId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);

  const invalidateMapCache = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["beijing-temples"] });
  }, [queryClient]);

  const loadFromFirestore = useCallback(async (silent = false) => {
    setIsLoading(true);
    try {
      const remote = await getTemples();
      setTemples(remote);
      saveTempleData(remote);
      if (!silent) {
        toast({
          title: "已加载 Firestore 数据",
          description: `共 ${remote.length} 条场所记录。`,
        });
      }
    } catch (error) {
      const cached = getTempleData();
      setTemples(cached);
      toast({
        title: "Firestore 加载失败",
        description:
          error instanceof Error
            ? `${error.message}（已回退本地缓存 ${cached.length} 条）`
            : "已回退本地缓存",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFromFirestore(true);
  }, [loadFromFirestore]);

  useEffect(() => {
    setJsonText(JSON.stringify(temples, null, 2));
  }, [temples]);

  const sortedTemples = useMemo(
    () => [...temples].sort((a, b) => a.establishedYear - b.establishedYear),
    [temples]
  );

  const persistTemples = async (next: Temple[]) => {
    setTemples(next);
    saveTempleData(next);
    setIsSyncing(true);
    try {
      await syncTemplesToFirestore(next);
      invalidateMapCache();
      toast({ title: "已同步到 Firebase", description: `当前共 ${next.length} 条记录。` });
    } catch (error) {
      toast({
        title: "Firebase 同步失败",
        description: error instanceof Error ? error.message : "请检查 Firebase 配置与网络",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTemple = async () => {
    if (!form.name.trim() || !form.location.trim()) {
      toast({ title: "缺少必填项", description: "请至少填写名称和地点。", variant: "destructive" });
      return;
    }
    const temple: Temple = {
      id: generateBeijingTempleId(form.religion, temples),
      name: form.name.trim(),
      location: form.location.trim(),
      religion: form.religion,
      establishedYear: Number(form.establishedYear),
      status: form.status,
      description: form.description.trim() || "待补充描述",
      historicalBackground: form.historicalBackground.trim(),
      architecturalFeatures: form.architecturalFeatures.trim(),
      openingHours: form.openingHours.trim(),
      imageUrl: form.imageUrl.trim() || "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [Number(form.lng), Number(form.lat)],
      relatedPeople: [],
      relatedEvents: [],
    };
    const next = [...temples, temple];
    await persistTemples(next);
    setForm(EMPTY_FORM);
    toast({ title: "已新增场所", description: `${temple.name}（ID: ${temple.id}）` });
  };

  const handleDeleteTemple = async (id: string) => {
    const next = temples.filter((temple) => temple.id !== id);
    setTemples(next);
    saveTempleData(next);
    setIsSyncing(true);
    try {
      await deleteTempleFromFirestore(id);
      invalidateMapCache();
      toast({ title: "已删除并同步到 Firebase", description: `剩余 ${next.length} 条记录。` });
    } catch (error) {
      toast({
        title: "Firebase 同步失败",
        description: error instanceof Error ? error.message : "请检查 Firebase 配置与网络",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStartEditTemple = (temple: Temple) => {
    setEditingTempleId(temple.id);
    setEditingForm({
      name: temple.name,
      location: temple.location,
      religion: temple.religion,
      establishedYear: temple.establishedYear,
      status: temple.status,
      description: temple.description,
      historicalBackground: temple.historicalBackground,
      architecturalFeatures: temple.architecturalFeatures,
      openingHours: temple.openingHours,
      imageUrl: temple.imageUrl,
      lng: temple.coordinates[0],
      lat: temple.coordinates[1],
    });
  };

  const handleCancelEditTemple = () => {
    setEditingTempleId(null);
    setEditingForm(EMPTY_FORM);
  };

  const handleSaveEditTemple = async (id: string) => {
    if (!editingForm.name.trim() || !editingForm.location.trim()) {
      toast({ title: "缺少必填项", description: "请至少填写名称和地点。", variant: "destructive" });
      return;
    }

    const next = temples.map((temple) =>
      temple.id === id
        ? {
            ...temple,
            name: editingForm.name.trim(),
            location: editingForm.location.trim(),
            religion: editingForm.religion,
            establishedYear: Number(editingForm.establishedYear),
            status: editingForm.status,
            description: editingForm.description.trim() || "待补充描述",
            historicalBackground: editingForm.historicalBackground.trim(),
            architecturalFeatures: editingForm.architecturalFeatures.trim(),
            openingHours: editingForm.openingHours.trim(),
            imageUrl:
              editingForm.imageUrl.trim() ||
              "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
            coordinates: [Number(editingForm.lng), Number(editingForm.lat)] as [number, number],
          }
        : temple
    );

    await persistTemples(next);
    setEditingTempleId(null);
    setEditingForm(EMPTY_FORM);
    toast({ title: "已保存修改" });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(temples, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "temples-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("JSON 必须是数组。");
      const normalized = (parsed as Record<string, unknown>[]).map((item) =>
        normalizeTemple(item)
      );
      await persistTemples(normalized);
      toast({ title: "导入成功", description: `已导入 ${normalized.length} 条记录。` });
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "JSON 格式不正确",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleApplyJson = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error("JSON 必须是数组。");
      const normalized = (parsed as Record<string, unknown>[]).map((item) =>
        normalizeTemple(item)
      );
      await persistTemples(normalized);
      toast({ title: "JSON 已应用", description: `当前共 ${normalized.length} 条记录。` });
    } catch (error) {
      toast({
        title: "JSON 解析失败",
        description: error instanceof Error ? error.message : "请检查格式",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    clearTempleData();
    const reset = getTempleData();
    await persistTemples(reset);
    toast({ title: "已恢复默认数据", description: `共 ${reset.length} 条记录。` });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">数据管理后台</h1>
            <p className="text-sm text-muted-foreground">
              以 Firestore（beijing_temples）为准展示与编辑场所；修改后地图与筛选列表会同步更新。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => void loadFromFirestore()}
              disabled={isLoading || isSyncing}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              从 Firestore 刷新
            </Button>
            <Link to="/beijing">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回地图
              </Button>
            </Link>
          </div>
        </div>

        {isLoading && temples.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            正在从 Firestore 加载寺庙数据…
          </div>
        ) : (
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">列表管理</TabsTrigger>
            <TabsTrigger value="json">JSON 编辑器</TabsTrigger>
            <TabsTrigger value="io">导入导出</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>新增场所</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 max-w-xl">
                <Field label="名称" htmlFor="add-name">
                  <Input
                    id="add-name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </Field>
                <Field label="地点" htmlFor="add-location">
                  <Input
                    id="add-location"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  />
                </Field>
                <Field label="宗教类型">
                  <Select
                    value={form.religion}
                    onValueChange={(value) =>
                      setForm((p) => ({ ...p, religion: value as Temple["religion"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELIGION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="建立年份" htmlFor="add-year">
                  <Input
                    id="add-year"
                    type="number"
                    value={form.establishedYear}
                    onChange={(e) => setForm((p) => ({ ...p, establishedYear: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="状态">
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((p) => ({ ...p, status: value as Temple["status"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="图片 URL（可选）" htmlFor="add-image">
                  <Input
                    id="add-image"
                    value={form.imageUrl}
                    onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  />
                </Field>
                <Field label="经度" htmlFor="add-lng">
                  <Input
                    id="add-lng"
                    type="number"
                    value={form.lng}
                    onChange={(e) => setForm((p) => ({ ...p, lng: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="纬度" htmlFor="add-lat">
                  <Input
                    id="add-lat"
                    type="number"
                    value={form.lat}
                    onChange={(e) => setForm((p) => ({ ...p, lat: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="简介（可选）" htmlFor="add-description">
                  <Textarea
                    id="add-description"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </Field>
                <Field label="历史背景（可选）" htmlFor="add-history">
                  <Textarea
                    id="add-history"
                    value={form.historicalBackground}
                    onChange={(e) => setForm((p) => ({ ...p, historicalBackground: e.target.value }))}
                  />
                </Field>
                <Field label="建筑特点（可选）" htmlFor="add-architecture">
                  <Textarea
                    id="add-architecture"
                    value={form.architecturalFeatures}
                    onChange={(e) => setForm((p) => ({ ...p, architecturalFeatures: e.target.value }))}
                  />
                </Field>
                <Field label="开放时间（可选）" htmlFor="add-hours">
                  <Input
                    id="add-hours"
                    value={form.openingHours}
                    onChange={(e) => setForm((p) => ({ ...p, openingHours: e.target.value }))}
                  />
                </Field>
                <Button onClick={handleAddTemple} disabled={isSyncing} className="w-fit">
                  <Plus className="h-4 w-4 mr-2" />
                  添加场所
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>现有场所（{sortedTemples.length}）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[380px] overflow-y-auto">
                {sortedTemples.map((temple) => (
                  <div key={temple.id} className="p-3 rounded-md border space-y-3">
                    {editingTempleId === temple.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input value={editingForm.name} onChange={(e) => setEditingForm((prev) => ({ ...prev, name: e.target.value }))} />
                        <Input value={editingForm.location} onChange={(e) => setEditingForm((prev) => ({ ...prev, location: e.target.value }))} />
                        <Select
                          value={editingForm.religion}
                          onValueChange={(value) =>
                            setEditingForm((prev) => ({
                              ...prev,
                              religion: value as Temple["religion"],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择宗教类型" />
                          </SelectTrigger>
                          <SelectContent>
                            {RELIGION_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input type="number" value={editingForm.establishedYear} onChange={(e) => setEditingForm((prev) => ({ ...prev, establishedYear: Number(e.target.value) }))} />
                        <Select
                          value={editingForm.status}
                          onValueChange={(value) =>
                            setEditingForm((prev) => ({
                              ...prev,
                              status: value as Temple["status"],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择状态" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input value={editingForm.imageUrl} onChange={(e) => setEditingForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
                        <Input type="number" value={editingForm.lng} onChange={(e) => setEditingForm((prev) => ({ ...prev, lng: Number(e.target.value) }))} />
                        <Input type="number" value={editingForm.lat} onChange={(e) => setEditingForm((prev) => ({ ...prev, lat: Number(e.target.value) }))} />
                        <Textarea className="md:col-span-2" placeholder="简介" value={editingForm.description} onChange={(e) => setEditingForm((prev) => ({ ...prev, description: e.target.value }))} />
                        <Textarea className="md:col-span-2" placeholder="历史背景" value={editingForm.historicalBackground} onChange={(e) => setEditingForm((prev) => ({ ...prev, historicalBackground: e.target.value }))} />
                        <Textarea className="md:col-span-2" placeholder="建筑特点" value={editingForm.architecturalFeatures} onChange={(e) => setEditingForm((prev) => ({ ...prev, architecturalFeatures: e.target.value }))} />
                        <Input className="md:col-span-2" placeholder="开放时间" value={editingForm.openingHours} onChange={(e) => setEditingForm((prev) => ({ ...prev, openingHours: e.target.value }))} />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{temple.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {temple.id} | {temple.location} | {temple.establishedYear} | {temple.religion}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {editingTempleId === temple.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSaveEditTemple(temple.id)} disabled={isSyncing}>
                            保存
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEditTemple} disabled={isSyncing}>
                            取消
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleStartEditTemple(temple)} disabled={isSyncing}>
                            编辑
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteTemple(temple.id)} disabled={isSyncing}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>原始 JSON 编辑器</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="min-h-[420px] font-mono text-xs"
                />
                <Button onClick={handleApplyJson} disabled={isSyncing}>
                  <Save className="h-4 w-4 mr-2" />
                  应用 JSON
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="io" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>导入 / 导出</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <label>
                  <input type="file" accept="application/json" className="hidden" onChange={handleImportFile} disabled={isSyncing} />
                  <Button asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      导入 JSON
                    </span>
                  </Button>
                </label>
                <Button variant="outline" onClick={handleExportJson} disabled={isSyncing}>
                  <Download className="h-4 w-4 mr-2" />
                  导出 JSON
                </Button>
                <Button variant="destructive" onClick={handleReset} disabled={isSyncing}>
                  恢复默认数据
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}

