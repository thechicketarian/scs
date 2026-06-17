import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { MusicRow, ArtistEntry } from "../types/types";
import { DateTime } from "luxon";
import "./PanelOne.css";
import FullSchedule from "./FullSchedule";

export default function AppSched() {
    return (
        <div className="scs-home-hero-panel-1-wrapper scs-app-overrides">
            <div className="panel-copy-widget">
                {/* <div className="scs-panel-1-inner" >
                    <h5>Watch the world’s game at Sporting Park</h5>
                    <h1>
                        <span className="text-indigo">Our Game.</span>
                        <span className="text-indigo">Our City.</span>
                    </h1>
                    <div className="scs-lottie-arrow">
                        <img src="/icons/arrowjumpdownlottie.svg" />
                    </div>
                </div> */}

            </div>
            <div className="panel-sched-widget">
                {/* <div className="panel-sched-star">
                    <img src="https://scs-ochre.vercel.app/icons/SCS-RedStar.svg" />
                </div> */}
                <FullSchedule mode="app" />
            </div>

        </div>
    );
}
