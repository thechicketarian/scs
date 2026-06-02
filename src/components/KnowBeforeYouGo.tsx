import React, { useState, useEffect } from "react";
import { useSheetData } from "../hooks/useSheetData";
import { createPortal } from "react-dom";
import "./KnowBeforeYouGo.css";

export default function KnowBeforeYouGo() {
    const { data, loading } = useSheetData("1658720290");
    const [activeItem, setActiveItem] = useState<KBItem | null>(null);

    if (loading) return <div>Loading info…</div>;

    console.log(data)
    // Normalize rows
    const items: KBItem[] = data.map((row) => ({
        label: row.label?.trim() || "",
        link: row.externalLink?.trim() || "",
        drawerTitle: row.drawerTitle?.trim() || "",
        drawerDescription: row.drawerDescription?.trim() || "",
        drawerImage: row.drawerImage?.trim() || "",
        drawerLink: row.drawerLink?.trim() || "",
        drawerPin: row.drawerPin?.trim() || "",
        category: normalizeCategory(row.category)
    }));


    console.log(items)
    // Group by category
    const grouped: Record<KBYGCategory, KBItem[]> = {
        publicTransportation: [],
        parkingRideshare: [],
        sportingPark: []
    };

    items.forEach((item) => {
        if (item.category) {
            grouped[item.category].push(item);
        }
    });


    const renderItem = (item: KBItem, i: number) => {
        const isExternal = item.link && item.link.startsWith("http");
        const hasDrawer =
            item.drawerTitle || item.drawerDescription || item.drawerImage;

        if (isExternal) {
            return (
                <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kbyg-link"
                >
                    {item.label} <span className="material-symbols-outlined">
                        link
                    </span>
                </a>
            );
        }

        if (hasDrawer) {
            return (
                <button
                    key={i}
                    className="kbyg-item-button"
                    onClick={() => setActiveItem(item)}
                >
                    {item.label}
                    <span className="material-symbols-outlined">
                        expand_content
                    </span>
                </button>
            );
        }

        return (
            null
            // <div key={i} className="kbyg-item">
            //     <span> {item.label}</span>
            // </div>
        );
    };

    return (
        <div className="kbyg-wrapper">
            <h3 className="scs-music-vendor">Know before you go</h3>
            <div className="kbyg-list">
                <div className="kbyg-col">
                    <div className="kbyg-title">Sporting Park</div>
                    <div>cashless • clear bags • </div>
                    <div>{grouped.sportingPark.map(renderItem)}</div>
                </div>

                <div className="kbyg-col">
                    <div className="kbyg-title">Public Transportation</div>
                    <div>get around Kansas City </div>
                    <div>{grouped.publicTransportation.map(renderItem)}</div>
                </div>

                <div className="kbyg-col">
                    <div className="kbyg-title">Parking & Rideshare</div>
                    <div>get to sporting park</div>
                    <div>{grouped.parkingRideshare.map(renderItem)}</div>
                </div>
                {activeItem &&
                    createPortal(
                        <KBYGDrawer item={activeItem} onClose={() => setActiveItem(null)} />,
                        document.body
                    )}
            </div>
        </div>
    );
}

/* -----------------------------------------
   TYPES
------------------------------------------ */
interface KBItem {
    label: string;
    link: string;
    drawerTitle: string;
    drawerDescription: string;
    drawerImage: string;
    drawerLink: string;
    drawerPin: string;
    category: KBYGCategory | null;
}

type KBYGCategory =
    | "publicTransportation"
    | "parkingRideshare"
    | "sportingPark";

function normalizeCategory(raw: string = ""): KBYGCategory | null {
    const cleaned = raw.toLowerCase().trim().replace(/\s+/g, " ");

    switch (cleaned) {
        case "public transportation":
            return "publicTransportation";
        case "parking rideshare":
            return "parkingRideshare";
        case "sporting park":
            return "sportingPark";
        default:
            return null; // optional: catch unexpected categories
    }
}

/* -----------------------------------------
   DRAWER COMPONENT (matches ExperiencesWidget)
------------------------------------------ */
function KBYGDrawer({ item, onClose }: { item: KBItem; onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="scs-drawer-overlay" onClick={onClose}>
            <div className="scs-content-wrapper">
                {item.drawerImage && (
                    <div className="scs-drawer-img-kbyg">
                        <img src={item.drawerImage} alt={item.drawerTitle} />
                    </div>
                )}
                <div className="scs-drawer" onClick={(e) => e.stopPropagation()}>
                    <button className="scs-drawer-close" onClick={onClose}>×</button>
                    <div className="scs-drawer-title">{item.drawerTitle}</div>

                    {item.drawerDescription && (
                        <p className="scs-drawer-bio">{item.drawerDescription}</p>
                    )}

                    <div className="scs-drawer-links">
                        {item.drawerLink && (
                            <a href={item.drawerLink} target="_blank">
                                <span className="material-symbols-outlined">confirmation_number</span>
                            </a>
                        )}
                        {item.drawerPin && (
                            <a href={item.drawerPin} target="_blank">
                                <span className="material-symbols-outlined">pin_drop</span>
                            </a>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
