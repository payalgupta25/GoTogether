import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

export const UseScrollReveal = (ref, delay = 0) => {
  useGSAP(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale: 0.8, // Start small
        y: 30,      // Optional: slight slide up
      },
      {
        opacity: 1,
        scale: 1,   // End at normal size
        y: 0,
        duration: 1.2,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%", // Animation starts when element is 85% down the screen
          toggleActions: "play ", // Plays on scroll down, reverses on scroll up
        },
      }
    );
  }, { scope: ref });
};

