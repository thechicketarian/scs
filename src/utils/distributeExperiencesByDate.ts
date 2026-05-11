import { ExperienceRow, SoccerCapSchedule } from "../types/types";

/**
 * Distributes experiences across the correct dates.
 * Supports:
 * - "all"
 * - blank date = all dates
 * - comma-separated dates
 * - single date
 */
export function distributeExperiencesByDate(
  experiences: (ExperienceRow & { date: string | null })[],
  schedule: SoccerCapSchedule
) {
  const allDates = Object.keys(schedule);

  // Ensure each day has an experiences array
  allDates.forEach(date => {
    if (!schedule[date].experiences) {
      schedule[date].experiences = [];
    }
  });

  experiences.forEach(exp => {
    const raw = exp.date?.trim().toLowerCase();

    let datesToApply: string[] = [];

    if (!raw || raw === "all") {
      // No date or "all" → appears on ALL festival days
      datesToApply = allDates;
    } else {
      // Split comma-separated list
      datesToApply = raw
        .split(",")
        .map(d => d.trim())
        .filter(Boolean);
    }

    datesToApply.forEach(date => {
      // ⭐ FIX: Create missing date buckets
      if (!schedule[date]) {
        schedule[date] = {
          meta: null,
          matches: [],
          music: [],
          experiences: []
        };
      }

      schedule[date].experiences.push(exp);
    });
  });
}
