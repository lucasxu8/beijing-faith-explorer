import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { importTemples } from "@/scripts/importTemples";
import { templesData } from "@/data/templesData";

export const ImportData = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus('idle');
    setErrorMessage("");

    try {
      await importTemples();
      setImportStatus('success');
    } catch (error) {
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "导入失败");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold golden-accent mb-2">
            数据导入工具
          </h1>
          <p className="text-muted-foreground">
            将寺庙数据导入到 Firebase Firestore 数据库
          </p>
        </div>

        <Card className="elegant-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              导入寺庙数据
            </CardTitle>
            <CardDescription>
              这将会把所有 {templesData.length} 个重庆地区的宗教场所数据导入到您的 Firestore 数据库中。
              每个场所将作为一个单独的文档存储在 "temples" 集合中。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 导入前的提示信息 */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>注意：</strong> 导入前请确保您已经在 
                <code className="bg-muted px-1 rounded">src/lib/firebase.ts</code> 
                文件中正确配置了您的 Firebase 项目信息。
              </AlertDescription>
            </Alert>

            {/* 状态显示 */}
            {importStatus === 'success' && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  🎉 数据导入成功！所有 {templesData.length} 个场所数据已成功导入到 Firestore 中。
                  您现在可以在 Firebase 控制台中查看这些数据。
                </AlertDescription>
              </Alert>
            )}

            {importStatus === 'error' && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  ❌ 导入失败：{errorMessage}
                  <br />
                  请检查您的 Firebase 配置和网络连接。
                </AlertDescription>
              </Alert>
            )}

            {/* 导入按钮 */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleImport}
                disabled={isImporting}
                size="lg"
                className="smooth-button"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    正在导入数据...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    开始导入
                  </>
                )}
              </Button>
            </div>

            {/* 数据预览 */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">将要导入的数据预览：</h3>
              <ul className="text-sm text-muted-foreground space-y-1 max-h-48 overflow-y-auto">
                {templesData.map(temple => (
                  <li key={temple.id}>
                    • {temple.name} ({temple.religion}, {temple.establishedYear}年)
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 