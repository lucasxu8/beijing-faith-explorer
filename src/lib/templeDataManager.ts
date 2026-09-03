import { templesData } from "@/data/templesData";
import { Temple, TempleFormState } from "@/types/temple";

const TEMPLE_STORAGE_KEY = "beijing-faith-explorer:temples";
const BEIJING_ID_PREFIX = "beijing_temples";

const isTempleLike = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const coordinates = candidate.coordinates;
  const validReligion = ["buddhism", "taoism", "catholic", "islam"].includes(String(candidate.religion));
  const validStatus = ["active", "renovation", "ruins"].includes(String(candidate.status));
  const hasName = typeof candidate.name === "string";
  const hasAddress = typeof candidate.location === "string" || typeof candidate.address === "string";
  return (
    typeof candidate.id === "string" &&
    hasName &&
    hasAddress &&
    validReligion &&
    validStatus &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    Number.isFinite(Number(coordinates[0])) &&
    Number.isFinite(Number(coordinates[1]))
  );
};

const parseStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,，\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const asText = (value: unknown): string => (value == null ? "" : String(value));

/** 将相关人物数组转为表单文本 */
export const formatRelatedPeopleText = (people: string[]): string => people.join("，");

/** 将表单文本解析为相关人物数组 */
export const parseRelatedPeopleText = (text: string): string[] => parseStringList(text);

export const createEmptyTempleForm = (lng: number, lat: number): TempleFormState => ({
  name: "",
  aliases: "",
  religion: "buddhism",
  location: "",
  lng,
  lat,
  status: "active",
  establishedYear: 2000,
  description: "",
  coreArchitecture: "",
  openingHours: "",
  tickets: "",
  fixedActivitiesFestivals: "",
  relatedPeopleText: "",
  religiousActivities: "",
  volunteers: "",
  visitorFlow: "",
  templeNotes: "",
  dataSource: "",
  collector: "",
  collectedDate: "",
  imageUrl: "",
  verificationNotes: "",
});

export const templeToForm = (temple: Temple): TempleFormState => ({
  name: temple.name,
  aliases: temple.aliases,
  religion: temple.religion,
  location: temple.location,
  lng: temple.coordinates[0],
  lat: temple.coordinates[1],
  status: temple.status,
  establishedYear: temple.establishedYear,
  description: temple.description,
  coreArchitecture: temple.coreArchitecture,
  openingHours: temple.openingHours,
  tickets: temple.tickets,
  fixedActivitiesFestivals: temple.fixedActivitiesFestivals,
  relatedPeopleText: formatRelatedPeopleText(temple.relatedPeople),
  religiousActivities: temple.religiousActivities,
  volunteers: temple.volunteers,
  visitorFlow: temple.visitorFlow,
  templeNotes: temple.templeNotes,
  dataSource: temple.dataSource,
  collector: temple.collector,
  collectedDate: temple.collectedDate,
  imageUrl: temple.imageUrl,
  verificationNotes: temple.verificationNotes,
});

export const formToTempleFields = (form: TempleFormState): Omit<Temple, "id"> => ({
  name: form.name.trim(),
  aliases: form.aliases.trim(),
  religion: form.religion,
  location: form.location.trim(),
  coordinates: [Number(form.lng), Number(form.lat)],
  status: form.status,
  establishedYear: Number(form.establishedYear) || 0,
  description: form.description.trim() || "待补充描述",
  coreArchitecture: form.coreArchitecture.trim(),
  openingHours: form.openingHours.trim(),
  tickets: form.tickets.trim(),
  fixedActivitiesFestivals: form.fixedActivitiesFestivals.trim(),
  relatedPeople: parseRelatedPeopleText(form.relatedPeopleText),
  religiousActivities: form.religiousActivities.trim(),
  volunteers: form.volunteers.trim(),
  visitorFlow: form.visitorFlow.trim(),
  templeNotes: form.templeNotes.trim(),
  dataSource: form.dataSource.trim(),
  collector: form.collector.trim(),
  collectedDate: form.collectedDate.trim(),
  imageUrl: form.imageUrl.trim(),
  verificationNotes: form.verificationNotes.trim(),
});

