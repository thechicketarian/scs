
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const electricRef = useRef(null);
  const summerRef = useRef(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top top",
  //         end: "+=500%",
  //         scrub: 1,
  //         pin: true,
  //         invalidateOnRefresh: true,
  //       }
  //     });

  //     // --- RELAY ACT 1: THE SLIDE ---
  //     tl.to(trackRef.current, {
  //       x: () => -(trackRef.current.offsetWidth * 0.8),
  //       duration: 1.5,
  //       ease: "power2.inOut"
  //     })
  //       // EXIT 1: Slide it all the way off-screen to the left
  //       // .to(trackRef.current, { xPercent: 0, y: -800, duration: 1 })
  //       //  .to(trackRef.current, { xPercent: 0, opacity: 0, duration: 1 })
  //       .to(trackRef.current, {
  //         y: "-120vh", // Goes up past the top
  //         // opacity: 0,
  //         duration: 1,
  //         ease: "power2.in"
  //       })

  //       // --- ACT 2: THE PULL UP (Center Copy) ---
  //       .fromTo(electricRef.current,
  //         {
  //           y: "120vh",
  //           opacity: 1 // Keep it solid as it pushes in
  //         },
  //         {
  //           y: "0%",
  //           duration: 1,
  //           ease: "power4.out"
  //         },
  //         "-=0.6" // Start pulling while Act 1 is still pushing up
  //       )
  //       // EXIT 2: Keep the push theme going to clear the copy
  //       .to(electricRef.current, {
  //         y: "-120vh",
  //         duration: 1,
  //         ease: "power4.in"
  //       })

  //       // --- RELAY ACT 3: THE SPLIT ---
  //       // Rise from the bottom to meet the viewer
  //       .from(".summer-word", {
  //         y: 150,
  //         opacity: 0,
  //         stagger: 0.2,
  //         duration: 1.05,
  //         ease: "expo.out"
  //       });

  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);
  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     // ... your existing tl timeline code ...

  //     // --- NEW: SOCCER WORD FLIPPER ---
  //     const words = gsap.utils.toArray('.flipping-soccer');
  //     const flipTl = gsap.timeline({ repeat: -1 });

  //     words.forEach((word, i) => {
  //       flipTl
  //         .fromTo(word,
  //           { opacity: 0, y: 20, rotationX: -90 },
  //           { opacity: 1, y: 0, rotationX: 0, duration: 0.5, ease: "back.out(1.7)" }
  //         )
  //         .to(word,
  //           { opacity: 0, y: -20, rotationX: 90, duration: 0.5, ease: "power2.in" },
  //           "+=1.5" // How long each word stays visible
  //         );
  //     });

  //   }, sectionRef);
  //   return () => ctx.revert();
  // }, []);

    useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. MAIN SCROLL TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true, // Recalculates on window resize/Squarespace shifts
        }
      });

      // ACT 1: THE HORIZONTAL SLIDE
      tl.to(trackRef.current, {
        x: () => -(trackRef.current.offsetWidth * 0.8),
        duration: 1.5,
        ease: "power2.inOut"
      })
      // EXIT 1: Vertical Push Up
      .to(trackRef.current, {
        y: "-120vh",
        duration: 1,
        ease: "power2.in"
      })

      // ACT 2: THE PULL UP (Copy Block)
      .fromTo(electricRef.current,
        {
          y: "120vh",
          opacity: 1 
        },
        {
          y: "0%",
          duration: 1,
          ease: "power4.out"
        },
        "-=0.6" // Slight overlap
      )
      // EXIT 2: Vertical Push Up
      .to(electricRef.current, {
        y: "-120vh",
        duration: 1,
        ease: "power4.in"
      })

      // ACT 3: THE FINALE (Staggered Opacity)
      .from(".summer-word", {
        y: 150,
        opacity: 0,
        stagger: 0.2,
        duration: 1.05,
        ease: "expo.out"
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

      // 3. SQUARESPACE REFRESH
      // This forces the ScrollTrigger to wait for the page load
      ScrollTrigger.refresh();

    }, sectionRef);

    // Squarespace AJAX/Resize event listener
    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleRefresh);
    window.addEventListener('resize', handleRefresh);

    return () => {
      ctx.revert(); // Kills both timelines and ScrollTriggers safely
      window.removeEventListener('load', handleRefresh);
      window.removeEventListener('resize', handleRefresh);
    };
  }, []);
  return (
    <section className="bc-custom-home-hero" id="scs-hero-root" ref={sectionRef}>
      <div className="bc-hero-overlay"></div>

      <div className="marquee-wrapper">
        <div className="marquee-track" ref={trackRef}>
          <div className='marquee-copy-wrapper'>
            {/* <div className='scs-logo'><img src="//images.squarespace-cdn.com/content/v1/69c2ef358a34ab18fd392d39/c964de03-6a21-4d64-bf32-19619dd19997/Soccer-Capital-Summer---FC-Linear---White.png" alt="Soccer Capital Summer" />
            </div> */}
            <h1 className='bc-hero-title'>
              <span className="text-indigo">Our Game.</span>
              <span className="text-indigo">Our City.</span>
            </h1>
            <div className='supportingText'>
              <span className="text-white ">sporting KC presents</span>
              <span className="text-white">soccer capital summer</span>
              <span className="text-white">kansas city</span>

            </div>
          </div>
          <div className='bc-soccer-ball-animation' >
            <span class="material-symbols-outlined">
              sports_soccer
            </span>
          </div>
          <hr className='bc-hr' />
          <div className='bc-dynamic-soccer'>
            {/* <div></div> */}
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

      <div className="electric-wrap" ref={electricRef}>
        <h2 className="electric">Watch the world’s game <span>at Sporting Park </span></h2>
        <div className='bc-hero-about'>
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
            
          <span className="summer-word ">ALL</span>
          <span className="summer-word">SUMMER</span>
          <span className="summer-word">LONG</span>
          {/* <div className="summer-word">
            <span class="material-symbols-outlined">
              wb_sunny
            </span>
          </div>
          <div className="summer-word"> <span class="material-symbols-outlined">
            sports_soccer
          </span></div>
          <div className="summer-word">
            <span class="material-symbols-outlined">
              waves
            </span>
          </div> */}
                <br/>
                            <div className="summer-word heart-icon">
            <img src='https://media.ffycdn.net/us/sporting-kansas-city/YurkiJoYWumen6sMzfAF.eps?width=2400' />
          </div>
        <span className="summer-word bc-script">Kansas </span>
        <span className="summer-word bc-script">City </span>
          {/* <span className="summer-word text-filled">schedule</span>
          <span className="summer-word text-filled">experiences</span> */}
        </h2>

      </div>

    </section>
  );
}