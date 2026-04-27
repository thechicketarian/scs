// 

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useSheetData } from '../useSheetData';
import './ScheduleCarousel.css';

export default function ScheduleCarousel() {
  const { data: metaData, loading } = useSheetData('843872450');
  const trackRef = useRef(null);
  const pos = useRef(0); // Tracks the current X offset

  if (loading) return <div className="loading">Syncing...</div>;

  const move = (direction) => {
    const track = trackRef.current;
    const card = track.querySelector('.scs-carousel-item');
    const gap = 16;
    const itemWidth = card.offsetWidth + gap;
    
    // Calculate total track width vs visible window
    const maxScroll = -(track.scrollWidth - track.offsetWidth);

    if (direction === 'next') {
      pos.current = Math.max(pos.current - itemWidth, maxScroll);
    } else {
      pos.current = Math.min(pos.current + itemWidth, 0);
    }

    // The GSAP Magic: Smoother than native CSS
  };

  return (
    <div className="scs-carousel-container">
      <h2 className="scs-carousel-heading">Join us at sporting park</h2>
      
      <div className="scs-carousel-main-controls">
        <button className="nav-btn prev" onClick={() => move('prev')}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        
        <div className="scs-carousel-window">
          {/* We use X instead of scrollLeft for that GSAP feel */}
          <div className="scs-carousel-track" ref={trackRef}>
            {metaData?.map((day, index) => (
              <div key={index} className="scs-carousel-item">
                <div className="scs-day-block">
                  <h3 className="scs-date-text">{day.date}</h3>
                  <div className="scs-session-carousel">
                    <div className="scs-theme-title">{day.theme || "Event TBD"}</div>
                    <hr className="scs-card-divider" />
                    <div className="scs-times-wrapper">
                      <div className="scs-time-row">
                        <span className="scs-session-id">Doors</span>
                        <span className="scs-time-val">{day.doorsOpen} – {day.doorsClose}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="nav-btn next" onClick={() => move('next')}>
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </div>
  );
}