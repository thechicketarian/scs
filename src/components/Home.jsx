// import { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import ScheduleCarousel from './ScheduleCarousel';
// import './Home.css';

// gsap.registerPlugin(ScrollTrigger);

// export default function Home() {
//   const scrollContainerRef = useRef(null);
//   const heroRef = useRef(null);
//   const trackRef = useRef(null);

//   return (
//     <div className="home-wrapper" ref={scrollContainerRef}>
//       <div className="home-overlay"></div>
//       <div className="hero-wrapper" ref={heroRef}>
//         <div className="he-track" ref={trackRef}>
//           <div className='hero-copy-wrapper'>
//             <h1 className='hero-title'>
//               <span className="text-indigo">Our Game.</span>
//               <span className="text-indigo">Our City.</span>
//             </h1>
//             <div className='hero_supportingText'>
//               <span className="text-white">sporting KC presents</span>
//               <span className="text-white">soccer capital summer</span>
//               <span className="text-white">kansas city</span>
//             </div>
//           </div>
//           <div className='hero-soccer-ball-animation'>
//             <span className="material-symbols-outlined">sports_soccer</span>
//           </div>
//           <hr className='hero-hr' />
//           <div className='hero-dynamic-soccer'>
//             <h3>this is how kansas city does
//               <span className='hero-flipping-soccer-wrapper'>
//                 <span className='hero-flipping-soccer'>soccer</span>
//                 <span className='hero-flipping-soccer'>football</span>
//                 <span className='hero-flipping-soccer'>fútbol</span>
//                 <span className='hero-flipping-soccer'>futebol</span>
//                 <span className='hero-flipping-soccer'>كرة القدم</span>
//                 <span className='hero-flipping-soccer'>voetbal</span>
//               </span>
//             </h3>
//           </div>
//         </div>
//       </div>

//       <div className="hero-about-wrapper">
//         <div className="hero-about">
//           <h2 className="hero-about-title">Watch the world’s game <span>at Sporting Park </span></h2>
//           <div className='hero-about-desc'>
//              <p>This summer, the world’s game is visiting Kansas City. But here, it’s always been part of who we are.</p>
//           <p>
//             Soccer Capital Summer is a series of events and experiences that celebrate both the game and the city Kansas City loves. It brings together the culture of soccer with the spirit of Kansas City — loud, high-energy, and full of passion for the game.
//           </p>
//           <p>
//             Over the summer, fans can come together just steps from where the pros play to enjoy watch parties, concerts, live entertainment, and local KC vendors, all bringing the energy of the game to life.
//           </p>
//           </div>
//         </div>
//       </div>

