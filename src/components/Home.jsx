import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScheduleCarousel from './ScheduleCarousel';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. PIN & SLIDE MARQUEE ONLY
      // This pins the root until the horizontal slide finishes
      gsap.to(trackRef.current, {
        x: () => -(trackRef.current.offsetWidth * 0.8),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%", // How long the pin lasts
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });

      // 2. SOCCER WORD FLIPPER (Infinite Loop)
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

      // 3. FINALE ANIMATION (Triggers when scrolled into view)
      gsap.from(".summer-word", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".summer-wrap",
          start: "top 80%",
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bc-custom-home-hero" ref={sectionRef}>
      <div className="bc-hero-overlay"></div>

      {/* ACT 1: PINNED MARQUEE */}
      <div className="marquee-wrapper">
        <div className="marquee-track" ref={trackRef}>
          <div className='marquee-copy-wrapper'>
            <h1 className='bc-hero-title'>
              <span className="text-indigo">Our Game.</span>
              <span className="text-indigo">Our City.</span>
            </h1>
            <div className='supportingText'>
              <span className="text-white">sporting KC presents</span>
              <span className="text-white">soccer capital of soccer</span>
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
      </div>

      {/* NATURAL FLOW SECTIONS BEGIN HERE */}
      <div className="electric-wrap">
        <h2 className="electric">Watch the world’s game <span>at Sporting Park </span></h2>
        <div className='bc-hero-about'>
          <p>This summer, the world’s game is visiting Kansas City. But here, it’s always been part of who we are.</p>
          <p>Soccer Capital Summer is a series of events and experiences that celebrate both the game and the city Kansas City loves.</p>
          <p>Over the summer, fans can come together just steps from where the pros play to enjoy watch parties, concerts, and live entertainment.</p>
        </div>
      </div>

      <div className="home-schedule-integration">
         <ScheduleCarousel />
      </div>

      <div className="summer-wrap">
        <h2 className="text-outline">
          <span className="summer-word">ALL</span>
          <span className="summer-word">SUMMER</span>
          <span className="summer-word">LONG</span>
          <br/>
          <div className="summer-word heart-icon">
            <img src='https://media.ffycdn.net/us/sporting-kansas-city/YurkiJoYWumen6sMzfAF.eps?width=2400' alt="Heart" />
          </div>
          <span className="summer-word bc-script">Kansas </span>
          <span className="summer-word bc-script">City </span>
        </h2>
      </div>
    </section>
  );
}