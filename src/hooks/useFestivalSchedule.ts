import { buildSchedule } from "../utils/buildSchedule";
import { useSheetData } from "./useSheetData";

import {
  MetaRow,
  MatchRow,
  MusicRow,
  ExperienceRow,
  FestivalDay,
  SoccerCapSchedule,
  UseFestivalScheduleResult
} from "../types/types";

export function useFestivalSchedule(): UseFestivalScheduleResult {
  const meta = useSheetData("843872450");
  const matches = useSheetData("179580476");
  const music = useSheetData("2047900320");
  const experiences = useSheetData("366396295");

  const loading =
    meta.loading ||
    matches.loading ||
    music.loading ||
    experiences.loading;

  const schedule = buildSchedule({
    meta: meta.data as (MetaRow & { date: string | null })[],
    matches: matches.data as (MatchRow & { date: string | null })[],
    music: music.data as (MusicRow & { date: string | null })[],
    experiences: experiences.data as (ExperienceRow & { date: string | null })[],
  });
  return { schedule, loading };
}
