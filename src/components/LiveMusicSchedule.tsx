import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { MusicRow, ArtistEntry } from "../types/types";
import { DateTime } from "luxon";
import "./LiveMusicSchedule.css";
import "./ArtistDrawer.css";

export default function LiveMusicSchedule({ layout = "default" }) {
  const { schedule, loading } = useFestivalSchedule();
  const [activeArtist, setActiveArtist] = React.useState<ArtistEntry | null>
    (null);

  React.useEffect(() => {
    if (activeArtist) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeArtist]);

  if (loading) {
    return <div>Loading Live Music…</div>;
  }

  // Map of artist → enriched entry
  const artistMap = new Map<string, ArtistEntry>();

  // Collect all artists + all their dates
  Object.entries(schedule).forEach(([dateKey, day]) => {
    day.music.forEach((m: MusicRow) => {
      if (!artistMap.has(m.artist)) {
        artistMap.set(m.artist, {
          ...m,
          dates: [dateKey],
          firstDate: dateKey,
          dateRange: ""
        });
      } else {
        const entry = artistMap.get(m.artist)!;
        entry.dates.push(dateKey);
      }
    });
  });

  // Compute earliest date + date range
  artistMap.forEach((artist) => {
    artist.dates.sort();
    artist.firstDate = artist.dates[0];

    if (artist.dates.length === 1) {
      artist.dateRange = DateTime.fromISO(artist.dates[0]).toFormat("LLLL d");
    } else {
      const first = DateTime.fromISO(artist.dates[0]);
      const last = DateTime.fromISO(artist.dates[artist.dates.length - 1]);

      artist.dateRange =
        first.month === last.month
          ? `${first.toFormat("LLLL d")}–${last.toFormat("d")}`
          : `${first.toFormat("LLLL d")}–${last.toFormat("LLLL d")}`;
    }
  });

  const artists = Array.from(artistMap.values());

  // Sort:
  // 1. Headliners by order (1,2,3)
  // 2. Everyone else by earliest date
  const sorted = artists.sort((a, b) => {
    const aOrder = a.order ? Number(a.order) : Infinity;
    const bOrder = b.order ? Number(b.order) : Infinity;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.firstDate.localeCompare(b.firstDate);
  });

  // Split into two groups
  const headliners = sorted.filter(a => Number(a.order) >= 1 && Number(a.order) <= 3);
  const rest = sorted.filter(a => Number(a.order) > 3 || !a.order);

  const spacerMap: Record<number, "ticket" | "generic" | "third"> = {
    1: "generic",
    3: "ticket",
    4: "generic",
    7: "generic",
    9: "third"
  };

  return (
    <div className={`scs-music-wrapper`}>
      <div className="scs-music-page">

        <div className="scs-music-nav">
          <div className="scs-headliner-date">Lineup</div>
          <button className="scs-music-cta scs-card-button"
            onClick={() => (window as any).GMWidget?.open("SoccerCapitalSummer")}
          >find ticket <span className="material-symbols-outlined">
              confirmation_number
            </span></button>
          <div className="scs-headliner-date">2026</div>
        </div>
        <h1 className="scs-music-page-title">Sounds of the summer</h1>

        {/* HEADLINERS */}
        <div className="scs-headliners">
          {headliners.map((m, i) => (
            <button
              key={i}
              className={`scs-headliner-item scs-card-button scs-headliner-${m.order}`}
              type="button"
              onClick={() => setActiveArtist(m)}
            >
              {m.order === "1" ?
                <div className="scs-headliner-spacer"></div>
                :
                null
              }
              <div className="scs-headliner-info">
                <div className="scs-headliner-date">{m.dateRange}</div>
                <div className="scs-headliner-name">{m.artist}</div>
                <div

                  className="scs-artist-modal"

                >
                  <span>about</span>
                  <span className="material-symbols-outlined">
                    arrow_outward
                  </span>
                </div>

              </div>
              <div className="scs-headliner-image artist-img">
                <img src={m.image} alt={m.artist} />
              </div>
            </button>
          ))}
        </div>

        {/* EVERYONE ELSE */}
        <div className="scs-music-lineup">
          {rest.map((m, i) => (
            <React.Fragment key={i}>
              {spacerMap[i] === "generic" && <StarSpacer />}
              {spacerMap[i] === "third" && <ThirdSpacer />}
              <button className={`scs-music-item scs-card-button scs-music-${m.artist} ${m.image ? "has-image" : "no-image"
                }`}
                type="button"

                onClick={() => setActiveArtist(m)}
              >
                <div className="scs-music-info">
                  <div className="scs-music-date">{m.dateRange}</div>
                  <div className="scs-music-artist">{m.artist}</div>
                  <div
                    className="scs-artist-modal"
                  >
                    <span>about</span>
                    <span className="material-symbols-outlined">
                      arrow_outward
                    </span>
                  </div>
                </div>
                {m.image && (
                  <div className="scs-music-artist-image artist-img">
                    <img src={m.image} alt={m.artist} className="scs-artist-image" />
                  </div>
                )}
              </button>

              {spacerMap[i] === "ticket" && <TicketPush />}
            </React.Fragment>
          ))}

        </div>
                              <div className="scs-music-waves">
   <img src="/icons/sounds-background.png" />
</div>
      </div>

      {/* DRAWER */}
      {activeArtist && (
        <ArtistDrawer artist={activeArtist} onClose={() => setActiveArtist(null)} />
      )}
    </div>
  );
}

