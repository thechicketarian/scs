import { DateTime } from "luxon";

export function normalizeDateKey(str: string | null | undefined): string {
  if (!str || typeof str !== "string") return "";

  const cleaned = str
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const dt = DateTime.fromFormat(cleaned + " 2026", "LLLL d yyyy");

  if (!dt.isValid) {
    console.warn("Invalid date:", str);
    return "";
  }

  return dt.toISODate()!;
}
