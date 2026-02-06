import React, { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TextReveal = ({ text, delay = 0, className = "" }) => {
  const textRef = useRef(null);
    
  useGSAP(() => {
    // Select all the word spans we created
    const words = textRef.current.querySelectorAll('.word');

    gsap.fromTo(words,
      { 
        opacity: 0, 
        y: 20,      // Slide up slightly
        scale: 0.9  // Small scale effect
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1, // This creates the "one-by-one" effect
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 70%", // Starts when the text container hits 90% of viewport
          toggleActions: "play ", // Plays on scroll down, reverses on scroll up
        }
      }
    );
  }, { scope: textRef });

  // Split text into words and wrap them
  const wordsArray = text.split(" ");

  return (
    <div ref={textRef} className={`inline-block ${className}`}>
      {wordsArray.map((word, index) => (
        <span 
          key={index} 
          className="word inline-block mr-[0.25em] will-change-transform"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default TextReveal ;