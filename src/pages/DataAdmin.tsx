import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Plus, Save, Trash2, Upload } from "lucide-react";
import { Temple } from "@/types/temple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { clearTempleData, getTempleData, saveTempleData } from "@/lib/templeDataManager";
import { syncTemplesToFirestore } from "@/services/templeService";

const EMPTY_FORM = {
  name: "",
  location: "",
  religion: "buddhism" as Temple["religion"],
  establishedYear: 2000,
  status: "active" as Temple["status"],
  description: "",
  imageUrl: "",
  lng: 116.404,
  lat: 39.915,
};

export default function DataAdmin() {
  const [temples, setTemples] = useState<Temple[]>(() => getTempleData());
  const [jsonText, setJsonText] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingTempleId, setEditingTempleId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);

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
      id: `custom_${Date.now()}`,
      name: form.name.trim(),
      location: form.location.trim(),
      religion: form.religion,
      establishedYear: Number(form.establishedYear),
      status: form.status,
      description: form.description.trim() || "待补充描述",
      imageUrl: form.imageUrl.trim() || "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
      coordinates: [Number(form.lng), Number(form.lat)],
      relatedPeople: [],
      relatedEvents: [],
    };
    const next = [...temples, temple];
    await persistTemples(next);
    setForm(EMPTY_FORM);
    toast({ title: "已新增场所", description: temple.name });
  };

  const handleDeleteTemple = async (id: string) => {
    const next = temples.filter((temple) => temple.id !== id);
    await persistTemples(next);
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
      await persistTemples(parsed as Temple[]);
      toast({ title: "导入成功", description: `已导入 ${parsed.length} 条记录。` });
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
      await persistTemples(parsed as Temple[]);
      toast({ title: "JSON 已应用", description: `当前共 ${parsed.length} 条记录。` });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">数据管理后台</h1>
            <p className="text-sm text-muted-foreground">维护寺庙场所数据，支持增删、导入导出和 JSON 编辑。</p>
          </div>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回地图
            </Button>
          </Link>
        </div>

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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="名称" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                <Input placeholder="地点" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
                <Input placeholder="宗教(buddhism/catholic/islam/taoism)" value={form.religion} onChange={(e) => setForm((p) => ({ ...p, religion: e.target.value as Temple["religion"] }))} />
                <Input placeholder="建立年份" type="number" value={form.establishedYear} onChange={(e) => setForm((p) => ({ ...p, establishedYear: Number(e.target.value) }))} />
                <Input placeholder="状态(active/renovation/ruins)" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Temple["status"] }))} />
                <Input placeholder="图片URL(可选)" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
                <Input placeholder="经度" type="number" value={form.lng} onChange={(e) => setForm((p) => ({ ...p, lng: Number(e.target.value) }))} />
                <Input placeholder="纬度" type="number" value={form.lat} onChange={(e) => setForm((p) => ({ ...p, lat: Number(e.target.value) }))} />
                <Textarea className="md:col-span-2" placeholder="描述(可选)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                <div className="md:col-span-2">
                  <Button onClick={handleAddTemple} disabled={isSyncing}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加场所
                  </Button>
                </div>
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
                        <Input value={editingForm.religion} onChange={(e) => setEditingForm((prev) => ({ ...prev, religion: e.target.value as Temple["religion"] }))} />
                        <Input type="number" value={editingForm.establishedYear} onChange={(e) => setEditingForm((prev) => ({ ...prev, establishedYear: Number(e.target.value) }))} />
                        <Input value={editingForm.status} onChange={(e) => setEditingForm((prev) => ({ ...prev, status: e.target.value as Temple["status"] }))} />
                        <Input value={editingForm.imageUrl} onChange={(e) => setEditingForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
                        <Input type="number" value={editingForm.lng} onChange={(e) => setEditingForm((prev) => ({ ...prev, lng: Number(e.target.value) }))} />
                        <Input type="number" value={editingForm.lat} onChange={(e) => setEditingForm((prev) => ({ ...prev, lat: Number(e.target.value) }))} />
                        <Textarea className="md:col-span-2" value={editingForm.description} onChange={(e) => setEditingForm((prev) => ({ ...prev, description: e.target.value }))} />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{temple.name}</div>
                        <div className="text-xs text-muted-foreground">{temple.location} | {temple.establishedYear} | {temple.religion}</div>
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
      </div>
    </div>
  );
}

