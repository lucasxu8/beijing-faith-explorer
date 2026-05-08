import { collection, getDocs, doc, getDoc, query, where, orderBy, GeoPoint, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Temple } from "@/types/temple";

/**
 * 从 Firestore 获取所有寺庙数据
 */
export const getTemples = async (): Promise<Temple[]> => {
  try {
    console.log("开始从 Firestore 获取寺庙数据...");
    
    const templesCollection = collection(db, "temples");
    const querySnapshot = await getDocs(templesCollection);
    
    const temples: Temple[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // 处理 GeoPoint 转换为坐标数组
      let coordinates: [number, number] = [0, 0];
      if (data.coordinates && data.coordinates instanceof GeoPoint) {
        coordinates = [data.coordinates.longitude, data.coordinates.latitude];
      }
      
      // 确保数据符合 Temple 接口
      const temple: Temple = {
        id: doc.id,
        name: data.name || "",
        location: data.location || "",
        religion: data.religion || "buddhism",
        establishedYear: data.establishedYear || 0,
        status: data.status || "active",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        coordinates,
        relatedPeople: data.relatedPeople || [],
        relatedEvents: data.relatedEvents || []
      };
      
      temples.push(temple);
    });
    
    console.log(`✅ 成功获取 ${temples.length} 个寺庙数据`);
    return temples;
    
  } catch (error) {
    console.error("❌ 获取寺庙数据时发生错误:", error);
    throw new Error(`获取寺庙数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 根据 ID 获取单个寺庙数据
 */
export const getTempleById = async (templeId: string): Promise<Temple | null> => {
  try {
    const templeDoc = doc(db, "temples", templeId);
    const docSnap = await getDoc(templeDoc);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    
    // 处理 GeoPoint 转换
    let coordinates: [number, number] = [0, 0];
    if (data.coordinates && data.coordinates instanceof GeoPoint) {
      coordinates = [data.coordinates.longitude, data.coordinates.latitude];
    }
    
    return {
      id: docSnap.id,
      name: data.name || "",
      location: data.location || "",
      religion: data.religion || "buddhism",
      establishedYear: data.establishedYear || 0,
      status: data.status || "active",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      coordinates,
      relatedPeople: data.relatedPeople || [],
      relatedEvents: data.relatedEvents || []
    };
    
  } catch (error) {
    console.error(`❌ 获取寺庙 ${templeId} 数据时发生错误:`, error);
    throw error;
  }
};

/**
 * 根据宗教类型筛选寺庙
 */
export const getTemplesByReligion = async (religions: string[]): Promise<Temple[]> => {
  if (religions.length === 0) {
    return getTemples();
  }
  
  try {
    const templesCollection = collection(db, "temples");
    const q = query(
      templesCollection,
      where("religion", "in", religions),
      orderBy("establishedYear")
    );
    
    const querySnapshot = await getDocs(q);
    const temples: Temple[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      let coordinates: [number, number] = [0, 0];
      if (data.coordinates && data.coordinates instanceof GeoPoint) {
        coordinates = [data.coordinates.longitude, data.coordinates.latitude];
      }
      
      temples.push({
        id: doc.id,
        name: data.name || "",
        location: data.location || "",
        religion: data.religion || "buddhism",
        establishedYear: data.establishedYear || 0,
        status: data.status || "active",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        coordinates,
        relatedPeople: data.relatedPeople || [],
        relatedEvents: data.relatedEvents || []
      });
    });
    
    return temples;
    
  } catch (error) {
    console.error("❌ 根据宗教筛选寺庙时发生错误:", error);
    throw error;
  }
}; 

/**
 * 全量同步寺庙数据到 Firestore（包含新增、更新、删除）
 */
export const syncTemplesToFirestore = async (temples: Temple[]): Promise<void> => {
  const templesCollection = collection(db, "temples");
  const snapshot = await getDocs(templesCollection);
  const existingIds = new Set(snapshot.docs.map((item) => item.id));
  const nextIds = new Set(temples.map((temple) => temple.id));

  const batch = writeBatch(db);

  temples.forEach((temple) => {
    const templeRef = doc(templesCollection, temple.id);
    batch.set(templeRef, {
      ...temple,
      coordinates: new GeoPoint(temple.coordinates[1], temple.coordinates[0]),
    });
  });

  existingIds.forEach((id) => {
    if (!nextIds.has(id)) {
      const templeRef = doc(templesCollection, id);
      batch.delete(templeRef);
    }
  });

  await batch.commit();
};