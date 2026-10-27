import { wuhanTemplesData } from "@/data/wuhanTemplesData";
import { Temple } from "@/types/temple";
import { normalizeTemple } from "@/lib/templeDataManager";

const TEMPLE_STORAGE_KEY = "beijing-faith-explorer:wuhan-temples";
const WUHAN_ID_PREFIX = "wuhan_temples";

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
 * 生成规范化文档 ID，例如 wuhan_temples_taoism_001
 */
export const generateWuhanTempleId = (
  religion: Temple["religion"],
  existing: Temple[]
): string => {
  const pattern = new RegExp(`^${WUHAN_ID_PREFIX}_${religion}_(\\d+)$`);
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
  return `${WUHAN_ID_PREFIX}_${religion}_${String(next).padStart(3, "0")}`;
};

export const getWuhanTempleData = (): Temple[] => {
  if (typeof window === "undefined") return wuhanTemplesData;
  const raw = window.localStorage.getItem(TEMPLE_STORAGE_KEY);
  if (!raw) return wuhanTemplesData;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return wuhanTemplesData;
    const validated = parsed
      .filter(isTempleLike)
      .map((item) => normalizeTemple(item));
    return validated.length > 0 ? validated : wuhanTemplesData;
  } catch (_error) {
    return wuhanTemplesData;
  }
};

export const saveWuhanTempleData = (temples: Temple[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLE_STORAGE_KEY, JSON.stringify(temples));
};

export const clearWuhanTempleData = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEMPLE_STORAGE_KEY);
};
