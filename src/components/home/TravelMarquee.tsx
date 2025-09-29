import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface MarqueeRowProps {
  images: string[];
  direction: 'left' | 'right';
  duration: number;
  className?: string;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ images, direction, duration, className = '' }) => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className={`flex ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="flex gap-6 shrink-0"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedImages.map((image, index) => (
          <motion.div
            key={index}
            className="relative shrink-0"
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-175 h-75 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 backdrop-blur-sm bg-white/5">
              <ImageWithFallback
                src={image}
                alt="Travel destination"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default function TravelMarquee3D() {
  const topRowImages = [
    "https://images.unsplash.com/photo-1631684188521-28b3fd9f40e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHRyYXZlbCUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NTkwODc4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1615472767332-e5615c7e617a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBoaWtpbmd8ZW58MXx8fHwxNzU5MTI4NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1715535384818-8e673eb3a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBub3J0aGVybiUyMGxpZ2h0cyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTkxMzA0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1610044847457-f6aabcbb67d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MTMwNDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ];

  const middleRowImages = [
    "https://images.unsplash.com/photo-1702743599501-a821d0b38b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzU5MDI0MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1701238973883-6c8b01439deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjByZWQlMjByb2NrcyUyMGRlc2VydHxlbnwxfHx8fDE3NTkxMzA0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1715695909786-3f2c91a811ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwcmVmbGVjdGlvbiUyMG1vdW50YWluc3xlbnwxfHx8fDE3NTkwNzQxMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1729939089084-2b08efbc4b12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xjYW5vJTIwbGFuZHNjYXBlJTIwZHJhbWF0aWN8ZW58MXx8fHwxNzU5MTMwNDQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ];

  const bottomRowImages = [
    "https://images.unsplash.com/photo-1758537698226-069b7647ceec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdHJhdmVsJTIwdXJiYW4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU5MDg3ODU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1656555607028-ca3d4dbb7400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjBoaWtpbmclMjB0cmFpbHxlbnwxfHx8fDE3NTkwODc4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1597170754548-803d99b32ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjB0cmF2ZWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDg3ODY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1631684188521-28b3fd9f40e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHRyYXZlbCUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NTkwODc4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30" style={{ perspective: '1200px' }}>
      {/* Top Row - Moving Left */}
      <motion.div
        className="absolute top-[10%] left-0 w-full"
        initial={{ rotateX: 15, rotateY: -10, z: -100 }}
        animate={{ 
          rotateX: [15, 10, 15], 
          rotateY: [-10, -5, -10],
          z: [-100, -80, -100]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <MarqueeRow
          images={topRowImages}
          direction="left"
          duration={25}
        />
      </motion.div>

      {/* Middle Row - Moving Right */}
      <motion.div
        className="absolute top-[45%] left-0 w-full"
        initial={{ rotateX: 0, rotateY: 5, z: -50 }}
        animate={{ 
          rotateX: [0, -5, 0], 
          rotateY: [5, 10, 5],
          z: [-50, -30, -50]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <MarqueeRow
          images={middleRowImages}
          direction="right"
          duration={30}
        />
      </motion.div>

      {/* Bottom Row - Moving Left */}
      <motion.div
        className="absolute top-[75%] left-0 w-full"
        initial={{ rotateX: -15, rotateY: -8, z: -120 }}
        animate={{ 
          rotateX: [-15, -10, -15], 
          rotateY: [-8, -3, -8],
          z: [-120, -90, -120]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <MarqueeRow
          images={bottomRowImages}
          direction="left"
          duration={35}
        />
      </motion.div>

    
    </div>
  );
}