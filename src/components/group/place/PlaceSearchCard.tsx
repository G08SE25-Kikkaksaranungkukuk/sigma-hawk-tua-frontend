import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Place } from "@/lib/types";

interface PlaceSearchCardProps {
  place: Place;
  onSelect: () => void;
}

export function PlaceSearchCard({ place, onSelect }: PlaceSearchCardProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full relative overflow-hidden rounded-lg border border-gray-800/70 hover:border-[#ff6600]/50 transition-all text-left group h-48"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-800/50">
        {place.picture_url ? (
          <img
            src={place.picture_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
        <div className="flex justify-end">
          {place.place_type && (
            <Badge 
              variant="secondary" 
              className="bg-[#ff6600]/90 text-white border-none hover:bg-[#ff6600] backdrop-blur-sm"
            >
              {place.place_type}
            </Badge>
          )}
        </div>

        {/* Bottom Section - Title, Description, Address */}
        <div className="space-y-2">
          <h4 className="text-white font-semibold text-lg leading-tight line-clamp-1">
            {place.name}
          </h4>

          {place.description && (
            <p className="text-white/90 text-sm line-clamp-2 leading-snug">
              {place.description}
            </p>
          )}

          {place.address && (
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{place.address}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