//       <div className="home-schedule-section">
//          <ScheduleCarousel />
//       </div>
//       <div className="summer-wrap">
//         <h2 className="text-outline">
//           <span className="summer-word">ALL</span>
//           <span className="summer-word">SUMMER</span>
//           <span className="summer-word">LONG</span>
//           <br/>
//           <div className="summer-word heart-icon">
//             <img src='https://media.ffycdn.net/us/sporting-kansas-city/YurkiJoYWumen6sMzfAF.eps?width=2400' alt="Heart" />
//           </div>
//           <span className="summer-word bc-script">Kansas </span>
//           <span className="summer-word bc-script">City </span>
//         </h2>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScheduleCarousel from './ScheduleCarousel';
import './Home.css'; 

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const homeSectionRef = useRef(null);
  const homeTrackRef = useRef(null);
  const homeAboutRef = useRef(null);
  const homeSchedRef = useRef(null);
  const homeSummerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: homeSectionRef.current,
          start: "top top",
          end: "+=900%", 
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });

      // ACT 1: THE MARQUEE SLIDE
      tl.to(homeTrackRef.current, {
        x: () => -(homeTrackRef.current.offsetWidth * 0.8),
        duration: 1.5,
        ease: "power2.inOut"
      })
      .to(homeTrackRef.current, { y: "-120vh", duration: 1, ease: "power2.in" })

      // ACT 2: THE ABOUT PULL UP
      .fromTo(homeAboutRef.current,
        { y: "120vh", opacity: 1 },
        { y: "0%", duration: 1, ease: "power4.out" },
        "-=0.6"
      )
      .to(homeAboutRef.current, { y: "-120vh", duration: 1, ease: "power4.in" })

      // ACT 3: THE SCHEDULE PULL UP (INTERACTIVE)
      .fromTo(homeSchedRef.current,
        { y: "120vh", opacity: 1 },
        { y: "0%", duration: 1, ease: "power4.out" },
        "-=0.6"
      )
      .set(homeSchedRef.current, { pointerEvents: "all" }) // Enable clicks
      .to(homeSchedRef.current, {
        y: "-120vh",
        duration: 1,
        ease: "power4.in",
        delay: 1 // Distance for scrolling/clicking
      })
      .set(homeSchedRef.current, { pointerEvents: "none" }) // Disable clicks once gone

      // ACT 4: THE FINALE
      .from(".scs-home-summer-word", {
        y: 150,
        opacity: 0,
        stagger: 0.2,
        duration: 1.05,
        ease: "expo.out"
      });

      // WORD FLIPPER
      const words = gsap.utils.toArray('.scs-home-flipping-soccer');
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
    }, homeSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="scs-home-stage" ref={homeSectionRef}>
      
      {/* ACT 1 */}
      <div className="scs-home-marquee-wrapper">
        <div className="scs-home-marquee-track" ref={homeTrackRef}>
          <div className='scs-home-copy-wrapper'>
            <h1 className='scs-home-title'>
              <span className="scs-home-indigo">Our Game.</span>
              <span className="scs-home-indigo">Our City.</span>
            </h1>
            <div className='scs-home-supportingText'>
              <span className="text-white">sporting KC presents</span>
              <span className="text-white">soccer capital summer</span>
              <span className="text-white">kansas city</span>
            </div>
          </div>
          <div className='scs-home-ball-animation'>
            <span className="material-symbols-outlined">sports_soccer</span>
          </div>
          <hr className='scs-home-hr' />
          <div className='scs-home-dynamic-soccer'>
            <h3>this is how kansas city does
              <span className='scs-home-flipping-wrapper'>
                <span className='scs-home-flipping-soccer'>soccer</span>
                <span className='scs-home-flipping-soccer'>football</span>
                <span className='scs-home-flipping-soccer'>fútbol</span>
                <span className='scs-home-flipping-soccer'>futebol</span>
                <span className='scs-home-flipping-soccer'>كرة القدم</span>
                <span className='scs-home-flipping-soccer'>voetbal</span>
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* ACT 2 */}
      <div className="scs-home-about-wrap" ref={homeAboutRef}>
        <h2 className="scs-home-about-title">Watch the world’s game <span>at Sporting Park </span></h2>
        <div className='scs-home-about-desc'>
          <p>This summer, the world’s game is visiting Kansas City. But here, it’s always been part of who we are.</p>
          <p>Soccer Capital Summer is a series of events and experiences that celebrate both the game and the city Kansas City loves.</p>
          <p>Over the summer, fans can come together just steps from where the pros play to enjoy watch parties, concerts, live entertainment, and local KC vendors.</p>
        </div>
      </div>

      {/* ACT 3: SCHEDULE */}
      <div className="scs-home-sched-wrap" ref={homeSchedRef}>
        <div className="scs-home-sched-inner">
          <ScheduleCarousel />
        </div>
      </div>

      {/* ACT 4 */}
      <div className="scs-home-summer-wrap" ref={homeSummerRef}>
        <h2 className="scs-home-outline">
          <span className="scs-home-summer-word">ALL</span>
          <span className="scs-home-summer-word">SUMMER</span>
          <span className="scs-home-summer-word">LONG</span>
          <br/>
          <div className="scs-home-summer-word scs-home-heart">
            <img src='https://media.ffycdn.net/us/sporting-kansas-city/YurkiJoYWumen6sMzfAF.eps?width=2400' alt="Heart" />
          </div>
          <span className="scs-home-summer-word scs-home-script">Kansas </span>
          <span className="scs-home-summer-word scs-home-script">City </span>
        </h2>
      </div>
    </section>
  );
}

