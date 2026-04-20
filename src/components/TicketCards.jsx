// import { useSheetData } from '../useSheetData';
// import './TicketCards.css'

// export default function TicketCards({ category = 'GA' }) {
//   const { data, loading } = useSheetData(category);

//   const renderPerk = (icon, txt) => {
//     if (!txt) return null;
//     const iconName = icon?.trim().toLowerCase() || 'check_circle';
//     return (
//       <div className="perkItem">
//         <div className="perkImg">
//           <span className="material-symbols-outlined">{iconName}</span>
//         </div>
//         <span>{txt}</span>
//       </div>
//     );
//   };

//   if (loading) return <div className="loading">Loading...</div>;

// return (
//     /* This div provides the "hook" for your CSS selectors */
//     <div className={`scs-grid-${category.toLowerCase()}`}>
//       {data.map((c, index) => (
//         <div key={index} className="premiumCard animate__animated animate__fadeIn">
//           {c.premiumcardimage && (
//             <div className="skc-cardImage">
//               <img src={c.premiumcardimage} alt={c.title} />
//             </div>
//           )}
          
//           <div className="cardCopyWrapper">
//             <div className="cardDescription">
//               <h3 className="cardTitle">{c.title}</h3>
//               <p>{c.description}</p>
//             </div>

//             {(c.perk1text || c.perk2text || c.perk3text) && (
//               <>
//                 {c.perkstitle && <div><h5>{c.perkstitle}</h5></div>}
//                 <div className="perks-list">
//                   {renderPerk(c.perk1icon, c.perk1text)}
//                   {renderPerk(c.perk2icon, c.perk2text)}
//                   {renderPerk(c.perk3icon, c.perk3text)}
//                 </div>
//               </>
//             )}

//             <div className="fevo-wrapper">
//               <button 
//                 type="button" 
//                 className="sqs-button-element--primary sqs-block-button-element" 
//                 onClick={() => window.GMWidget?.open(c.fevoid)}
//               >
//                 {c.buttontext || 'Find Tickets'}
//               </button>
//             </div>
            
//             {c.disclaimer && <div className="cardDisclaimer">{c.disclaimer}</div>}
//           </div>
//         </div>
//       ))}
//     </div>

//   );
// }

import { useSheetData } from '../useSheetData';
import './TicketCards.css'

export default function TicketCards({ category }) {
  const { data, loading } = useSheetData('693949832');

  if (!category) {
    console.warn("TicketCards: No category prop provided.");
    return null;
  }

  const filteredData = data.filter(item => 
    (item.category || "").trim().toLowerCase() === category.trim().toLowerCase()
  );

  const renderPerk = (icon, txt) => {
    if (!txt) return null;
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className={`scs-grid-${category.toLowerCase()}`}>
      {filteredData.map((c, index) => (
        <div key={index} className="premiumCard animate__animated animate__fadeIn">
          {/* UPDATED: premiumCardImage */}
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

            {/* UPDATED: perk1Text, perk2Text, perk3Text */}
            {(c.perk1Text || c.perk2Text || c.perk3Text) && (
              <>
                {/* UPDATED: perksTitle */}
                {c.perksTitle && <div><h5>{c.perksTitle}</h5></div>}
                <div className="perks-list">
                  {/* UPDATED: perkIcons and perkTexts */}
                  {renderPerk(c.perk1Icon, c.perk1Text)}
                  {renderPerk(c.perk2Icon, c.perk2Text)}
                  {renderPerk(c.perk3Icon, c.perk3Text)}
                </div>
              </>
            )}

            <div className="fevo-wrapper">
              <button 
                type="button" 
                className="sqs-button-element--primary sqs-block-button-element" 
                onClick={() => window.GMWidget?.open(c.fevoId)} // UPDATED: fevoId
              >
                {c.buttonText || 'Find Tickets'} {/* UPDATED: buttonText */}
              </button>
            </div>
            
            {c.disclaimer && <div className="cardDisclaimer">{c.disclaimer}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}