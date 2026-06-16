// import React, { useEffect, useState } from "react";
// import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
// import "./ExperiencesWidget.css";
// import { ExperienceRow } from "../types/types";
// import { formatExperienceDates } from "../utils/datesParser";
// import { createPortal } from "react-dom";

// export default function ExperiencesWidget() {
//   const { schedule, loading } = useFestivalSchedule();
//   const [activeActivation, setActiveActivation] = useState<ActivationEntry | null>(null);

//   // ⭐ Memoized activation pipeline (dedupe + collect dates)
//   // const activations = React.useMemo(() => {
//   //   if (loading) return [];

//   //   const map = new Map<string, ActivationEntry>();

//   //   Object.entries(schedule).forEach(([dateKey, day]) => {
//   //     (day.experiences || []).forEach((exp: ExperienceRow) => {
//   //       const key = `${exp.experience}|${exp.description}|${exp.time}|${exp.partner}|${exp.vendor}`;

//   //       if (!map.has(key)) {
//   //         map.set(key, {
//   //           ...exp,
//   //           dates: [dateKey]
//   //         });
//   //       } else {
//   //         map.get(key)!.dates.push(dateKey);
//   //       }
//   //     });
//   //   });

//   //   return Array.from(map.values()).sort((a, b) =>
//   //     a.experience.localeCompare(b.experience)
//   //   );
//   // }, [loading, schedule]);

//   const activations = React.useMemo(() => {
//     if (loading) return [];

//     const map = new Map<string, ActivationEntry>();

//     Object.entries(schedule).forEach(([dateKey, day]) => {
//       (day.experiences || []).forEach((exp: ExperienceRow) => {
//         const key = `${exp.experience}|${exp.description}|${exp.time}|${exp.partner}|${exp.vendor}`;

//         if (!map.has(key)) {
//           map.set(key, {
//             ...exp,
//             dates: [dateKey]
//           });
//         } else {
//           map.get(key)!.dates.push(dateKey);
//         }
//       });
//     });

//     // return Array.from(map.values()).sort((a, b) => {
//     //   const aIsAll = a.date === "all" || a.dates?.includes("all");
//     //   const bIsAll = b.date === "all" || b.dates?.includes("all");

//     //   if (aIsAll && !bIsAll) return -1;
//     //   if (!aIsAll && bIsAll) return 1;

//     //   return a.experience.localeCompare(b.experience);
//     // });

//     return Array.from(map.values()).sort((a, b) => {
//       // ⭐ 1. Priority override
//       const SPECIAL = "Celebrate Argentina"; // <-- change to your activation name

//       const aIsSpecial = a.experience === SPECIAL;
//       const bIsSpecial = b.experience === SPECIAL;

//       if (aIsSpecial && !bIsSpecial) return -1;
//       if (!aIsSpecial && bIsSpecial) return 1;

//       // ⭐ 2. Existing ALL-date logic
//       const aIsAll = a.date === "all" || a.dates?.includes("all");
//       const bIsAll = b.date === "all" || b.dates?.includes("all");

//       if (aIsAll && !bIsAll) return -1;
//       if (!aIsAll && bIsAll) return 1;

//       // ⭐ 3. Alphabetical fallback
//       return a.experience.localeCompare(b.experience);
//     });

//   }, [loading, schedule]);


//   const openDrawer = (activation: ActivationEntry) => {
//     setActiveActivation(activation);
//     document.body.style.overflow = "hidden";
//   };

//   const closeDrawer = () => {
//     setActiveActivation(null);
//     document.body.style.overflow = "";
//   };

//   // ⭐ ESC closes drawer
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") closeDrawer();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, []);

//   // ⭐ ADD THIS
//   useEffect(() => {
//     if (activeActivation) {
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//     };
//   }, [activeActivation]);
//   // ⭐ SAFE conditional render (after hooks + memo)
//   if (loading) {
//     return <div>Loading…</div>;
//   }

