import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experiences.css';

gsap.registerPlugin(ScrollTrigger);

const Experiences = () => {
  const main = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      const listItems = gsap.utils.toArray("li");
      const slides = gsap.utils.toArray(".slide");
      const fill = document.querySelector(".fill");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".pin-section",
          start: "top top",
          end: "+=" + listItems.length * 100 + "%",
          pin: true,
          scrub: true,
        }
      });

      // Initial state for the progress bar
      if (fill) {
        gsap.set(fill, {
          scaleY: 1 / listItems.length,
          transformOrigin: "top left"
        });
      }

      listItems.forEach((item, i) => {
        const previousItem = listItems[i - 1];
        if (previousItem) {
          // Animate text color and slide visibility
          tl.set(item, { color: "#79E1FF" }, 0.5 * i) // Sporting Cyan
            .to(slides[i], { autoAlpha: 1, duration: 0.2 }, "<")
            .set(previousItem, { color: "#ffffff" }, "<")
            .to(slides[i - 1], { autoAlpha: 0, duration: 0.2 }, "<");
        } else {
          // First item state
          gsap.set(item, { color: "#d5ff79" });
          gsap.set(slides[i], { autoAlpha: 1 });
        }
      });

      // Progress bar fill animation
      tl.to(fill, {
        scaleY: 1,
        transformOrigin: "top left",
        ease: "none",
        duration: tl.duration()
      }, 0).to({}, {}); 

    }, main); // Scope to this component

    return () => ctx.revert();
  }, []);

  return (
    <div ref={main}>
      <section className="section pin-section">
        <div className="content-wrapper">
          {/* Left Side: Navigation List */}
          <div className="left-side">
            <ul className="list">
              <li>Experience 1</li>
              <li>Experience 2</li>
              <li>Experience 3</li>
              <li>Experience 4</li>
            </ul>
            <div className="fill"></div>
          </div>


<div className="right-side">
  <div className="slide center">
   <div className='slide-image'>
    <img src='https://placebear.com/1080/1080'/>
   </div>
  </div>
  <div className="slide center">
      <div className='slide-image'>
    <img src='https://placebear.com/300/300'/>
   </div>
     {/* <h2 className="slide-text">CULTURE</h2> */}
   
  </div>
  <div className="slide center">
      <div className='slide-image'>
    <img src='https://placebear.com/800/900'/>
   </div>
     {/* <h2 className="slide-text">MATCH DAY</h2> */}
    
  </div>
  <div className="slide center">
      <div className='slide-image'>
    <img src='https://placebear.com/1000/900'/>
   </div>
     {/* <h2 className="slide-text">JOIN US</h2>
     */}
  </div>
</div>
        </div>
      </section>
    </div>
  );
};

export default Experiences;