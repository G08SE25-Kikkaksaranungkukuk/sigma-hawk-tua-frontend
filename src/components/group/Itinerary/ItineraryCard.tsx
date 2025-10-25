import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Pencil, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { Itinerary } from "@/lib/types";
import { PlacePreviewCard } from "@/components/group/place/PlacePreviewCard";

interface ItineraryCardProps {
  itinerary: Itinerary;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ItineraryCard({ itinerary, onEdit, onDelete }: ItineraryCardProps) {
  const calculateDuration = (start: Date | string, end: Date | string) => {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 1 ? "1 day" : `${diff} days`;
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "MMM d, yyyy");
  };

  // Safely handle places array (can be undefined in old data)
  const places = itinerary.places || [];

  return (
    <div className="border border-orange-500/20 bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 hover:border-[#ff6600]/50 transition-colors">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-orange-300 mb-1">{itinerary.title || "Untitled Itinerary"}</h3>
          <p className="text-orange-200/70">
            {itinerary.description}
          </p>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="text-orange-300 hover:text-white hover:bg-[#ff6600]"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-orange-300 hover:text-white hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Itinerary metadata */}
      <div className="flex flex-wrap gap-4 mb-3">
        <div className="flex items-center gap-2 text-orange-200/70">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-orange-200/70">
          <Clock className="h-4 w-4" />
          <span>{calculateDuration(itinerary.start_date, itinerary.end_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-orange-200/70">
          <MapPin className="h-4 w-4" />
          <span>{places.length} {places.length === 1 ? 'place' : 'places'}</span>
        </div>
      </div>

      {/* Places preview */}
      {places.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-300/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Places to visit</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {places.slice(0, 4).map((place, index) => (
              <div key={index} className="relative">
                <PlacePreviewCard place={place} />
                <div className="absolute bottom-2 left-2 bg-[#ff6600]/90 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {places.length > 4 && (
            <div className="px-3 py-2 rounded-lg border border-dashed border-gray-700 bg-[#0b0b0c]/30 text-center">
              <span className="text-xs text-orange-200/60 font-medium">
                +{places.length - 4} more {places.length - 4 === 1 ? 'place' : 'places'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
