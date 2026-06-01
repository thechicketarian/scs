export interface UseSheetDataResult {
  data: SheetRow[];
  loading: boolean;
}

// BASE ROW TYPE (dynamic Google Sheet row)
export type SheetRow = {
  date?: string;   // <-- ADD THIS (the only change)
} & Record<string, any>;

export interface UseFestivalScheduleResult {
  schedule: SoccerCapSchedule;
  loading: boolean;
}

// META SHEET
export interface MetaRow extends SheetRow {
  description: string;
  doorsOpen: string;
  doorsClose: string;
  matchCategory: string;
  session1End: string;
  session2Start: string;
  theme: string;
}

// MATCHES SHEET
export interface MatchRow extends SheetRow {
  session: string;
  teamA: string;
  teamAFlag: string;
  teamB: string;
  teamBFlag: string;
  matchTime: string;
}

// MUSIC SHEET
export interface MusicRow extends SheetRow {
  order: string
  artist: string;
  time: string;
  image: string;
  bio: string;
  website: string
  ig: string;
    tiktok: string;
  facebook: string;
  x: string;
  youtube: string;
  twitch: string;
  soundcloud: string;
  spotify: string;
  appleMusic: string
}

export interface ArtistEntry extends MusicRow {
  dates: string[];
  firstDate: string;
  dateRange: string;
}

// EXPERIENCES SHEET
export interface ExperienceRow extends SheetRow {
  
  category: string
    image:string
  experience: string
  description: string;
  offer: string;
  partner: string;
  time: string;
  vendor: string;
vendorWeb: string;
vendorIg: string

}

// UNIFIED DAY
export interface FestivalDay {
  meta: MetaRow | null;
  matches: MatchRow[];
  music: MusicRow[];
  experiences: ExperienceRow[];
}

// FULL SCHEDULE
export type SoccerCapSchedule = Record<string, FestivalDay>;

export interface TicketCardsProps {
  category?: string;
}


export interface ScheduleProps {
  targetDate?: string | null;
  filterMonth?: string | null;
  layout?: string;
}
