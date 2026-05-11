import { DateTime } from "luxon";

export function formatExperienceDates(
  value: string | string[] | null | undefined
): string {
  if (!value) return "";

  // Handle "all"
  if (typeof value === "string" && value.trim().toLowerCase() === "all") {
    return "All Festival";
  }

  // --- CASE 1: Single ISO string ---
  if (typeof value === "string") {
    return DateTime.fromISO(value).toLocaleString({
      month: "long",
      day: "numeric"
    });
  }

  // --- CASE 2: Array of ISO strings ---
  if (Array.isArray(value)) {
    const dates = value
      .map(iso => DateTime.fromISO(iso))
      .filter(dt => dt.isValid)
      .sort((a, b) => a.toMillis() - b.toMillis());

    if (dates.length === 0) return "";
    if (dates.length === 1) {
      return dates[0].toLocaleString({ month: "long", day: "numeric" });
    }

    // ---- GROUP CONSECUTIVE DATES ----
    const groups: { start: DateTime; end: DateTime }[] = [];
    let rangeStart = dates[0];
    let prev = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const curr = dates[i];

      if (curr.diff(prev, "days").days === 1) {
        prev = curr;
      } else {
        groups.push({ start: rangeStart, end: prev });
        rangeStart = curr;
        prev = curr;
      }
    }

    groups.push({ start: rangeStart, end: prev });

    // ---- FORMAT GROUPS ----
    const formatted = groups.map(g => {
      // FIX: collapse single-day ranges
      if (g.start.hasSame(g.end, "day")) {
        return g.start.toFormat("LLLL d");
      }

      const sameMonth = g.start.month === g.end.month;

      if (sameMonth) {
        return `${g.start.toFormat("LLLL d")}–${g.end.day}`;
      }

      return `${g.start.toFormat("LLLL d")} – ${g.end.toFormat("LLLL d")}`;
    });

    return formatted.join(" • ");
  }

  return "";
}