//   return (
//     <div className="scs-experiences-widget">
//       <h1 className="scs-music-page-title">Experiences</h1>
//       <div className="scs-music-nav scs-music-nav-exp">
//         <div className="scs-music-nav-date">Summer Fun</div>
//         <button className="scs-music-cta scs-card-button"
//           onClick={() => (window as any).GMWidget?.open("SoccerCapitalSummer")}
//         >find tickets <span className="material-symbols-outlined">
//             confirmation_number
//           </span></button>
//         <div className="scs-music-nav-date">2026</div>
//       </div>
//       <div className="scs-experiences-list">
//         {activations.map((exp, i) => (
//           <button
//             key={i}
//             className="scs-experience-card scs-card-button"
//             onClick={() => openDrawer(exp)}
//           >
//             <div className="scs-headliner-info">
//               <div className="scs-music-date">{formatExperienceDates(exp.date)} </div>
//               <div className="scs-vendor-name">{exp.experience}</div>
//               {/* <div> {exp.category}</div> */}
//               {/* { exp.partner && <div className="scs-partner-title">Presented By: {exp.partner}</div>} */}
//               <div
//                 className="scs-artist-modal"
//               >
//                 <span>learn more</span>
//                 <span className="material-symbols-outlined">
//                   arrow_outward
//                 </span>
//               </div>
//             </div>

//             {exp.image && (
//               <div className="scs-vendor-image artist-img-vendor">
//                 <img src={exp.image} alt={exp.vendor} />
//                 {exp.offer && (
//                   <div className="scs-vendor-offer-icon"><span className="material-symbols-outlined">
//                     featured_seasonal_and_gifts
//                   </span>
//                     <span>free offer</span>
//                   </div>
//                 )}
//                 {exp.guest && (
//                   <div className="scs-vendor-offer-icon scs-vendor-meet-icon"><span className="material-symbols-outlined">
//                     award_star
//                   </span>
//                     <span>meet & greet</span>
//                   </div>
//                 )}
//               </div>
//             )}

//           </button>
//         ))}
//       </div>

//       {activeActivation &&
//         createPortal(
//           <ActivationDrawer activation={activeActivation} onClose={closeDrawer} />,
//           document.body
//         )
//       }

//     </div>
//   );
// }

// // ⭐ Activation entry with date range
// interface ActivationEntry extends ExperienceRow {
//   dates: string[];
// }

// interface DrawerProps {
//   activation: ActivationEntry;
//   onClose: () => void;
// }

// function ActivationDrawer({ activation, onClose }: DrawerProps) {

//   const dateRange = formatExperienceDates(activation.date);

//   return (
//     <div className="scs-drawer-overlay" onClick={onClose}>
//       <div className="scs-content-wrapper">

//         {/* ⭐ Optional image */}
//         <div className="scs-drawer-img">
//           {activation.image && (
//             <img src={activation.image} alt={activation.experience} />
//           )}
//         </div>

//         <div className="scs-drawer" onClick={(e) => e.stopPropagation()}>
//           <button className="scs-drawer-close" onClick={onClose}>×</button>

//           {/* ⭐ Date range */}
//           <div className="scs-drawer-date">{dateRange}</div>

//           {/* ⭐ Vendor */}
//           <div className="scs-drawer-title">{activation.experience}</div>

//           {/* ⭐ Activation name */}
//           <div className="scs-drawer-activation-title"> {activation.vendor}</div>
//           <hr />
//           {activation.partner && (
//             <p className="scs-partner-title">Presented By: {activation.partner}</p>
//           )}
//           {activation.guest && (
//             <div className="scs-drawer-guest">
//               <span className="material-symbols-outlined">
//                 award_star
//               </span>
//               <div
//                 dangerouslySetInnerHTML={{ __html: activation.guest }}
//               />
//             </div>
//           )}
//           {/* ⭐ Description */}
//           {/* {activation.description && (
//             <p className="scs-drawer-bio">{activation.description}</p>
//           )} */}

