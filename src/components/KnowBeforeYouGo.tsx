import React, { useState, useEffect } from "react";
import { useSheetData } from "../hooks/useSheetData";
import { createPortal } from "react-dom";
import "./KnowBeforeYouGo.css";

/* -----------------------------------------
   CATEGORY TYPES
------------------------------------------ */
type KBYGCategory =
    | "publicTransportation"
    | "parkingRideshare"
    | "sportingPark";

/* -----------------------------------------
   CONTENT TYPES
------------------------------------------ */
type KBYGType = "info" | "drawer" | "link";

/* -----------------------------------------
   ITEM TYPE
------------------------------------------ */
interface KBItem {
    type: KBYGType;
    label: string;
    icon: string;
    link: string;
    drawerTitle: string;
    drawerDescription: string;
    drawerImage: string;
    drawerLink: string;
    drawerPin: string;
    category: KBYGCategory | null;
}

/* -----------------------------------------
   NORMALIZE CATEGORY
------------------------------------------ */
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
            return null;
    }
}

/* -----------------------------------------
   MAIN COMPONENT
------------------------------------------ */
export default function KnowBeforeYouGo() {
    const { data, loading } = useSheetData("1658720290");
    const [activeItem, setActiveItem] = useState<KBItem | null>(null);

    if (loading) return <div>Loading info…</div>;

    /* -----------------------------------------
       NORMALIZE ROWS
    ------------------------------------------ */
    const items: KBItem[] = data.map((row) => ({
        type: (row.type?.trim().toLowerCase() as KBYGType) || "info",
        label: row.label?.trim() || "",
        icon: row.infoIcon?.trim() || "",
        link: row.externalLink?.trim() || "",
        drawerTitle: row.drawerTitle?.trim() || "",
        drawerDescription: row.drawerDescription?.trim() || "",
        drawerImage: row.drawerImage?.trim() || "",
        drawerLink: row.drawerLink?.trim() || "",
        drawerPin: row.drawerPin?.trim() || "",
        category: normalizeCategory(row.category)
    }));

    /* -----------------------------------------
       GROUP BY CATEGORY
    ------------------------------------------ */
    const grouped: Record<KBYGCategory, KBItem[]> = {
        publicTransportation: [],
        parkingRideshare: [],
        sportingPark: []
    };

    items.forEach((item) => {
        if (item.category) grouped[item.category].push(item);
    });

    /* -----------------------------------------
       RENDER ITEM
    ------------------------------------------ */
    const renderItem = (item: KBItem, i: number) => {
        // External link
        if (item.type === "link" && item.link) {
            return (
                <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kbyg-link"
                >
                    {item.label}
                    <span className="material-symbols-outlined">link</span>
                </a>
            );
        }

        // INFO ITEM — icon above label (Sporting Park style)
        if (item.type === "info") {
            return (
                <div
                    key={i}
                    className="kbyg-info-block"
                    onClick={() => setActiveItem(item)}
                >
                    {item.icon && (
                        <span className="material-symbols-outlined">{item.icon}</span>
                    )}
                    <span className="kbyg-icon-label">{item.label}</span>
                </div>
            );
        }

        // DRAWER ITEM — full-width expandable row
        if (item.type === "drawer") {
            return (
                <button
                    key={i}
                    className="kbyg-item-button"
                    onClick={() => setActiveItem(item)}
                >
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined">expand_content</span>
                </button>
            );
        }

        return null;
    };

    return (
        <div className="kbyg-wrapper">
            <h3 className="scs-vendor-name">Know before you go</h3>

            <div className="kbyg-list">
                {/* SPORTING PARK */}
                <div className="kbyg-col">
                    <div className="kbyg-title">Sporting Park</div>
                    {/* <p className="kybg-col-des"></p> */}
                    {/* INFO ITEMS */}
                    <div className="kbyg-info-group-wrapper">

                        <div className="kbyg-info-group">
                            {grouped.sportingPark
                            .filter((i) => i.type === "info")
                            .map(renderItem)}
                        </div>
                     {/* <div>
                        <img src="https://scs-ochre.vercel.app/kbyg/26-SCS-Plaza-Website-Map-cropped.jpg"/>
                    </div>  */}
                    </div>

                    {/* DRAWER + LINK ITEMS */}
                    {/* <div className="kbyg-link-drawer-group">
                        {grouped.sportingPark
                            .filter((i) => i.type !== "info")
                            .map(renderItem)}
                    </div> */}
                </div>


                {/* PUBLIC TRANSPORTATION */}
                <div className="kbyg-col">
                    <div className="kbyg-title">Public Transportation</div>
                    <p className="kybg-col-des">
                        Connect KC26 Region Direct and the Ride KC Legends Loop will be
                        available throughout Soccer Capital Summer.
                    </p>
                    <div className="kbyg-link-drawer-group">{grouped.publicTransportation.map(renderItem)}</div>
                </div>

                {/* PARKING & RIDESHARE */}
                <div className="kbyg-col">
                    <div className="kbyg-title">Parking & Rideshare</div>
                    <p className="kybg-col-des">
                        We’ve made it easy! Parking and Rideshare pick-up are available at
                        Sporting Park all throughout Soccer Capital Summer.
                    </p>
                    <div className="kbyg-link-drawer-group">{grouped.parkingRideshare.map(renderItem)}</div>
                </div>
            </div>

            {activeItem &&
                createPortal(
                    <KBYGDrawer item={activeItem} onClose={() => setActiveItem(null)} />,
                    document.body
                )}
        </div>
    );
}

/* -----------------------------------------
   DRAWER COMPONENT
------------------------------------------ */
function KBYGDrawer({ item, onClose }: { item: KBItem; onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

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
                        // <p className="scs-drawer-bio">{item.drawerDescription}</p>
                   <div
            className="scs-drawer-bio"
            dangerouslySetInnerHTML={{ __html: item.drawerDescription }}
          />
                   )}

                    <div className="scs-drawer-links">
                        {item.drawerLink && (
                            <a href={item.drawerLink} target="_blank" className="scs-drawer-a">
                                <span className="material-symbols-outlined">
                                    confirmation_number
                                </span>
                                <span className="scs-drawer-icon-label">buy pass</span>
                            </a>
                        )}

                        {item.drawerPin && (
                            <a href={item.drawerPin} target="_blank" className="scs-drawer-a">
                                <span className="material-symbols-outlined">pin_drop</span>
                                <span className="scs-drawer-icon-label">directions</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
