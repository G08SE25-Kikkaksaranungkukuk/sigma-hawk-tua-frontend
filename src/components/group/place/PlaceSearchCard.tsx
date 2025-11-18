import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Place } from "@/lib/types";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface PlaceSearchCardProps {
  place: Place;
  onSelect: () => void;
}

export function PlaceSearchCard({ place, onSelect }: PlaceSearchCardProps) {
  const firstPhoto = place.photos_sample?.[0];
  
  // Debug logging
  if (firstPhoto) {
    console.log('PlaceSearchCard photo URL:', firstPhoto.photo_url_large || firstPhoto.photo_url);
  }
  
  return (
    <button
      onClick={onSelect}
      className="w-full relative overflow-hidden rounded-lg border border-gray-800/70 hover:border-[#ff6600]/50 transition-all text-left group h-62"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-800/50">
        {firstPhoto ? (
          <ImageWithFallback
            src={firstPhoto.photo_url_large || firstPhoto.photo_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-12 w-12 text-orange-300/30" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Top Section - Badge */}
        <div className="flex justify-between items-start gap-2">
          {place.rating > 0 && (
            <Badge 
              variant="secondary" 
              className="bg-[#ff6600]/90 text-white border-none hover:bg-[#ff6600] backdrop-blur-sm flex items-center gap-1"
            >
              <Star className="h-3 w-3 fill-white" />
              {place.rating.toFixed(1)}
            </Badge>
          )}
          {place.opening_status && (
            <Badge 
              variant="secondary" 
              className="bg-green-600/90 text-white border-none hover:bg-green-600 backdrop-blur-sm text-xs"
            >
              {place.opening_status}
            </Badge>
          )}
        </div>

        {/* Bottom Section - Title, Description, Address */}
        <div className="space-y-2">
          <h4 className="text-white font-semibold text-lg leading-tight line-clamp-1">
            {place.name}
          </h4>

          {place.summary && (
            <p className="text-white/90 text-sm line-clamp-2 leading-snug">
              {place.summary}
            </p>
          )}

          {place.full_address && (
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{place.full_address}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
