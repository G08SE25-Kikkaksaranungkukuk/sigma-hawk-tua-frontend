import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import TravelMarquee3D from '@/components/home/TravelMarquee';
import { ArrowRight, BookOpen, Compass } from 'lucide-react';

const TypewriterText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100 + delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex <= text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-15 bg-white ml-1"
        />
      )}
    </span>
  );
};

export default function HeroSection() {
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <TravelMarquee3D />
      {/* Main Content */}
      <div className="absolute z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
            <Compass className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-500">Explore the World</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4">
            <TypewriterText 
              text="THAM ROI" 
              delay={500} 
              className="bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent"
            />
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Travel Adventures
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          Journey through breathtaking destinations, hidden gems, and unforgettable experiences. Let our travel stories inspire your next adventure and guide you to the world's most incredible places.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="group px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="lg" className="px-8 py-6 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-all duration-300">
              View Gallery
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}