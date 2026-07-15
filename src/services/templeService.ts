import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  GeoPoint,
  writeBatch,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeTemple } from "@/lib/templeDataManager";
import { Temple } from "@/types/temple";

const COLLECTION = "beijing_temples";
const BATCH_LIMIT = 450;

const mapDocToTemple = (id: string, data: Record<string, unknown>): Temple => {
  let coordinates: [number, number] = [0, 0];
  if (data.coordinates instanceof GeoPoint) {
    coordinates = [data.coordinates.longitude, data.coordinates.latitude];
  } else if (Array.isArray(data.coordinates) && data.coordinates.length === 2) {
    coordinates = [Number(data.coordinates[0]), Number(data.coordinates[1])];
  }
  return normalizeTemple({ ...data, id, coordinates });
};

const stripUndefined = <T extends Record<string, unknown>>(value: T): T => {
  return Object.fromEntries(
    Object.entries(value).filter(([, field]) => field !== undefined)
  ) as T;
};

const toFirestorePayload = (temple: Temple) => {
  const lng = Number(temple.coordinates?.[0]);
  const lat = Number(temple.coordinates?.[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(`寺庙「${temple.name || temple.id}」坐标无效，无法同步`);
  }

  return stripUndefined({
    id: temple.id,
    name: temple.name ?? "",
    location: temple.location ?? "",
    religion: temple.religion,
    establishedYear: Number(temple.establishedYear) || 0,
    status: temple.status,
    description: temple.description ?? "",
    historicalBackground: temple.historicalBackground ?? "",
    architecturalFeatures: temple.architecturalFeatures ?? "",
    openingHours: temple.openingHours ?? "",
    imageUrl: temple.imageUrl ?? "",
    relatedPeople: Array.isArray(temple.relatedPeople) ? temple.relatedPeople : [],
    relatedEvents: Array.isArray(temple.relatedEvents) ? temple.relatedEvents : [],
    volunteers: temple.volunteers ?? "",
    prayerBlessing: temple.prayerBlessing ?? "",
    incenseStatus: temple.incenseStatus ?? "",
    templeNotes: temple.templeNotes ?? "",
    fixedActivitiesFestivals: temple.fixedActivitiesFestivals ?? "",
    tickets: temple.tickets ?? "",
    coordinates: new GeoPoint(lat, lng),
  });
};

export const formatFirestoreError = (error: unknown): string => {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: string }).code)
      : "";
  const message = error instanceof Error ? error.message : "未知错误";

  if (code === "permission-denied" || message.includes("Missing or insufficient permissions")) {
    return "Firebase 权限不足：当前 Firestore 规则不允许写入/删除 beijing_temples。请到 Firebase 控制台 → Firestore → 规则，允许对 beijing_temples 的 create/update/delete。";
  }
  if (code === "unavailable") {
    return "无法连接 Firebase，请检查网络后重试。";
  }
  return message;
};

/**
 * 从 Firestore 获取所有寺庙数据
 */
export const getTemples = async (): Promise<Temple[]> => {
  try {
    console.log("开始从 Firestore 获取寺庙数据...");

    const templesCollection = collection(db, COLLECTION);
    const querySnapshot = await getDocs(templesCollection);

    const temples: Temple[] = [];

    querySnapshot.forEach((docSnap) => {
      temples.push(mapDocToTemple(docSnap.id, docSnap.data() as Record<string, unknown>));
    });

    console.log(`✅ 成功获取 ${temples.length} 个寺庙数据`);
    return temples;
  } catch (error) {
    console.error("❌ 获取寺庙数据时发生错误:", error);
    throw new Error(`获取寺庙数据失败: ${formatFirestoreError(error)}`);
  }
};

/**
 * 根据 ID 获取单个寺庙数据
 */
export const getTempleById = async (templeId: string): Promise<Temple | null> => {
  try {
    const templeDoc = doc(db, COLLECTION, templeId);
    const docSnap = await getDoc(templeDoc);

    if (!docSnap.exists()) {
      return null;
    }

    return mapDocToTemple(docSnap.id, docSnap.data() as Record<string, unknown>);
  } catch (error) {
    console.error(`❌ 获取寺庙 ${templeId} 数据时发生错误:`, error);
    throw new Error(formatFirestoreError(error));
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
    const templesCollection = collection(db, COLLECTION);
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
    throw new Error(formatFirestoreError(error));
  }
};

/** 删除单个文档：路径 beijing_temples/{id} */
export const deleteTempleFromFirestore = async (templeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION, templeId));
  } catch (error) {
    console.error(`❌ 删除寺庙 ${templeId} 失败:`, error);
    throw new Error(formatFirestoreError(error));
  }
};

const commitInChunks = async (
  ops: Array<(batch: ReturnType<typeof writeBatch>) => void>
) => {
  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const chunk = ops.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);
    chunk.forEach((apply) => apply(batch));
    await batch.commit();
  }
};

/**
 * 全量同步寺庙数据到 Firestore（包含新增、更新、删除）
 * 路径：beijing_temples/{id}
 */
export const syncTemplesToFirestore = async (temples: Temple[]): Promise<void> => {
  try {
    const templesCollection = collection(db, COLLECTION);
    const snapshot = await getDocs(templesCollection);
    const existingIds = new Set(snapshot.docs.map((item) => item.id));
    const nextIds = new Set(temples.map((temple) => temple.id));

    const ops: Array<(batch: ReturnType<typeof writeBatch>) => void> = [];

    temples.forEach((temple) => {
      const payload = toFirestorePayload(temple);
      const templeRef = doc(templesCollection, temple.id);
      ops.push((batch) => batch.set(templeRef, payload));
    });

    existingIds.forEach((id) => {
      if (!nextIds.has(id)) {
        const templeRef = doc(templesCollection, id);
        ops.push((batch) => batch.delete(templeRef));
      }
    });

    await commitInChunks(ops);
  } catch (error) {
    console.error("❌ 同步寺庙数据失败:", error);
    throw new Error(formatFirestoreError(error));
  }
};

/** 写入单条（新增/更新） */
export const upsertTempleToFirestore = async (temple: Temple): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTION, temple.id), toFirestorePayload(temple));
  } catch (error) {
    console.error(`❌ 写入寺庙 ${temple.id} 失败:`, error);
    throw new Error(formatFirestoreError(error));
  }
};
