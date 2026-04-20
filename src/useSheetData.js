// import { useState, useEffect } from 'react';

// export function useSheetData(category) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtz8JZVCwco09BSCArY_VZhCDJ8V3jzGEvzzvhpbfkQ0C-L-XGw2BZ7aFcCqELD29IzVjHPVKVYnL8/pub?output=csv';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`${SHEET_URL}&cb=${Date.now()}`, { cache: "no-store" });
//         const txt = await res.text();
        
//         // YOUR ORIGINAL PARSING LOGIC
//         const parseCSVLine = (line) => {
//           const result = [];
//           let cur = '', inQuotes = false;
//           for (let char of line) {
//             if (char === '"' && !inQuotes) inQuotes = true;
//             else if (char === '"' && inQuotes) inQuotes = false;
//             else if (char === ',' && !inQuotes) { result.push(cur); cur = ''; }
//             else cur += char;
//           }
//           result.push(cur);
//           return result;
//         };

//         const lines = txt.split(/\r?\n/).filter(r => r.trim() !== "");
//         const rows = lines.map(parseCSVLine);
//         const head = rows[0].map(h => h.trim().toLowerCase().replace(/[\s_]+/g, ''));
        
//         const freshData = rows.slice(1).map(r => 
//           head.reduce((acc, h, i) => ({ ...acc, [h]: r[i]?.trim() || "" }), {})
//         );

//         // YOUR ORIGINAL FILTERING LOGIC
//         const filtered = freshData.filter(d => 
//           (d.category || "").trim().toLowerCase() === category.trim().toLowerCase()
//         );

//         setData(filtered);
//         setLoading(false);
//       } catch (err) {
//         console.error("SCS Error", err);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [category]);

//   return { data, loading };
// }

import { useState, useEffect } from 'react';

export function useSheetData(gid) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtz8JZVCwco09BSCArY_VZhCDJ8V3jzGEvzzvhpbfkQ0C-L-XGw2BZ7aFcCqELD29IzVjHPVKVYnL8/pub?output=csv';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We append the GID and a Cache-Buster timestamp
        const res = await fetch(`${SHEET_URL}&gid=${gid}&cb=${Date.now()}`, { cache: "no-store" });
        const txt = await res.text();
        
        const parseCSVLine = (line) => {
          const result = [];
          let cur = '', inQuotes = false;
          for (let char of line) {
            if (char === '"' && !inQuotes) inQuotes = true;
            else if (char === '"' && inQuotes) inQuotes = false;
            else if (char === ',' && !inQuotes) { result.push(cur); cur = ''; }
            else cur += char;
          }
          result.push(cur);
          return result;
        };

        const lines = txt.split(/\r?\n/).filter(r => r.trim() !== "");
        const rows = lines.map(parseCSVLine);

        /**
         * CAMELCASE NORMALIZATION
         * Converts "Doors Open" -> "doorsOpen"
         * Converts "Team A Flag" -> "teamAFlag"
         */
        const head = rows[0].map(h => {
          return h.trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        });
        
        const freshData = rows.slice(1).map(r => 
          head.reduce((acc, h, i) => {
            const val = r[i]?.trim() || "";
            return { ...acc, [h]: val };
          }, {})
        );

        setData(freshData);
        setLoading(false);
      } catch (err) {
        console.error("Soccer Capital Suite: Fetch Error", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [gid]);

  return { data, loading };
}