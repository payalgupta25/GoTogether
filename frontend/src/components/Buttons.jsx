import React from 'react'
import { motion } from 'framer-motion'

const Buttons = ({ text, className, type, onClick }) => {

  const letters = text.split("");

  const containerVariants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.05, 
        delayChildren: 0.0    
      },
    },
  };

  // 2. Letters Jump & Glow instead of spinning
  const letterVariants = {
    initial: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
    },
    hover: {
      y: -2,               // Move up slightly
      scale: 1.1,          // Grow bigger
      opacity: 1,
      filter: "blur(0.5px)", // Tiny blur for motion feel
      textShadow: "0px 0px 6px rgb(255,255,255)", // White Glow effect
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 300,    // Snappy spring
      },
    },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      variants={containerVariants}
      // Added 'shadow-lg' and 'border' to make it pop against the background
      className={`relative group overflow-hidden rounded-md bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] p-[1px] text-white shadow-md transition-all duration-100 mt-3 hover:shadow-cyan-500/50 ${className}`}
    >
      {/* A. The Background Shine (Shoots across) */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      
      {/* B. The Content Wrapper */}
      <span className="relative flex items-center justify-center px-6 py-2 rounded-lg bg-transparent z-10 font-bold tracking-wider">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
          >
            {/* Fix for space character disappearing */}
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>

      {/* Tailwind Custom Animation for the Shine (Add this to index.css if needed, or use the framer motion div above) */}
    </motion.button>
  );
}

export default Buttons