import { collection, doc, setDoc, GeoPoint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { templesData } from "@/data/templesData";

/**
 * 将寺庙数据导入到 Firestore
 */
export async function importTemples() {
  console.log("开始导入寺庙数据到 Firestore...");
  
  try {
    // 获取 temples 集合的引用
    const templesCollection = collection(db, "temples");
    
    // 遍历所有寺庙数据
    for (const temple of templesData) {
      // 处理坐标数据 - 转换为 Firestore 的 GeoPoint 类型
      const processedTemple = {
        ...temple,
        coordinates: new GeoPoint(temple.coordinates[1], temple.coordinates[0]) // 注意：GeoPoint 的参数顺序是 (latitude, longitude)
      };
      
      // 使用寺庙的 id 作为文档 ID
      const templeDoc = doc(templesCollection, temple.id);
      
      // 将数据写入 Firestore
      await setDoc(templeDoc, processedTemple);
      
      console.log(`✅ 成功导入寺庙: ${temple.name} (ID: ${temple.id})`);
    }
    
    console.log(`🎉 所有 ${templesData.length} 个寺庙数据导入完成！`);
    
  } catch (error) {
    console.error("❌ 导入数据时发生错误:", error);
    throw error;
  }
}

/**
 * 用于在浏览器控制台中调用的便捷函数
 * 在浏览器中打开应用，然后在控制台中运行：window.importTemples()
 */
if (typeof window !== 'undefined') {
  (window as any).importTemples = importTemples;
} 