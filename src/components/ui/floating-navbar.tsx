"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
  children,
}: {
  navItems?: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  className?: string;
  children?: React.ReactNode;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const pathname = usePathname();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  // Update active item based on pathname
  useEffect(() => {
    const currentItem = navItems?.find(item => {
      if (item.link === '/' && pathname === '/') return true;
      if (item.link !== '/' && pathname.startsWith(item.link)) return true;
      return false;
    });
    setActiveItem(currentItem?.name || null);
  }, [pathname, navItems]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-orange-500/30 rounded-full bg-gray-900/95 backdrop-blur-md shadow-[0px_2px_20px_rgba(249,115,22,0.3)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {children}
        {navItems?.map((navItem: any, idx: number) => {
          const isActive = activeItem === navItem.name;
          return (
            <motion.div
              key={`link=${idx}`}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.a
                href={navItem.link}
                className={cn(
                  "relative items-center flex space-x-2 px-3 py-2 rounded-full transition-all duration-300",
                  isActive 
                    ? "text-orange-400 bg-orange-500/20 border border-orange-500/40" 
                    : "text-neutral-400 hover:text-orange-300 hover:bg-orange-500/10"
                )}
                whileHover={{ y: -1 }}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="floatingActiveIndicator"
                    className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.a>
              
              {/* Glow effect for active item */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
        
        {/* Floating nav progress indicator */}
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
          style={{ 
            width: `${Math.min(scrollYProgress.get() * 100, 100)}%`,
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};