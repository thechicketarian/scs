// import { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import './Hero.css';

// gsap.registerPlugin(ScrollTrigger);

// export default function Hero() {
//   const sectionRef = useRef(null);
//   const trackRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const track = trackRef.current;

//       // Calculate how far the text needs to move
//       // We move the width of the track minus the width of the screen
//       const getScrollAmount = () => {
//         let trackWidth = track.offsetWidth;
//         return -(trackWidth - window.innerWidth);
//       };

//       gsap.to(track, {
//         x: getScrollAmount, // Dynamic calculation
//         ease: "none",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top top",
//           // Change '200%' to '300%' or '400%' to make the scroll even SLOWER
//           end: () => `+=${track.offsetWidth}`, 
//           scrub: 1, 
//           pin: true,
//           invalidateOnRefresh: true, // Recalculates if window is resized
//         }
//       });

//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section className="bc-custom-home-hero" id="scs-hero-root" ref={sectionRef}>
//       <div className="bc-hero-overlay"></div>

//       <div className="bc-hero-content">
//         <h2>This is how Kansas City does soccer</h2>
//       </div>

//       <div className="marquee-wrapper">
//         <div className="marquee-track" ref={trackRef}>
//          <h1>
//   <span className="text-red">  Our Game.<br/> Our City.</span> &nbsp; 
//   <span>Big games. <span className="electric">Electric</span> crowds. &nbsp; </span>
// </h1>
//         </div>
//       </div>
//         <h2 className="text-outline">All Summer Long.</h2>
//     </section>
//   );
// }
