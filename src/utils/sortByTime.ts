import { normalizeTime } from "./normalizeTime";

export function sortByTime<T extends Record<string, any>>(
  items: T[],
  field: string
): T[] {
  return [...items].sort((a, b) => {
    const t1 = normalizeTime(a[field]);
    const t2 = normalizeTime(b[field]);

    if (!t1 || !t2) return 0;

    return t1.toMillis() - t2.toMillis();
  });
}
