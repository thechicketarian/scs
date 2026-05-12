import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { MusicRow, ArtistEntry } from "../types/types";
import { DateTime } from "luxon";
import "./HomeLiveMusicWidget.css";

export default function HomeLiveMusicWidget() {
    const { schedule, loading } = useFestivalSchedule();
    if (loading) return null;

    // Build artist map
    const artistMap = new Map<string, ArtistEntry>();
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
                artistMap.get(m.artist)!.dates.push(dateKey);
            }
        });
    });

    // Compute date ranges
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

    // ⭐ Correct 4‑headliner sorting
    const sorted = artists.sort((a, b) => {
        const aOrder = a.order ? Number(a.order) : Infinity;
        const bOrder = b.order ? Number(b.order) : Infinity;

        const aIsHeadliner = aOrder >= 1 && aOrder <= 4;
        const bIsHeadliner = bOrder >= 1 && bOrder <= 4;

        if (aIsHeadliner && !bIsHeadliner) return -1;
        if (!aIsHeadliner && bIsHeadliner) return 1;
        if (aIsHeadliner && bIsHeadliner) return aOrder - bOrder;

        return a.firstDate.localeCompare(b.firstDate);
    });

    const headliners = sorted.filter(a => Number(a.order) >= 1 && Number(a.order) <= 4);
    const rest = sorted.filter(a => Number(a.order) > 4 || !a.order);

    return (
        <div className="scs-home-lineup-wrapper">
            <h2 className="scs-music-page-title">Sounds of the summer</h2>
            {/* ⭐ Headliners */}
            <div className="scs-home-headliners">
                {headliners.map((m, i) => (
                    <div key={i} className={`scs-home-headliner scs-home-artist-global scs-home-headliner-${m.order}`}>
                        {/* <div className="scs-home-headliner-date">{m.dateRange}</div> */}
                        <div className="scs-home-headliner-name">{m.artist}</div>
                        <div className={`scs-home-divider scs-home-divider-${m.order}`}></div>
                    </div>
                ))}
            </div>

            {/* ⭐ Rest of lineup */}
            <div className="scs-home-rest">
                {rest.map((m, i) => (
                    <div key={i} className="scs-home-artist scs-home-artist-global">
                        <span className="material-symbols-outlined">
                            star_half
                        </span>
                        <div>
                            {/* <div className="scs-home-artist-date">{m.dateRange}</div> */}
                            <div className="scs-home-artist-name">{m.artist}</div>
                        </div>
                        <span className="material-symbols-outlined">
                            star_half
                        </span>
                    </div>

                ))}
            </div>
        </div>
    );
}