export const searchableTempleText = (temple: Temple): string =>
  [
    temple.name,
    temple.aliases,
    temple.location,
    temple.description,
    temple.coreArchitecture,
    temple.openingHours,
    temple.tickets,
    temple.fixedActivitiesFestivals,
    temple.religiousActivities,
    temple.volunteers,
    temple.visitorFlow,
    temple.templeNotes,
    temple.dataSource,
    temple.collector,
    temple.collectedDate,
    temple.verificationNotes,
    temple.religion,
    String(temple.establishedYear),
    ...temple.relatedPeople,
  ].join(" ");

/** Firestore 文档字段（不含 GeoPoint，由 service 层写入 coordinates） */
export const templeDocumentFields = (temple: Temple) => ({
  id: temple.id,
  name: temple.name ?? "",
  aliases: temple.aliases ?? "",
  religion: temple.religion,
  location: temple.location ?? "",
  status: temple.status,
  establishedYear: Number(temple.establishedYear) || 0,
  description: temple.description ?? "",
  coreArchitecture: temple.coreArchitecture ?? "",
  openingHours: temple.openingHours ?? "",
  tickets: temple.tickets ?? "",
  fixedActivitiesFestivals: temple.fixedActivitiesFestivals ?? "",
  relatedPeople: Array.isArray(temple.relatedPeople) ? temple.relatedPeople : [],
  religiousActivities: temple.religiousActivities ?? "",
  volunteers: temple.volunteers ?? "",
  visitorFlow: temple.visitorFlow ?? "",
  templeNotes: temple.templeNotes ?? "",
  dataSource: temple.dataSource ?? "",
  collector: temple.collector ?? "",
  collectedDate: temple.collectedDate ?? "",
  imageUrl: temple.imageUrl ?? "",
  verificationNotes: temple.verificationNotes ?? "",
});

/** 将部分/旧数据规范为完整 Temple（兼容旧字段名） */
export const normalizeTemple = (raw: Record<string, unknown>): Temple => {
  const coordinates = raw.coordinates as [number, number];
  const establishedYear = Number(
    raw.establishedYear ?? raw["始建年代"] ?? 0
  );
  return {
    id: String(raw.id),
    name: asText(raw.name ?? raw["寺庙名称"]),
    aliases: asText(raw.aliases ?? raw["别名/曾用名"] ?? raw.alias),
    religion: raw.religion as Temple["religion"],
    location: asText(raw.location ?? raw.address ?? raw["地址"]),
    coordinates,
    status: raw.status as Temple["status"],
    establishedYear: Number.isFinite(establishedYear) ? establishedYear : 0,
    description: asText(raw.description ?? raw["简介"]),
    coreArchitecture: asText(
      raw.coreArchitecture ?? raw.architecturalFeatures ?? raw["核心建筑"] ?? raw["建筑特点"]
    ),
    openingHours: asText(raw.openingHours ?? raw["开放时间"]),
    tickets: asText(raw.tickets ?? raw["门票"]),
    fixedActivitiesFestivals: asText(
      raw.fixedActivitiesFestivals ?? raw["固定活动/重大宗教节日"] ?? raw["固定活动/重大佛教节日"]
    ),
    relatedPeople: parseStringList(raw.relatedPeople ?? raw["相关人物"]),
    religiousActivities: asText(
      raw.religiousActivities ?? raw.prayerBlessing ?? raw["宗教活动内容"] ?? raw["祈福方式"]
    ),
    volunteers: asText(raw.volunteers ?? raw["义工情况"]),
    visitorFlow: asText(
      raw.visitorFlow ?? raw.incenseStatus ?? raw["人流/香火情况"] ?? raw["香火情况"]
    ),
    templeNotes: asText(raw.templeNotes ?? raw["寺庙注意事项"]),
    dataSource: asText(raw.dataSource ?? raw["数据来源"]),
    collector: asText(raw.collector ?? raw["采集人"]),
    collectedDate: asText(raw.collectedDate ?? raw["采集日期"]),
    imageUrl: asText(raw.imageUrl ?? raw.photoUrl ?? raw["照片链接"]),
    verificationNotes: asText(raw.verificationNotes ?? raw["待核实备注"]),
  };
};

/**
 * 生成规范化文档 ID，例如 beijing_temples_taoism_001
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