function TicketPush() {
  return (
    <button className="scs-spacer scs-card-button ticket-spacer"
      onClick={() => (window as any).GMWidget?.open("SoccerCapitalSummer")}
    >
      <div className="scs-music-date">find tickets</div>
      <div className="scs-music-goal-ball">
       <div className="scs-music-ball">
         <img  src="https://scs-ochre.vercel.app/icons/26-SCS-SoccerBall.svg" />
       </div>
        <div className="scs-music-goal">
          <img  src="https://scs-ochre.vercel.app/icons/net.png" alt=""/>
        </div>
      </div>
    </button>
  );
}

function FireworkSpacer() {
  return <div className="scs-spacer star-spacer">

    <div>
      <img src="https://scs-ochre.vercel.app/icons/SCS-BlueStar.svg" alt="blue-star-svg" />
    </div>
    <div>
      <img src="https://scs-ochre.vercel.app/icons/SCS-BlueStar.svg" alt="blue-star-svg" />
    </div>
    <div>
      <img src="https://scs-ochre.vercel.app/icons/SCS-BlueStar.svg" alt="blue-star-svg" />
    </div>

  </div>;
}

function StarSpacer() {
  return <div className="scs-spacer star-spacer">

    <div>
      <img src="https://scs-ochre.vercel.app/icons/26-SCS-Shuttlecock.svg" alt="blue-star-svg" />
    </div>
    <div>
      <img src="https://scs-ochre.vercel.app/icons/SCS-BlueStar.svg" alt="blue-star-svg" />
    </div>
    <div>
      <img src="https://scs-ochre.vercel.app/icons/SCS-BlueStar.svg" alt="blue-star-svg" />
    </div>

  </div>;
}

function ThirdSpacer() {
  return <div className="scs-spacer third-spacer">
  </div>;
}


/* ---------------------- DRAWER ---------------------- */

interface ArtistDrawerProps {
  artist: ArtistEntry;
  onClose: () => void;
}

function ArtistDrawer({ artist, onClose }: ArtistDrawerProps) {
  return (
    <div className="scs-drawer-overlay" onClick={onClose}>
      <div className="scs-content-wrapper">
        <div className="scs-drawer-img">
          {artist.image && (
            <img src={artist.image} alt={artist.artist} />
          )}
        </div>
        <div className="scs-drawer" onClick={(e) => e.stopPropagation()}>
          <button className="scs-drawer-close" onClick={onClose}>×</button>
          <div className="scs-drawer-date">{artist.dateRange}</div>
          <h4 className="scs-drawer-title">{artist.artist}</h4>
          <hr />
          {artist.bio && <p className="scs-drawer-bio">{artist.bio}</p>}
          {/* <h5 className="scs-drawer-links-title">Stay connected</h5> */}
          <div className="scs-drawer-links">
            {artist.website && <a className="scs-drawer-website-group" href={artist.website} target="_blank">
              <span className="material-symbols-outlined">
                computer
              </span>
              {/* <span>website</span> */}
            </a>}
            {artist.ig && <a href={artist.ig} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/Instagram_Glyph_Gradient.jpg" />
            </a>
            }
            {artist.tiktok && <a href={artist.tiktok} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/tiktok.png" />
            </a>
            }
            {artist.x && <a href={artist.x} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/x.png" />
            </a>
            }
            {artist.facebook && <a href={artist.facebook} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/Facebook_Logo_Primary.png" />
            </a>
            }

            {artist.youtube && <a href={artist.youtube} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/youtube-icon.svg" />
            </a>}
            {artist.twitch && <a href={artist.twitch} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/glitch_flat_purple.svg" />
            </a>}
            {artist.spotify && <a href={artist.soundcloud} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/soundcloud.png" />
            </a>}
            {artist.appleMusic && <a href={artist.appleMusic} target="_blank">
              <img className="scs-drawer-social-icon" src="https://scs-ochre.vercel.app/icons/apple-music.svg" />
            </a>}
          </div>
        </div>
      </div>
    </div>
  );
}