import { templesData } from "@/data/templesData";
import { Temple } from "@/types/temple";

const TEMPLE_STORAGE_KEY = "beijing-faith-explorer:temples";

const isTemple = (value: unknown): value is Temple => {
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
    typeof candidate.description === "string" &&
    typeof candidate.imageUrl === "string" &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number" &&
    Array.isArray(candidate.relatedPeople) &&
    Array.isArray(candidate.relatedEvents)
  );
};

export const getTempleData = (): Temple[] => {
  if (typeof window === "undefined") return templesData;
  const raw = window.localStorage.getItem(TEMPLE_STORAGE_KEY);
  if (!raw) return templesData;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return templesData;
    const validated = parsed.filter(isTemple);
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

