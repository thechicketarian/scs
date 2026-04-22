import React, { useState } from 'react';
import { useSheetData } from '../useSheetData';
import './ScheduleCarousel.css';

export default function ScheduleCarousel() {
  // Pulling only the Meta data (Date, Theme, Doors, Session ends, etc.)
  const { data: rawMeta, loading } = useSheetData('843872450');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) return <div className="loading">Syncing Schedule...</div>;

  const metaData = rawMeta || [];

  // Navigation Logic
  const nextSlide = () => {
    if (currentIndex < metaData.length - 4) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, metaData.length - 4));
    }
  };

  return (
    <div className="scs-carousel-container">
      <button className="nav-btn prev" onClick={prevSlide}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </button>
      
      <button className="nav-btn next" onClick={nextSlide}>
        <span className="material-symbols-outlined">arrow_forward_ios</span>
      </button>

      <div className="scs-carousel-window">
        <div 
          className="scs-carousel-track" 
          style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
        >
          {metaData.map((day, index) => {
            // Check if there's a second session by looking for session2Start
            const hasTwoSessions = !!day.session2Start;

            return (
              <div key={index} className="scs-carousel-item">
                <div className="scs-day-block">
                  {/* 1. THE DATE */}
                  <h3 className="scs-date-text">{day.date}</h3>
                  
                  <div className="scs-match-list">
                    <div className="scs-session-carousel">
                      
                      {/* 2. THE THEME */}
                      <div className="scs-theme-wrapper">
                        {/* <span className="scs-theme-label">Theme</span> */}
                        <div className="scs-theme-title">
                          {day.theme || "Event TBD"}
                        </div>
                      </div>

                      <hr className="scs-card-divider" />

                      {/* 3. SESSION TIMES */}
                      <div className="scs-times-wrapper">
                        {hasTwoSessions ? (
                          <>
                            <div className="scs-time-row">
                              <span className="scs-session-id">Session 1</span>
                              <span className="scs-time-val">{day.doorsOpen} – {day.session1End}</span>
                            </div>
                            <div className="scs-time-row">
                              <span className="scs-session-id">Session 2</span>
                              <span className="scs-time-val">{day.session2Start} – {day.doorsClose}</span>
                            </div>
                          </>
                        ) : (
                          <div className="scs-time-row">
                            <span className="scs-session-id">Doors</span>
                            <span className="scs-time-val">{day.doorsOpen} – {day.doorsClose}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}