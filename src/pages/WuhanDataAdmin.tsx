import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2, Plus, RefreshCw, Save, Trash2, Upload } from "lucide-react";
import { Temple, TempleFormState } from "@/types/temple";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { TempleAdminFields } from "@/components/TempleAdminFields";
import {
  createEmptyTempleForm,
  formToTempleFields,
  normalizeTemple,
  templeToForm,
} from "@/lib/templeDataManager";
import {
  clearWuhanTempleData as clearTempleData,
  generateWuhanTempleId as generateBeijingTempleId,
  getWuhanTempleData as getTempleData,
  saveWuhanTempleData as saveTempleData,
} from "@/lib/wuhanDataManager";
import {
  deleteTempleFromFirestore,
  getTemples,
  syncTemplesToFirestore,
} from "@/services/wuhanTempleService";

const EMPTY_FORM: TempleFormState = createEmptyTempleForm(114.3055, 30.5928);

export default function WuhanDataAdmin() {
  const queryClient = useQueryClient();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [jsonText, setJsonText] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingTempleId, setEditingTempleId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);

  const invalidateMapCache = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["wuhan-temples"] });
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
      toast({ title: "缺少必填项", description: "请至少填写寺庙名称和地址。", variant: "destructive" });
      return;
    }
    const temple: Temple = {
      id: generateBeijingTempleId(form.religion, temples),
      ...formToTempleFields(form),
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
    setEditingForm(templeToForm(temple));
  };

  const handleCancelEditTemple = () => {
    setEditingTempleId(null);
    setEditingForm(EMPTY_FORM);
  };

  const handleSaveEditTemple = async (id: string) => {
    if (!editingForm.name.trim() || !editingForm.location.trim()) {
      toast({ title: "缺少必填项", description: "请至少填写寺庙名称和地址。", variant: "destructive" });
      return;
    }

    const next = temples.map((temple) =>
      temple.id === id
        ? {
            ...temple,
            ...formToTempleFields(editingForm),
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
    a.download = "wuhan-temples-data.json";
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
            <h1 className="text-2xl font-bold">武汉数据管理后台</h1>
            <p className="text-sm text-muted-foreground">
              以 Firestore（wuhan_temples）为准展示与编辑场所；修改后地图与筛选列表会同步更新。
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
            <Link to="/wuhan">
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
                <TempleAdminFields form={form} onChange={setForm} idPrefix="add" />
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
                      <TempleAdminFields
                        form={editingForm}
                        onChange={setEditingForm}
                        idPrefix={`edit-${temple.id}`}
                      />
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

