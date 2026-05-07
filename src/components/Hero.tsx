import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  // Typed refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const electricRef = useRef<HTMLDivElement | null>(null);
  const summerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !trackRef.current || !electricRef.current) return;

      // MAIN SCROLL TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // ACT 1 — Horizontal slide
      tl.to(trackRef.current, {
        x: () => -(trackRef.current!.offsetWidth * 0.8),
        duration: 1.5,
        ease: "power2.inOut",
      })
        .to(trackRef.current, {
          y: "-120vh",
          duration: 1,
          ease: "power2.in",
        })

        // ACT 2 — Pull-up copy block
        .fromTo(
          electricRef.current,
          { y: "120vh", opacity: 1 },
          { y: "0%", duration: 1, ease: "power4.out" },
          "-=0.6"
        )
        .to(electricRef.current, {
          y: "-120vh",
          duration: 1,
          ease: "power4.in",
        })

        // ACT 3 — Finale stagger
        .from(".summer-word", {
          y: 150,
          opacity: 0,
          stagger: 0.2,
          duration: 1.05,
          ease: "expo.out",
        });

      // WORD FLIPPER
      const words = gsap.utils.toArray<HTMLElement>(".flipping-soccer");
      const flipTl = gsap.timeline({ repeat: -1 });

      words.forEach((word) => {
        flipTl
          .fromTo(
            word,
            { opacity: 0, y: 20, rotationX: -90 },
            { opacity: 1, y: 0, rotationX: 0, duration: 0.5, ease: "back.out(1.7)" }
          )
          .to(word, {
            opacity: 0,
            y: -20,
            rotationX: 90,
            duration: 0.5,
            ease: "power2.in",
          }, "+=1.5");
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);

    return () => {
      ctx.revert();
      window.removeEventListener("load", handleRefresh);
      window.removeEventListener("resize", handleRefresh);
    };
  }, []);

  return (
    <section className="bc-custom-home-hero" id="scs-hero-root" ref={sectionRef}>
      <div className="marquee-wrapper">
        <div className="marquee-track" ref={trackRef}>
          <div className="marquee-copy-wrapper">
            <h1 className="bc-hero-title">
              <span className="text-indigo">Our Game.</span>
              <span className="text-indigo">Our City.</span>
            </h1>

            <div className="supportingText">
              <span>sporting KC presents</span>
              <span>soccer capital summer</span>
              <span>kansas city</span>
            </div>
          </div>

          <div className="bc-soccer-ball-animation">
            <span className="material-symbols-outlined">sports_soccer</span>
          </div>

          <hr className="bc-hr" />

          <div className="bc-dynamic-soccer">
            <h3>
              this is how kansas city does
              <span className="flipping-soccer-wrapper">
                <span className="flipping-soccer">soccer</span>
                <span className="flipping-soccer">football</span>
                <span className="flipping-soccer">fútbol</span>
                <span className="flipping-soccer">futebol</span>
                <span className="flipping-soccer">كرة القدم</span>
                <span className="flipping-soccer">voetbal</span>
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div className="electric-wrap" ref={electricRef}>
        <h2 className="electric">
          Watch the world’s game <span>at Sporting Park</span>
        </h2>

        <div className="bc-hero-about">
          <p>This summer, the world’s game is visiting Kansas City. But here, it’s always been part of who we are.</p>
          <p>
            Soccer Capital Summer is a series of events and experiences that celebrate both the game and the city Kansas City loves. It brings together the culture of soccer with the spirit of Kansas City — loud, high-energy, and full of passion for the game.
          </p>
          <p>
            Over the summer, fans can come together just steps from where the pros play to enjoy watch parties, concerts, live entertainment, and local KC vendors, all bringing the energy of the game to life.
          </p>
        </div>
      </div>

      <div className="summer-wrap" ref={summerRef}>
        <h2 className="text-outline">
          <span className="summer-word">ALL</span>
          <span className="summer-word">SUMMER</span>
          <span className="summer-word">LONG</span>
          <br />
          <div className="summer-word heart-icon">
            <img
              src="https://media.ffycdn.net/us/sporting-kansas-city/YurkiJoYWumen6sMzfAF.eps?width=2400"
              alt="Heart"
            />
          </div>
          <span className="summer-word bc-script">Kansas</span>
          <span className="summer-word bc-script">City</span>
        </h2>
      </div>
    </section>
  );
}
