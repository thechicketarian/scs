import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { MusicRow, ArtistEntry } from "../types/types";
import { DateTime } from "luxon";
import "./HomeHero.css";
import FullSchedule from "./FullSchedule";

export default function HomeHero() {
    return (
        <div className="scs-home-hero-panel-1-wrapper-2">
            <div className="scs-home-hero-div1">

              

                <div className="scs-panel-1-inner-2" >
                                  {/* <div className="panel-1-bar-2">
                                        <div className="scs-text-span-sm">
                soccer
               </div>
                                         <div className="panel-skc-logo">
                <img src="https://scs-ochre.vercel.app/icons/SKC-Wordmark_SportingKansasCity-LightBG.svg" alt="Sporting Kansas City Logo"/>
               </div>
               
               <div className="scs-text-span-sm">
                summer
               </div>
        </div> */}
                    <h1> The world's game is here</h1>
                    {/* <h1>
                    <span className="text-indigo">Our Game.</span>
                    <span className="text-indigo">Our City.</span>
                </h1> */}

                </div>

            </div>

            {/* <div className="scs-home-hero-div2">

                          <FullSchedule mode="upcoming"/>
                    </div> */}
                    {/* <div>
                     <img src="https://scs-ochre.vercel.app/icons/26-SCS-SoccerBall.svg" width={200}/>
                    </div> */}
                     <div className="parent">
      <button className="div1">tickets<span className="material-symbols-outlined">
arrow_right_alt
</span></button>
        <button className="div2">experiences<span className="material-symbols-outlined">
arrow_right_alt
</span></button>
        <button className="div3">concerts<span className="material-symbols-outlined">
arrow_right_alt
</span></button>
    </div>
  
        </div>
    );
}