//           {activation.description && (
//             <div
//               className="scs-drawer-bio"
//               dangerouslySetInnerHTML={{ __html: activation.description }}
//             />
//           )}
//           {activation.offer && (
//             <p className="scs-drawer-offer">
//               <span className="material-symbols-outlined">
//                 featured_seasonal_and_gifts
//               </span>
//               <span>{activation.offer}</span>
//             </p>
//           )}


//           {/* ⭐ Partner */}


//           {/* ⭐ Links */}
//           <div className="scs-drawer-links">
//             {activation.vendorWeb && (
//               <a href={activation.vendorWeb} target="_blank">
//                 <span className="material-symbols-outlined">computer</span>
//               </a>
//             )}

//             {activation.vendorIg && (
//               <a href={activation.vendorIg} target="_blank">
//                 <img
//                   className="scs-drawer-social-icon"
//                   src="https://scs-ochre.vercel.app/icons/Instagram_Glyph_Gradient.jpg"
//                 />
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import "./ExperiencesWidget.css";
import { ExperienceRow } from "../types/types";
import { formatExperienceDates } from "../utils/datesParser";
import { createPortal } from "react-dom";
import Loading from "./Loading";

export default function ExperiencesWidget() {
  const { schedule, loading } = useFestivalSchedule();
  const [activeActivation, setActiveActivation] = useState<ActivationEntry | null>(null);

  // ⭐ Native URL parsing (no React Router)
  const activationSlug = new URLSearchParams(window.location.search).get("activation");

  // ⭐ Prevent infinite loops when auto-opening from slug
  const hasOpenedFromSlug = React.useRef(false);

  // ⭐ Memoized activation pipeline (dedupe + collect dates + slug)
  const activations = React.useMemo(() => {
    if (loading) return [];

    const map = new Map<string, ActivationEntry>();

    Object.entries(schedule).forEach(([dateKey, day]) => {
      (day.experiences || []).forEach((exp: ExperienceRow) => {
        const key = `${exp.experience}|${exp.description}|${exp.time}|${exp.partner}|${exp.vendor}`;

        const slug = exp.experience
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");

        if (!map.has(key)) {
          map.set(key, {
            ...exp,
            dates: [dateKey],
            slug
          });
        } else {
          map.get(key)!.dates.push(dateKey);
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => {
      // ⭐ 1. Priority override
      const SPECIAL = "Celebrate Argentina";

      const aIsSpecial = a.experience === SPECIAL;
      const bIsSpecial = b.experience === SPECIAL;

      if (aIsSpecial && !bIsSpecial) return -1;
      if (!aIsSpecial && bIsSpecial) return 1;

      // ⭐ 2. ALL-date logic
      const aIsAll = a.date === "all" || a.dates?.includes("all");
      const bIsAll = b.date === "all" || b.dates?.includes("all");

      if (aIsAll && !bIsAll) return -1;
      if (!aIsAll && bIsAll) return 1;

      // ⭐ 3. Alphabetical fallback
      return a.experience.localeCompare(b.experience);
    });
  }, [loading, schedule]);

  // ⭐ Auto-open drawer if slug matches (runs once)
  useEffect(() => {
    if (!activationSlug || activations.length === 0) return;
    if (hasOpenedFromSlug.current) return;

    const match = activations.find((a) => a.slug === activationSlug);

    if (match) {
      hasOpenedFromSlug.current = true;
      setActiveActivation(match);
      document.body.style.overflow = "hidden";
    }
  }, [activationSlug, activations]);

  const openDrawer = (activation: ActivationEntry) => {
    setActiveActivation(activation);
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setActiveActivation(null);
    document.body.style.overflow = "";

    // ⭐ Clean up ?activation=... from the URL (works on localhost + prod)
    const url = new URL(window.location.href);
    url.searchParams.delete("activation");
    window.history.replaceState({}, "", url.toString());
  };

  // ⭐ ESC closes drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ⭐ Lock scroll when drawer is open
  useEffect(() => {
    if (activeActivation) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeActivation]);

  if (loading) {
    return <Loading label="Syncing Experiences…" />;
  }

  return (
    <div className="scs-experiences-widget">
      <h1 className="scs-music-page-title">Experiences</h1>

      <div className="scs-music-nav scs-music-nav-exp">
        <div className="scs-music-nav-date">Summer Fun</div>
        <button
          className="scs-music-cta scs-card-button"
          onClick={() => (window as any).GMWidget?.open("SoccerCapitalSummer")}
        >
          find tickets{" "}
          <span className="material-symbols-outlined">confirmation_number</span>
        </button>
        <div className="scs-music-nav-date">2026</div>
      </div>

      <div className="scs-experiences-list">
        {activations.map((exp, i) => (
          <button
            key={i}
            className="scs-experience-card scs-card-button"
            onClick={() => openDrawer(exp)}
          >
            <div className="scs-headliner-info">
              <div className="scs-music-date">
                {formatExperienceDates(exp.date)}
              </div>
              <div className="scs-vendor-name">{exp.experience}</div>

              <div className="scs-artist-modal">
                <span>learn more</span>
                <span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </div>

            {exp.image && (
              <div className="scs-vendor-image artist-img-vendor">
                <img src={exp.image} alt={exp.vendor} />

                {exp.offer && (
                  <div className="scs-vendor-offer-icon">
                    <span className="material-symbols-outlined">
                      featured_seasonal_and_gifts
                    </span>
                    <span>free offer</span>
                  </div>
                )}

                {exp.guest && (
                  <div className="scs-vendor-offer-icon scs-vendor-meet-icon">
                    <span className="material-symbols-outlined">award_star</span>
                    <span>meet & greet</span>
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {activeActivation &&
        createPortal(
          <ActivationDrawer
            activation={activeActivation}
            onClose={closeDrawer}
          />,
          document.body
        )}
    </div>
  );
}

// ⭐ Activation entry with date range + slug
interface ActivationEntry extends ExperienceRow {
  dates: string[];
  slug: string;
}

interface DrawerProps {
  activation: ActivationEntry;
  onClose: () => void;
}

function ActivationDrawer({ activation, onClose }: DrawerProps) {
  const dateRange = formatExperienceDates(activation.date);

  return (
    <div className="scs-drawer-overlay" onClick={onClose}>
      <div className="scs-content-wrapper">
        <div className="scs-drawer-img">
          {activation.image && (
            <img src={activation.image} alt={activation.experience} />
          )}
        </div>

        <div className="scs-drawer" onClick={(e) => e.stopPropagation()}>
          <button className="scs-drawer-close" onClick={onClose}>
            ×
          </button>

          <div className="scs-drawer-date">{dateRange}</div>

          <div className="scs-drawer-title">{activation.experience}</div>

          <div className="scs-drawer-activation-title">
            {activation.vendor}
          </div>

          <hr />

          {activation.partner && (
            <p className="scs-partner-title">
              Presented By: {activation.partner}
            </p>
          )}

          {activation.guest && (
            <div className="scs-drawer-guest">
              <span className="material-symbols-outlined">award_star</span>
              <div
                dangerouslySetInnerHTML={{ __html: activation.guest }}
              />
            </div>
          )}

          {activation.description && (
            <div
              className="scs-drawer-bio"
              dangerouslySetInnerHTML={{ __html: activation.description }}
            />
          )}

          {activation.offer && (
            <p className="scs-drawer-offer">
              <span className="material-symbols-outlined">
                featured_seasonal_and_gifts
              </span>
              <span>{activation.offer}</span>
            </p>
          )}

          <div className="scs-drawer-links">
            {activation.vendorWeb && (
              <a href={activation.vendorWeb} target="_blank">
                <span className="material-symbols-outlined">computer</span>
              </a>
            )}

            {activation.vendorIg && (
              <a href={activation.vendorIg} target="_blank">
                <img
                  className="scs-drawer-social-icon"
                  src="https://scs-ochre.vercel.app/icons/Instagram_Glyph_Gradient.jpg"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
