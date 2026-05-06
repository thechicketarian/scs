import {
  MetaRow,
  MatchRow,
  MusicRow,
  ExperienceRow,
  SoccerCapSchedule
} from "../types/types";

import { sortByTime } from "./sortByTime";
import { groupSheetByDate } from "./groupSheetByDateHelper";

export function buildSchedule(input: {
  meta: (MetaRow & { date: string | null })[];
  matches: (MatchRow & { date: string | null })[];
  music: (MusicRow & { date: string | null })[];
  // experiences: (ExperienceRow & { date: string | null })[];
}): SoccerCapSchedule {
  const schedule: SoccerCapSchedule = {};

  // Group each sheet domain by date
  groupSheetByDate(input.meta, "meta", schedule);
  groupSheetByDate(input.matches, "matches", schedule);
  groupSheetByDate(input.music, "music", schedule);
  // groupSheetByDate(input.experiences, "experiences", schedule);

  // Sort each day's items
  Object.keys(schedule).forEach(dateKey => {
    const day = schedule[dateKey];

    day.matches = sortByTime(day.matches, "matchTime");
    day.experiences = sortByTime(day.experiences, "startTime");
  });

  return schedule;
}
