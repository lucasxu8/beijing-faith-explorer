import { collection, getDocs, doc, getDoc, query, where, orderBy, GeoPoint, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeTemple } from "@/lib/templeDataManager";
import { Temple } from "@/types/temple";

const mapDocToTemple = (id: string, data: Record<string, unknown>): Temple => {
  let coordinates: [number, number] = [0, 0];
  if (data.coordinates instanceof GeoPoint) {
    coordinates = [data.coordinates.longitude, data.coordinates.latitude];
  } else if (Array.isArray(data.coordinates) && data.coordinates.length === 2) {
    coordinates = [Number(data.coordinates[0]), Number(data.coordinates[1])];
  }
  return normalizeTemple({ ...data, id, coordinates });
};

/**
 * 从 Firestore 获取所有寺庙数据
 */
export const getTemples = async (): Promise<Temple[]> => {
  try {
    console.log("开始从 Firestore 获取寺庙数据...");

    const templesCollection = collection(db, "temples");
    const querySnapshot = await getDocs(templesCollection);

    const temples: Temple[] = [];

    querySnapshot.forEach((docSnap) => {
      temples.push(mapDocToTemple(docSnap.id, docSnap.data() as Record<string, unknown>));
    });

    console.log(`✅ 成功获取 ${temples.length} 个寺庙数据`);
    return temples;
  } catch (error) {
    console.error("❌ 获取寺庙数据时发生错误:", error);
    throw new Error(`获取寺庙数据失败: ${error instanceof Error ? error.message : "未知错误"}`);
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

    return mapDocToTemple(docSnap.id, docSnap.data() as Record<string, unknown>);
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

    querySnapshot.forEach((docSnap) => {
      temples.push(mapDocToTemple(docSnap.id, docSnap.data() as Record<string, unknown>));
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
