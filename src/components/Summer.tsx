// Summer.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Summer.css"; // or a separate Summer.css if you split later

gsap.registerPlugin(ScrollTrigger);

export default function Summer() {
  const summerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!summerRef.current) return;

    gsap.from(summerRef.current.querySelectorAll(".summer-word"), {
      scrollTrigger: {
        trigger: summerRef.current,
        start: "top 80%",
      },
      y: 150,
      opacity: 0,
      stagger: 0.2,
      duration: 1.05,
      ease: "expo.out",
    });
  }, []);

  return (
    <section className="summer-wrap" ref={summerRef}>
      <h2 className="text-outline">
        <span className="summer-word">Matches</span>
        <span className="summer-word">Music</span>
        <span className="summer-word">Memories</span>
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
    </section>
  );
}
