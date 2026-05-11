import {
  MetaRow,
  MatchRow,
  MusicRow,
  ExperienceRow,
  SoccerCapSchedule
} from "../types/types";

import { sortByTime } from "./sortByTime";
import { groupSheetByDate } from "./groupSheetByDateHelper";
import { distributeExperiencesByDate } from "./distributeExperiencesByDate";

export function buildSchedule(input: {
  meta: (MetaRow & { date: string | null })[];
  matches: (MatchRow & { date: string | null })[];
  music: (MusicRow & { date: string | null })[];
  experiences: (ExperienceRow & { date: string | null })[];
}): SoccerCapSchedule {
  const schedule: SoccerCapSchedule = {};

  // Group meta, matches, music normally
  groupSheetByDate(input.meta, "meta", schedule);
  groupSheetByDate(input.matches, "matches", schedule);
  groupSheetByDate(input.music, "music", schedule);

  // Custom logic for experiences
  distributeExperiencesByDate(input.experiences, schedule);

  // Sort matches + experiences
  Object.keys(schedule).forEach(dateKey => {
    const day = schedule[dateKey];

    day.matches = sortByTime(day.matches, "matchTime");
    day.experiences = sortByTime(day.experiences, "startTime");
  });

  return schedule;
}
