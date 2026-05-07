import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { MusicRow, ArtistEntry } from "../types/types";
import { DateTime } from "luxon";
import "./PanelTwo.css";

export default function PanelTwo() {
    return (
        <div className="scs-home-hero-panel-2-wrapper">
            <div className="scs-floating-test">
                {/* <span>SKC</span> */}
                <div className="floatin-img">
                    <img src="https://placebear.com/200/200" />
                </div>
                {/* <div className="floatin-img">
                    <img src="https://placebear.com/200/200" />
                </div>
                <span>SKC</span> */}
            </div>
            
            <div className="scs-panel-2-inner">
                <div className="scs-panel-2-inner-div2">
                    <div className="panel-2-grid-img">
                    <img src="https://placebear.com/600/600" />
                </div>
                </div>
               <div className="scs-panel-2-inner-div1">
                 <h3>This is how Kansas City does soccer</h3>
               </div>
              <div className="scs-panel-2-inner-div3">
 <div className="panel-2-grid-img">
                    <img src="https://placebear.com/600/600" />
                </div>
                </div>
                 <div className="scs-panel-2-inner-div4">
 <div className="panel-2-grid-img">
                    <img src="https://placebear.com/600/600" />
                </div>
                </div>
                  <div className="scs-panel-2-inner-div5">
 <div className="panel-2-grid-img">
                    <img src="https://placebear.com/600/600" />
                </div>
                </div>
            </div>
            {/* <div className="about-globe">
                <img src="/icons/SKC-Secondary_Logo-1C_LightBG.svg" />
            </div> */}
        </div>
    );
}
