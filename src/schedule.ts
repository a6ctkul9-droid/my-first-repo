import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionDay, GomiType, GomiTypeId, ScheduleData } from "./types.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadJson<T>(relativePath: string): T {
  const raw = readFileSync(join(root, relativePath), "utf-8");
  return JSON.parse(raw) as T;
}

const scheduleData = loadJson<ScheduleData>("data/schedule-a.json");
const gomiTypes = loadJson<Record<GomiTypeId, GomiType>>("data/gomi-types.json");

const DOW = ["日", "月", "火", "水", "木", "金", "土"] as const;

export function getScheduleConfig(): ScheduleData {
  return scheduleData;
}

export function getGomiType(id: GomiTypeId): GomiType {
  const type = gomiTypes[id];
  if (!type) {
    throw new Error(`Unknown gomi type: ${id}`);
  }
  return type;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateJa(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW[date.getDay()];
  return `${y}年${m}月${d}日（${dow}）`;
}

export function getCollectionForDate(date: Date): CollectionDay | null {
  const dateKey = toDateKey(date);
  const types = scheduleData.schedule[dateKey];
  if (!types || types.length === 0) {
    return null;
  }
  return { date, dateKey, types };
}

export function findNextCollection(fromDate: Date, maxDays = 14): CollectionDay | null {
  const cursor = new Date(fromDate);
  for (let i = 1; i <= maxDays; i++) {
    cursor.setDate(cursor.getDate() + 1);
    const day = getCollectionForDate(cursor);
    if (day) {
      return day;
    }
  }
  return null;
}

export function todayInJst(): Date {
  const now = new Date();
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  jst.setHours(0, 0, 0, 0);
  return jst;
}

export function parseDateArg(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`Invalid date format: ${value}. Use YYYY-MM-DD.`);
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  date.setHours(0, 0, 0, 0);
  return date;
}
