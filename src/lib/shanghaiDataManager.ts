import { shanghaiTemplesData } from "@/data/shanghaiTemplesData";
import { Temple } from "@/types/temple";
import { normalizeTemple } from "@/lib/templeDataManager";

const TEMPLE_STORAGE_KEY = "beijing-faith-explorer:shanghai-temples";
const SHANGHAI_ID_PREFIX = "shanghai_temples";

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
    typeof coordinates[1] === "number"
  );
};

/**
 * 生成规范化文档 ID，例如 shanghai_temples_taoism_001
 */
export const generateShanghaiTempleId = (
  religion: Temple["religion"],
  existing: Temple[]
): string => {
  const pattern = new RegExp(`^${SHANGHAI_ID_PREFIX}_${religion}_(\\d+)$`);
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
  return `${SHANGHAI_ID_PREFIX}_${religion}_${String(next).padStart(3, "0")}`;
};

export const getShanghaiTempleData = (): Temple[] => {
  if (typeof window === "undefined") return shanghaiTemplesData;
  const raw = window.localStorage.getItem(TEMPLE_STORAGE_KEY);
  if (!raw) return shanghaiTemplesData;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return shanghaiTemplesData;
    const validated = parsed
      .filter(isTempleLike)
      .map((item) => normalizeTemple(item));
    return validated.length > 0 ? validated : shanghaiTemplesData;
  } catch (_error) {
    return shanghaiTemplesData;
  }
};

export const saveShanghaiTempleData = (temples: Temple[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLE_STORAGE_KEY, JSON.stringify(temples));
};

export const clearShanghaiTempleData = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEMPLE_STORAGE_KEY);
};
