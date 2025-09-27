import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating gradient orbs */}
      {/* Left side - top */}
      <motion.div
        className="absolute top-1/4 left-8 w-[32rem] h-[32rem] bg-gradient-to-r from-primary/20 to-orange-400/20 rounded-full blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Left side - bottom */}
      <motion.div
        className="absolute bottom-1/4 left-12 w-[28rem] h-[28rem] bg-gradient-to-r from-orange-400/25 to-primary/25 rounded-full blur-[80px]"
        animate={{
          x: [0, 40, 0],
          y: [0, 25, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Center - very large */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-primary/15 to-orange-400/15 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Right side - top */}
      <motion.div
        className="absolute top-1/3 right-8 w-[30rem] h-[30rem] bg-gradient-to-r from-orange-400/20 to-primary/20 rounded-full blur-[100px]"
        animate={{
          x: [0, -60, 0],
          y: [0, 35, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Right side - bottom */}
      <motion.div
        className="absolute bottom-1/3 right-16 w-[26rem] h-[26rem] bg-gradient-to-r from-primary/30 to-orange-400/30 rounded-full blur-[80px]"
        animate={{
          x: [0, -45, 0],
          y: [0, -20, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}