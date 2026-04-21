// ... keep your imports ...
import Schedule from './Schedule';
import Experiences from './Experiences';

export default function Home() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const electricRef = useRef(null);
  const summerRef = useRef(null);
  const scheduleRef = useRef(null); // New Ref

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=800%", // Increased to account for more sections
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });

      // ACT 1: Horizontal Slide (Our Game/City)
      tl.to(trackRef.current, { x: () => -(trackRef.current.offsetWidth * 0.8), duration: 1.5 })
        .to(trackRef.current, { y: "-120vh", duration: 1 });

      // ACT 2: Pull Up (About Copy)
      tl.fromTo(electricRef.current, { y: "120vh" }, { y: "0%", duration: 1 })
        .to(electricRef.current, { y: "-120vh", duration: 1 });

      // ACT 3: The Split (All Summer Long)
      tl.from(".summer-word", { y: 150, opacity: 0, stagger: 0.1, duration: 1 });

      // --- NEW ACT 4: THE SCHEDULE CAROUSEL ---
      // We slide the schedule in from the bottom or right
      tl.fromTo(scheduleRef.current, 
        { y: "100vh", opacity: 0 }, 
        { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }
      );
      
      // Optional: Pause here for a moment so they can actually see the matches
      tl.to({}, { duration: 1 }); 

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bc-custom-home-root" ref={sectionRef}>
      {/* Existing Hero Elements */}
      <div className="marquee-wrapper" ref={trackRef}> ... </div>
      <div className="electric-wrap" ref={electricRef}> ... </div>
      <div className="summer-wrap" ref={summerRef}> ... </div>

      {/* NEW: Integrated Schedule Section */}
      <div className="home-schedule-integration" ref={scheduleRef}>
         <h2 className="section-title">Upcoming Matches</h2>
         <Schedule layout="carousel" />
      </div>
      
      {/* NEW: Integrated Experiences Section */}
      {/* You can add another Act to the timeline for this! */}
    </section>
  );
}