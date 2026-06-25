import React from "react";
import "./TicketCards.css";
import { useSheetData } from "../hooks/useSheetData";
import { TicketCardsProps } from "../types/types";
import Loading from "./Loading";
import TicketImageCarousel from "./TicketImageCarousel";



// ---- Component ----
export default function TicketCards({ category }: TicketCardsProps) {
  const { data, loading } = useSheetData("693949832");

  if (!category) return null;
  if (loading) return <Loading label="Syncing Tickets…" />;

  // ---- Filter tickets by category ----
  const filteredData = data.filter(
    (item: any) =>
      item.category &&
      item.category.trim().toLowerCase() === category.trim().toLowerCase()
  );

  // ---- Extract dynamic perks ----
  const getDynamicPerks = (row: any) => {
    return Object.keys(row)
      .filter((key) => key.startsWith("perkLabel"))
      .map((labelKey) => {
        const iconKey = labelKey.replace("Label", "Icon");
        return {
          text: row[labelKey],
          icon: row[iconKey] || "check_circle",
        };
      })
      .filter((perk) => perk.text && perk.text.trim() !== "");
  };

  // ---- Render a single perk ----
  const renderPerk = (icon: string, txt: string) => {
    const iconName = icon?.trim().toLowerCase() || "check_circle";
    return (
      <div className="perkItem">
        <div className="perkImg">
          <span className="material-symbols-outlined">{iconName}</span>
        </div>
        <span>{txt}</span>
      </div>
    );
  };

  return (
    <div className={`scs-grid-${category.toLowerCase()}`}>
      {filteredData.map((c: any, index: number) => {
        const perks = getDynamicPerks(c);

        // ---- Multi-image logic ----
        const imageList = (c.premiumCardImage || "")
          .split(",")
          .map((url: string) => url.trim())
          .filter((url: string) => url !== "");

        // ---- CTA logic ----
        const rawCta = (c.fevoId || "").trim();
        const bText = c.buttontext || c.buttonText;
        const isEmail = rawCta.includes("@");
        const isUrl = rawCta.startsWith("http");
        const isFevo = !isEmail && !isUrl && rawCta !== "";

        return (
          <div key={index} className="premiumCard animate__animated animate__fadeIn">
            <div className="skc-image-wrapper">
              {/* {imageList.map((imgUrl: string, i: number) => (
                <div key={i} className="skc-cardImage">
                  <img src={imgUrl} alt={`${c.title} view ${i + 1}`} />
                </div>
              ))} */}
           <TicketImageCarousel images={imageList} />
            </div>

            <div className="cardCopyWrapper">
              <div className="cardDescription">
                <h3 className="cardTitle">{c.title}</h3>
                <p>{c.description}</p>
              </div>

              {perks.length > 0 && (
                <div className="perks-wrapper">
                  {(c.perktitle || c.perkTitle) && (
                    <h5 className="perks-title">{c.perktitle || c.perkTitle}</h5>
                  )}
                  <div className="perks-list">
                    {perks.map((p: any, i: number) => (
                      <React.Fragment key={i}>
                        {renderPerk(p.icon, p.text)}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <div className="fevo-wrapper">
                {isFevo ? (
                  <button
                    type="button"
                    className="sqs-button-element--primary sqs-block-button-element"
                    onClick={() => (window as any).GMWidget?.open(rawCta, {ref: 'WEB'})}
                  >
                    {bText || "Find Tickets"}
                  </button>
                ) : (
                  <a
                    href={isEmail ? `mailto:${rawCta}` : rawCta}
                    className="sqs-button-element--primary sqs-block-button-element"
                    target={isEmail ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                  >
                    {bText || (isEmail ? "Email Us" : "Learn More")}
                  </a>
                )}
              </div>

              {c.disclaimer && <div className="cardDisclaimer">{c.disclaimer}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
