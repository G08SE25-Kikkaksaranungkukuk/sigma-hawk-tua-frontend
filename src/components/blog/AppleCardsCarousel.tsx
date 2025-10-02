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
    title: "Master React & TypeScript",
    description: "Build production-ready applications with the latest React patterns and TypeScript best practices.",
    image: "https://images.unsplash.com/photo-1558301204-e3226482a77b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvdXJzZXxlbnwxfHx8fDE3NTkwMTAzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Course",
    featured: true
  },
  {
    id: 2,
    title: "Tech Innovation Summit 2025",
    description: "Join industry leaders and innovators as they share insights on the future of technology.",
    image: "https://images.unsplash.com/photo-1560439514-0fc9d2cd5e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZXZlbnQlMjBzcGVha2Vyc3xlbnwxfHx8fDE3NTkwNzU0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Event",
    featured: true
  },
  {
    id: 3,
    title: "Design Systems Masterclass",
    description: "Create scalable design systems that improve consistency and developer productivity.",
    image: "https://images.unsplash.com/photo-1742440711276-679934f5b988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGRlc2lnbnxlbnwxfHx8fDE3NTkwMTA4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Workshop"
  },
  {
    id: 4,
    title: "AI & Machine Learning Bootcamp",
    description: "Dive deep into artificial intelligence and machine learning with hands-on projects.",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NTkwNzU0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bootcamp"
  },
  {
    id: 5,
    title: "Remote Team Leadership",
    description: "Learn effective strategies for leading and managing distributed development teams.",
    image: "https://images.unsplash.com/photo-1588912914074-b93851ff14b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMHBsYXRmb3JtfGVufDF8fHx8MTc1OTAyNDgwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Leadership"
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
          <h2 className="mb-4 text-4xl font-bold text-orange-500">Featured Content</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of courses, events, and resources designed to accelerate your tech journey.
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
                        Learn More
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