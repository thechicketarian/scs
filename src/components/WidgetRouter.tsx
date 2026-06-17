import React from "react";
import ExperiencesWidget from "./ExperiencesWidget";
import FullSchedule from "./FullSchedule";
import LiveMusicSchedule from "./LiveMusicSchedule";
import KnowBeforeYouGo from "./KnowBeforeYouGo";
import AppSched from "./AppSched";


export function WidgetRouter() {
  const path = window.location.pathname;

  switch (path) {
    case "/experiences":
      return <ExperiencesWidget />;

    case "/schedule":
      return <FullSchedule mode="full" />;

    case "/music":
      return <LiveMusicSchedule />;

    case "/kbyg":
      return <KnowBeforeYouGo />;

    case "/app-schedule":
      return <AppSched />;

    default:
      return null; // means Squarespace injection takes over
  }
}
