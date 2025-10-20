import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
}

const featuredCards: FeatureCard[] = [
  {
    id: 1,
    title: "Hidden Gems of Southeast Asia",
    description: "Discover breathtaking destinations off the beaten path, from secret beaches to mountain villages that few travelers know about.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1080&q=80",
    category: "Adventure",
    featured: true
  },
  {
    id: 2,
    title: "European Train Adventures",
    description: "Experience the romance of rail travel across Europe's most scenic routes, connecting historic cities and stunning landscapes.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1080&q=80",
    category: "Europe",
    featured: true
  },
  {
    id: 3,
    title: "Street Food Around the World",
    description: "A culinary journey through bustling markets and food stalls, tasting authentic flavors from Bangkok to Mexico City.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080&q=80",
    category: "Food & Culture"
  },
  {
    id: 4,
    title: "Solo Travel Guide 2025",
    description: "Essential tips and inspiring stories for those brave enough to explore the world on their own terms.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1080&q=80",
    category: "Solo Travel"
  },
  {
    id: 5,
    title: "Island Paradise Escapes",
    description: "From tropical hideaways to remote archipelagos, explore the world's most stunning island destinations.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1080&q=80",
    category: "Beach & Islands"
  }
];

export function AppleCardsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= featuredCards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? featuredCards.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold text-orange-500">Featured Travel Stories</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Embark on extraordinary journeys through our handpicked collection of travel adventures, destination guides, and wanderlust-inspiring stories.
          </p>
        </div>

        <div 
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={containerRef}
        >
          {/* Cards Container */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredCards.map((card, index) => (
              <div key={card.id} className="w-full flex-shrink-0 relative">
                <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-black rounded-3xl">
                  {/* Background Image */}
                  <ImageWithFallback
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="max-w-2xl">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/20">
                          {card.category}
                        </span>
                        {card.featured && (
                          <span className="ml-2 inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      
                      <h3 className="mb-4 text-3xl md:text-4xl text-orange-400">
                        {card.title}
                      </h3>
                      
                      <p className="mb-6 text-lg text-gray-200 leading-relaxed">
                        {card.description}
                      </p>
                      
                      <button className="group bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center gap-2">
                        Explore Journey
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {featuredCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                ? 'bg-orange-500 w-8' 
                : 'bg-gray-500 hover:bg-orange-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}