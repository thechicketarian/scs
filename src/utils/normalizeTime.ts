import { DateTime } from "luxon";

export function normalizeTime(str: string | null | undefined): DateTime | null {
  if (!str || typeof str !== "string") return null;

  const cleaned = str.trim();

  const dt = DateTime.fromFormat(cleaned, "h:mm a");

  return dt.isValid ? dt : null;
}
