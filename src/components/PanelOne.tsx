import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { MusicRow, ArtistEntry } from "../types/types";
import { DateTime } from "luxon";
import "./PanelOne.css";

export default function PanelOne() {
    return (
        <div className="scs-home-hero-panel-1-wrapper">
                                        {/* <div className="scs-display-stacked">
                <span className="scs-text-span-sm">
                    <span>watch parties</span>
                </span>
                <span className="scs-text-span-sm">
                  <span>concerts</span>
                </span>
                 <span className="scs-text-span-sm">
                all summer long
                </span>
                <span className="scs-text-span-sm">
                  <span>experiences</span>
                </span>
                 <span className="scs-text-span-sm">
                  <span>local KC vendors</span> 
                </span>
                       
                </div> */}

            <div className="scs-panel-1-inner" >
                <h5>Watch the world’s game at Sporting Park  </h5>
                <h1>
                    <span className="text-indigo">Our Game.</span>
                    <span className="text-indigo">Our City.</span>
                </h1>
                
                {/* <p>This summer, the world’s game is visiting Kansas City. But here, it’s always been part of who we are.</p> */}
                {/* <p>
                    Soccer Capital Summer brings together the game and the city — celebrating the energy, passion, and culture that Kansas City brings to soccer all summer long. 
                </p> */}
            </div>
                                                    <div className="panel-1-bar">
                                        <div className="scs-text-span-sm">
                soccer
               </div>
                                         <div className="panel-skc-logo">
                <img src="https://scs-ochre.vercel.app/icons/SKC-Wordmark_SportingKansasCity-LightBG.svg" alt="Sporting Kansas City Logo"/>
               </div>
               
               <div className="scs-text-span-sm">
                summer
               </div>
                                    </div>
                
        </div>
    );
}
