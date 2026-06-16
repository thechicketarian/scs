export function sortExperiences(experiences: any[]) {
  const SPECIAL = "Celebrate Argentina";

  return [...experiences].sort((a, b) => {
    // 1. SPECIAL priority
    const aIsSpecial = a.experience === SPECIAL;
    const bIsSpecial = b.experience === SPECIAL;

    if (aIsSpecial && !bIsSpecial) return -1;
    if (!aIsSpecial && bIsSpecial) return 1;

    // 2. ALL‑day logic
    const aIsAll = a.date === "all" || a.dates?.includes("all");
    const bIsAll = b.date === "all" || b.dates?.includes("all");

    if (aIsAll && !bIsAll) return -1;
    if (!aIsAll && bIsAll) return 1;

    // 3. Alphabetical fallback
    return a.experience.localeCompare(b.experience);
  });
}
