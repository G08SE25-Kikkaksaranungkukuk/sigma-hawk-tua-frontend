import { MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Place } from "@/lib/types";
import { fi } from "date-fns/locale";

interface PlaceCardProps {
  place: Place;
}

export function PlacePreviewCard({ place }: PlaceCardProps) {
  const firstPhoto = place.photos_sample?.[0];
  
  return (
    <div className="group/place relative overflow-hidden rounded-lg border border-gray-800/70 hover:border-[#ff6600]/50 transition-all duration-200 aspect-square">
      {/* Background Image */}
      {firstPhoto ? (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={firstPhoto.photo_url_large || firstPhoto.photo_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover/place:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-orange-300/30" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-2">
        <p className="text-xs text-white font-medium line-clamp-2 leading-tight mb-1">
          {place.name}
        </p>
        {place.full_address && (
          <div className="flex items-start gap-1">
            <MapPin className="w-3 h-3 text-white/80 shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/80 line-clamp-1 leading-tight">
              {place.full_address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
