import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./HorizontalScroller.css";
import PanelTwo from "./PanelTwo";
import PanelOne from "./PanelOne";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroller() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const panel1Ref = useRef<HTMLDivElement | null>(null);
  const panel2Ref = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const p1 = panel1Ref.current;
    const p2 = panel2Ref.current;
    const about = aboutRef.current;

    if (!section || !p1 || !p2 || !about) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // ACT 1 — slide panel 1 left
    tl.to(p1, {
      x: () => -p2.offsetLeft,
      duration: 1.5,
    });

    // ACT 2 — slide panel 2 in
    tl.to(
      p2,
      {
        x: () => -p2.offsetLeft,
        duration: 1.5,
      },
      "-=0.9"
    );

    // ⭐ ACT 3 — PANEL PUSH
    tl.to(
      [p1, p2],
      {
        yPercent: -100, // panels slide UP and off
        duration: 2,
        ease: "power2.out",
      },
      "+=0.4"
    );

    tl.to(
      about,
      {
        yPercent: -100, // about slides UP into place
        duration: 2,
        ease: "power2.out",
      },
      "<" // sync with panel movement
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="h-timeline-container" ref={sectionRef}>
      <div className="h-panel h-panel-1" ref={panel1Ref}>
       {/* <PanelOne/> */}
       test one
      </div>
      <div className="h-panel h-panel-2" ref={panel2Ref}>
        {/* <PanelTwo /> */}
        test two
      </div>

      {/* ⭐ ABOUT SECTION — slides up from below */}
      <div className="about-section" ref={aboutRef}>
        <div>
          <div className="about-inner">
           
            <h5>watch the worlds game at <span>sporting park</span></h5>
            <p>Over the summer, fans can come together just steps from where the pros play to enjoy watch parties, concerts, live entertainment, and local KC vendors, all bringing the energy of the game to life.</p>
            {/* <p>
            Soccer Capital Summer is a series of events and experiences that celebrate both the game and the city Kansas City loves. It brings together the culture of soccer with the spirit of Kansas City — loud, high-energy, and full of passion for the game.
          </p> */}
            {/* <p>
            Over the summer, fans can come together just steps from where the pros play to enjoy watch parties, concerts, live entertainment, and local KC vendors, all bringing the energy of the game to life.
          </p> */}
          </div>
          <div className="border">
            <img src="https://scs-ochre.vercel.app/icons/26-SCS-StadiumRoofline.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}
