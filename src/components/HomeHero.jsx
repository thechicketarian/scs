import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HomeHero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. PIN & HORIZONTAL SLIDE ONLY
      gsap.to(trackRef.current, {
        x: () => -(trackRef.current.offsetWidth * 0.8),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%", // How long the pin lasts
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        }
      });

      // 2. SOCCER WORD FLIPPER (Independent Loop)
      const words = gsap.utils.toArray('.flipping-soccer');
      const flipTl = gsap.timeline({ repeat: -1 });

      words.forEach((word) => {
        flipTl
          .fromTo(word,
            { opacity: 0, y: 20, rotationX: -90 },
            { opacity: 1, y: 0, rotationX: 0, duration: 0.5, ease: "back.out(1.7)" }
          )
          .to(word,
            { opacity: 0, y: -20, rotationX: 90, duration: 0.5, ease: "power2.in" },
            "+=1.5"
          );
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bc-hero-wrapper" ref={sectionRef}>
      <div className="bc-hero-overlay"></div>

      <div className="hero-track" ref={trackRef}>
        <div className='hero-copy-wrapper'>
          <h1 className='bc-hero-title'>
            <span className="text-indigo">Our Game.</span>
            <span className="text-indigo">Our City.</span>
          </h1>
          <div className='supportingText'>
            <span className="text-white">sporting KC presents</span>
            <span className="text-white">soccer capital summer</span>
            <span className="text-white">kansas city</span>
          </div>
        </div>

        <div className='bc-soccer-ball-animation'>
          <span className="material-symbols-outlined">sports_soccer</span>
        </div>

        <hr className='bc-hr' />

        <div className='bc-dynamic-soccer'>
          <h3>this is how kansas city does
            <span className='flipping-soccer-wrapper'>
              <span className='flipping-soccer'>soccer</span>
              <span className='flipping-soccer'>football</span>
              <span className='flipping-soccer'>fútbol</span>
              <span className='flipping-soccer'>futebol</span>
              <span className='flipping-soccer'>كرة القدم</span>
              <span className='flipping-soccer'>voetbal</span>
            </span>
          </h3>
        </div>
      </div>
    </section>
  );
}