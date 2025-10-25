import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Place } from "@/lib/types";
import { PlaceSearchCard } from "./PlaceSearchCard";
import { placeService } from "@/lib/services/place/placeService";

interface PlaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

export function PlaceSearchModal({ isOpen, onClose, onSelectPlace }: PlaceSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const searchPlaces = async () => {
      setIsSearching(true);
      setError(null);
      
      try {
        const places = await placeService.searchPlaces(searchQuery);
        console.log("Search results:", places);
        setResults(places);
      } catch (err) {
        console.error("Failed to search places:", err);
        setError(err instanceof Error ? err.message : "Failed to search places");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      searchPlaces();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPlace = (place: Place) => {
    onSelectPlace(place);
    onClose();
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] p-0 bg-[#1a1b23] border-gray-800">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-orange-300">Search Places</DialogTitle>
          <DialogDescription className="text-orange-200/70">
            Search and select places to add to your itinerary
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-300/60" />
            <Input
              placeholder="Search for places, attractions, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0b0b0c]/50 border-gray-800 text-orange-200 placeholder:text-orange-200/40 focus:border-[#ff6600] focus:ring-[#ff6600]/20"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-orange-300/60" />
            )}
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[50vh] px-6 pb-6">
          {error ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h4 className="text-orange-300">Error</h4>
              <p className="text-orange-200/60 mt-2 text-sm">
                {error}
              </p>
            </div>
          ) : results.length === 0 && searchQuery.trim() ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
              <h4 className="text-orange-300">No places found</h4>
              <p className="text-orange-200/60 mt-2">
                Try adjusting your search terms
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
              <h4 className="text-orange-300">Search for places</h4>
              <p className="text-orange-200/60 mt-2">
                Enter a location, attraction, or restaurant name
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((place, index) => (
                <PlaceSearchCard
                  key={`${place.name}-${index}`}
                  place={place}
                  onSelect={() => handleSelectPlace(place)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
