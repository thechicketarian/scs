import React from 'react';
import { useSheetData } from '../useSheetData';
import './TicketCards.css';

export default function TicketCards({ category }) {
  const { data, loading } = useSheetData('693949832');

  if (!category) return null;
  if (loading) return <div className="loading">Syncing Tickets...</div>;

  // 1. FILTER: Ignore ghost rows (rows with no title) 
  // and match the requested category
  const filteredData = data.filter(item => 
    item.title && 
    (item.category || "").trim().toLowerCase() === category.trim().toLowerCase()
  );

  /**
   * 2. DYNAMIC PERK LOOP
   * Updated to match your JSON: perkLabel1, perkIcon1, etc.
   */
  const getDynamicPerks = (row) => {
    return Object.keys(row)
      .filter(key => key.startsWith('perkLabel')) 
      .map(labelKey => {
        // Automatically finds the icon: perkLabel1 -> perkIcon1
        const iconKey = labelKey.replace('Label', 'Icon');
        return {
          text: row[labelKey],
          icon: row[iconKey] || 'check_circle'
        };
      })
      .filter(perk => perk.text && perk.text.trim() !== "");
  };

  const renderPerk = (icon, txt) => {
    const iconName = icon?.trim().toLowerCase() || 'check_circle';
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
      {filteredData.map((c, index) => {
        const perks = getDynamicPerks(c);
        
        // 3. CTA LOGIC
        // Using lowercase 'buttontext' and 'fevoId' as seen in your log
        const rawCta = (c.fevoId || "").trim();
        const bText = c.buttontext || c.buttonText; 
        
        const isEmail = rawCta.includes('@');
        const isUrl = rawCta.startsWith('http');
        const isFevo = !isEmail && !isUrl && rawCta !== "";

        return (
          <div key={index} className="premiumCard animate__animated animate__fadeIn">
            {c.premiumCardImage && (
              <div className="skc-cardImage">
                <img src={c.premiumCardImage} alt={c.title} />
              </div>
            )}
            
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
                    {perks.map((p, i) => (
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
                    onClick={() => window.GMWidget?.open(rawCta)}
                  >
                    {bText || 'Find Tickets'}
                  </button>
                ) : (
                  <a 
                    href={isEmail ? `mailto:${rawCta}` : rawCta} 
                    className="sqs-button-element--primary sqs-block-button-element"
                    target={isEmail ? "_self" : "_blank"} 
                    rel="noopener noreferrer"
                    type='button'
                  >
                    {bText || (isEmail ? 'Email Us' : 'Learn More')}
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