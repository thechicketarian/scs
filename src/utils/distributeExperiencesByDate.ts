import { ExperienceRow, SoccerCapSchedule } from "../types/types";

/**
 * Distributes experiences across the correct dates.
 * Supports:
 * - "all"
 * - ISO date string
 * - ISO date array
 * - blank/null/undefined = no dates
 */
export function distributeExperiencesByDate<
  T extends ExperienceRow & { date?: string | string[] | null }
>(
  experiences: T[],
  schedule: SoccerCapSchedule
) {
  const allDates = Object.keys(schedule);

  experiences.forEach(exp => {
    const raw = exp.date;

    // No date → skip
    if (!raw) return;

    // Handle "all"
    if (raw === "all") {
      allDates.forEach(dateKey => {
        schedule[dateKey].experiences.push(exp);
      });
      return;
    }

    // Normalize to array
    let dates: string[] = [];

    if (Array.isArray(raw)) {
      dates = raw;
    } else {
      // raw is a string — could be "2026-06-17" or "2026-06-17,2026-06-18"
      dates = raw
        .split(",")
        .map(d => d.trim())
        .filter(Boolean); // remove blanks
    }

    // Push into schedule
    dates.forEach(dateKey => {
      if (!schedule[dateKey]) {
        console.warn("Unexpected date in experiences:", dateKey);
        return;
      }
      schedule[dateKey].experiences.push(exp);
    });
  });
}
