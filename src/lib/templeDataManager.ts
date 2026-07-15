import { templesData } from "@/data/templesData";
import { Temple } from "@/types/temple";

const TEMPLE_STORAGE_KEY = "beijing-faith-explorer:temples";
const BEIJING_ID_PREFIX = "beijing_temples";

const isTempleLike = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const coordinates = candidate.coordinates;
  const validReligion = ["buddhism", "taoism", "catholic", "islam"].includes(String(candidate.religion));
  const validStatus = ["active", "renovation", "ruins"].includes(String(candidate.status));
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.location === "string" &&
    validReligion &&
    typeof candidate.establishedYear === "number" &&
    validStatus &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number" &&
    Array.isArray(candidate.relatedPeople) &&
    Array.isArray(candidate.relatedEvents)
  );
};

/** 将部分/旧数据规范为完整 Temple（兼容缺省字段与中文字段名） */
export const normalizeTemple = (raw: Record<string, unknown>): Temple => {
  const coordinates = raw.coordinates as [number, number];
  return {
    id: String(raw.id),
    name: String(raw.name ?? ""),
    location: String(raw.location ?? ""),
    religion: raw.religion as Temple["religion"],
    establishedYear: Number(raw.establishedYear ?? 0),
    status: raw.status as Temple["status"],
    description: String(raw.description ?? ""),
    historicalBackground: String(
      raw.historicalBackground ?? raw["历史背景"] ?? ""
    ),
    architecturalFeatures: String(
      raw.architecturalFeatures ?? raw["建筑特点"] ?? ""
    ),
    openingHours: String(raw.openingHours ?? raw["开放时间"] ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    coordinates,
    relatedPeople: (raw.relatedPeople as string[]) ?? [],
    relatedEvents: (raw.relatedEvents as string[]) ?? [],
  };
};

/**
 * 生成规范化文档 ID，例如 beijing_temples_taoism_001
 * 按同宗教现有编号取最大值 + 1
 */
export const generateBeijingTempleId = (
  religion: Temple["religion"],
  existing: Temple[]
): string => {
  const pattern = new RegExp(`^${BEIJING_ID_PREFIX}_${religion}_(\\d+)$`);
  let maxSeq = 0;

  for (const temple of existing) {
    const match = temple.id.match(pattern);
    if (match) {
      maxSeq = Math.max(maxSeq, Number(match[1]));
    }
  }

  // 若尚无规范 ID，则从该宗教现有条数起算，减少与旧数据并存时的重号风险
  if (maxSeq === 0) {
    maxSeq = existing.filter((temple) => temple.religion === religion).length;
  }

  const next = maxSeq + 1;
  return `${BEIJING_ID_PREFIX}_${religion}_${String(next).padStart(3, "0")}`;
};

export const getTempleData = (): Temple[] => {
  if (typeof window === "undefined") return templesData;
  const raw = window.localStorage.getItem(TEMPLE_STORAGE_KEY);
  if (!raw) return templesData;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return templesData;
    const validated = parsed
      .filter(isTempleLike)
      .map((item) => normalizeTemple(item));
    return validated.length > 0 ? validated : templesData;
  } catch (_error) {
    return templesData;
  }
};

export const saveTempleData = (temples: Temple[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLE_STORAGE_KEY, JSON.stringify(temples));
};

export const clearTempleData = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEMPLE_STORAGE_KEY);
};
