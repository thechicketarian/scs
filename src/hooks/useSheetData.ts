import { useState, useEffect, useMemo } from "react";
import { SheetRow, UseSheetDataResult } from "../types/types";

// ---- Hook ----
export function useSheetData(gid: string): UseSheetDataResult {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtz8JZVCwco09BSCArY_VZhCDJ8V3jzGEvzzvhpbfkQ0C-L-XGw2BZ7aFcCqELD29IzVjHPVKVYnL8/pub?output=csv";

  const sheetUrl = useMemo(
    () => `${BASE_URL}&gid=${gid}&cb=${Date.now()}`,
    [gid]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const res = await fetch(sheetUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        const text = await res.text();
        const rows = parseCSV(text);

        if (!rows.length) {
          setData([]);
          setLoading(false);
          return;
        }

        const headers = normalizeHeaders(rows[0]);

        const parsed: SheetRow[] = rows.slice(1).map((row) =>
          headers.reduce((acc: SheetRow, key, i) => {
            acc[key] = row[i]?.trim() ?? "";
            return acc;
          }, {})
        );

        setData(parsed);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Sheet Fetch Error:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [sheetUrl]);

  return { data, loading };
}

// ---- CSV Parser ----
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cur);
      cur = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (cur || row.length) {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      }
    } else {
      cur += char;
    }
  }

  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

// ---- Header Normalizer ----
function normalizeHeaders(headers: string[]): string[] {
  return headers.map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
  );
}
