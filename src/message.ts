import {
  findNextCollection,
  formatDateJa,
  getCollectionForDate,
  getGomiType,
  getScheduleConfig,
} from "./schedule.js";
import type { CollectionDay } from "./types.js";

export function buildLineMessage(collection: CollectionDay): string {
  const config = getScheduleConfig();
  const lines: string[] = [
    `【今日のゴミ収集】${config.districtLabel}`,
    formatDateJa(collection.date),
    "",
  ];

  for (const typeId of collection.types) {
    const type = getGomiType(typeId);
    lines.push(`■ ${type.name}`);
    for (const tip of type.tips) {
      lines.push(`  ・${tip}`);
    }
    lines.push("");
  }

  lines.push(`午前${config.deadlineTime}までに集積所へ`);
  lines.push(`（${config.city} 公式カレンダーに基づく通知）`);

  return lines.join("\n").trimEnd();
}

export function buildDryRunSummary(date: Date): string {
  const collection = getCollectionForDate(date);

  if (collection) {
    return [
      `Collection day: ${formatDateJa(date)}`,
      `Types: ${collection.types.map((id) => getGomiType(id).name).join("、")}`,
      "",
      "--- LINE message ---",
      buildLineMessage(collection),
    ].join("\n");
  }

  const next = findNextCollection(date);
  const nextLine = next
    ? `Next: ${formatDateJa(next.date)} ${next.types.map((id) => getGomiType(id).name).join("、")}`
    : "Next: not found within 14 days";

  return [
    `No collection: ${formatDateJa(date)}`,
    nextLine,
    "",
    "LINE notification will be skipped.",
  ].join("\n");
}
