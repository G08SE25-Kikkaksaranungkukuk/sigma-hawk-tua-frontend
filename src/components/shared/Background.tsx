import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating gradient orbs - more visible version */}
      
      {/* Left side - top */}
      <motion.div
        className="absolute top-1/4 left-8 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-500/30 to-purple-500/20 rounded-full blur-[100px]"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Left side - bottom */}
      <motion.div
        className="absolute bottom-1/4 left-12 w-[28rem] h-[28rem] bg-gradient-to-tr from-orange-400/35 to-pink-500/25 rounded-full blur-[80px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Center - very large */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-gradient-to-r from-cyan-400/25 to-blue-600/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Center overlay for more depth */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-gradient-to-bl from-purple-400/30 to-orange-400/25 rounded-full blur-[60px]"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [360, 0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Right side - top */}
      <motion.div
        className="absolute top-1/3 right-8 w-[30rem] h-[30rem] bg-gradient-to-bl from-emerald-400/30 to-cyan-500/25 rounded-full blur-[90px]"
        animate={{
          x: [0, -70, 0],
          y: [0, 45, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      {/* Right side - bottom */}
      <motion.div
        className="absolute bottom-1/3 right-16 w-[26rem] h-[26rem] bg-gradient-to-tl from-rose-400/35 to-violet-500/30 rounded-full blur-[70px]"
        animate={{
          x: [0, -55, 0],
          y: [0, -25, 0],
          scale: [1, 1.25, 1],
          rotate: [0, -360, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Additional small accent elements */}
      <motion.div
        className="absolute top-20 right-1/4 w-[16rem] h-[16rem] bg-gradient-to-r from-yellow-400/25 to-orange-500/20 rounded-full blur-[50px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-1/3 w-[20rem] h-[20rem] bg-gradient-to-bl from-indigo-400/25 to-purple-600/20 rounded-full blur-[60px]"
        animate={{
          x: [0, -25, 0],
          y: [0, 15, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }}
      />
    </div>
  );
}