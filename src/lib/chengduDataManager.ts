import { chengduTemplesData } from "@/data/chengduTemplesData";
import { Temple } from "@/types/temple";
import { normalizeTemple } from "@/lib/templeDataManager";

const TEMPLE_STORAGE_KEY = "beijing-faith-explorer:chengdu-temples";
const CHENGDU_ID_PREFIX = "chengdu_temples";

const isTempleLike = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const coordinates = candidate.coordinates;
  const validReligion = ["buddhism", "taoism", "catholic", "islam"].includes(String(candidate.religion));
  const validStatus = ["active", "renovation", "ruins"].includes(String(candidate.status));
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (typeof candidate.location === "string" || typeof candidate.address === "string") &&
    validReligion &&
    validStatus &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  );
};

/**
 * 生成规范化文档 ID，例如 chengdu_temples_taoism_001
 */
export const generateChengduTempleId = (
  religion: Temple["religion"],
  existing: Temple[]
): string => {
  const pattern = new RegExp(`^${CHENGDU_ID_PREFIX}_${religion}_(\\d+)$`);
  let maxSeq = 0;

  for (const temple of existing) {
    const match = temple.id.match(pattern);
    if (match) {
      maxSeq = Math.max(maxSeq, Number(match[1]));
    }
  }

  if (maxSeq === 0) {
    maxSeq = existing.filter((temple) => temple.religion === religion).length;
  }

  const next = maxSeq + 1;
  return `${CHENGDU_ID_PREFIX}_${religion}_${String(next).padStart(3, "0")}`;
};

export const getChengduTempleData = (): Temple[] => {
  if (typeof window === "undefined") return chengduTemplesData;
  const raw = window.localStorage.getItem(TEMPLE_STORAGE_KEY);
  if (!raw) return chengduTemplesData;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return chengduTemplesData;
    const validated = parsed
      .filter(isTempleLike)
      .map((item) => normalizeTemple(item));
    return validated.length > 0 ? validated : chengduTemplesData;
  } catch (_error) {
    return chengduTemplesData;
  }
};

export const saveChengduTempleData = (temples: Temple[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLE_STORAGE_KEY, JSON.stringify(temples));
};

export const clearChengduTempleData = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEMPLE_STORAGE_KEY);
};
