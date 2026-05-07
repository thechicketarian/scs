import HomeLiveMusicWidget from "./HomeLiveMusicWidget";
import "./Home.css";
import HorizontalScroller from "./HorizontalScroller";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Schedule from "./Schedule";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {

  // Smooth scroll easing
  useLayoutEffect(() => {
    let tween: gsap.core.Tween | null = null;
    let lastY = window.scrollY;

    const smoothScroll = () => {
      const currentY = window.scrollY;
      if (currentY === lastY) return;
      lastY = currentY;

      if (tween) tween.kill();

      tween = gsap.to(window, {
        scrollTo: currentY,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    };

    window.addEventListener("scroll", smoothScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", smoothScroll);
      if (tween) tween.kill();
    };
  }, []);

  return (
    <div className="home-wrapper">

      {/* ACT 1 — Horizontal Panels + About */}
      <div className="hori-panel-section">
        <HorizontalScroller />
      </div>
      {/* <div>
     experience the worlds game at Sporting Park
      </div> */}
      {/* ACT 2 — Lineup */}
      <div className="home-lineup-section">
        <HomeLiveMusicWidget />
      </div>
      

      <div>
        schedule widget to do
      </div>

    </div>
  );
}
