import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Pencil, Trash2, Link2 } from "lucide-react";
import { format } from "date-fns";
import { Itinerary } from "@/lib/types";

interface ItineraryCardProps {
  itinerary: Itinerary;
  onEdit: () => void;
  onDelete: () => void;
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

  return (
    <div className="border border-gray-800/70 bg-[#1a1b23]/50 rounded-xl p-4 hover:border-[#ff6600]/50 transition-colors">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-orange-300 mb-1">{itinerary.title || "Untitled Itinerary"}</h3>
          <p className="text-orange-200/70">
            {itinerary.description}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-orange-300 hover:text-white hover:bg-[#ff6600]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-orange-300 hover:text-white hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
          <span>{itinerary.place_links.length} {itinerary.place_links.length === 1 ? 'place' : 'places'}</span>
        </div>
      </div>

      {/* Places links */}
      {itinerary.place_links.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-300/80">
            <Link2 className="w-4 h-4" />
            <span className="text-sm font-medium">Places to visit</span>
          </div>

          <div className="space-y-2">
            {itinerary.place_links.slice(0, 3).map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg bg-[#0b0b0c]/50 border border-gray-700/50 hover:border-orange-400/50 transition-colors text-orange-200/90 hover:text-orange-400 text-sm truncate"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{index + 1}.</span>
                  <span className="truncate">{link}</span>
                </div>
              </a>
            ))}

            {itinerary.place_links.length > 3 && (
              <div className="px-3 py-2 rounded-lg border border-dashed border-gray-700 bg-[#0b0b0c]/30 text-center">
                <span className="text-xs text-orange-200/60 font-medium">
                  +{itinerary.place_links.length - 3} more {itinerary.place_links.length - 3 === 1 ? 'place' : 'places'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
