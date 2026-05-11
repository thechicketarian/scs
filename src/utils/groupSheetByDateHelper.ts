// import { SoccerCapSchedule } from "../types/types";

import { SoccerCapSchedule } from "../types/types";

// export function groupSheetByDate<T extends { date: string | string[] | null }>(
//   rows: T[],
//   key: keyof SoccerCapSchedule[string],
//   schedule: SoccerCapSchedule
// ) {
//   rows.forEach(row => {
//     if (!row.date) return;

//     const dates = Array.isArray(row.date) ? row.date : [row.date];

//     dates.forEach(dateKey => {
//       if (!schedule[dateKey]) {
//         schedule[dateKey] = {
//           meta: null,
//           matches: [],
//           music: [],
//           experiences: []
//         };
//       }

//       if (key === "meta") {
//         schedule[dateKey].meta = row as any;
//       } else {
//         (schedule[dateKey][key] as any[]).push(row);
//       }
//     });
//   });
// }

export function groupSheetByDate<
  T extends { date?: string | string[] | null }
>(
  rows: T[],
  key: keyof SoccerCapSchedule[string],
  schedule: SoccerCapSchedule
) {
  rows.forEach(row => {
    if (!row.date) return;

    const dates = Array.isArray(row.date) ? row.date : [row.date];

    dates.forEach(dateKey => {
      if (!schedule[dateKey]) {
        schedule[dateKey] = {
          meta: null,
          matches: [],
          music: [],
          experiences: []
        };
      }

      if (key === "meta") {
        schedule[dateKey].meta = row as any;
      } else {
        (schedule[dateKey][key] as any[]).push(row);
      }
    });
  });
}
