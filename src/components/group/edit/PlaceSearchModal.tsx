import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Place {
  place_id: number;
  name: string;
  description: string | null;
  place_type: string | null;
  latitude: number | null;
  longitude: number | null;
  picture_url: string | null;
  address: string | null;
  rating: number;
  phone_num?: string | null;
  social_media?: string | null;
}

interface PlaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

// Mock Google Maps Places Data
const MOCK_PLACES: Place[] = [
  {
    place_id: 1,
    name: "Eagle Peak Trailhead",
    description: "Challenging hiking trail with panoramic mountain views and diverse wildlife",
    place_type: "Hiking Trail",
    latitude: 45.5231,
    longitude: -122.6765,
    picture_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    address: "Mountain View Road, Portland, OR 97219",
    rating: 4.5,
    phone_num: null,
    social_media: null
  },
  {
    place_id: 2,
    name: "Riverside Campground",
    description: "Peaceful camping spot by the river with modern facilities and fishing access",
    place_type: "Campground",
    latitude: 45.5201,
    longitude: -122.6801,
    picture_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop",
    address: "Forest Road 42, Mt Hood National Forest, OR",
    rating: 4.2,
    phone_num: "+1 (503) 555-0123",
    social_media: null
  },
  {
    place_id: 3,
    name: "Mountain View Cafe",
    description: "Cozy cafe serving organic coffee and homemade pastries with stunning views",
    place_type: "Cafe",
    latitude: 45.5245,
    longitude: -122.6750,
    picture_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    address: "123 Summit Street, Portland, OR 97201",
    rating: 4.7,
    phone_num: "+1 (503) 555-0456",
    social_media: "@mountainviewcafe"
  },
  {
    place_id: 4,
    name: "Crystal Lake",
    description: "Pristine alpine lake perfect for swimming, kayaking, and photography",
    place_type: "Natural Attraction",
    latitude: 45.5312,
    longitude: -122.6823,
    picture_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    address: "Crystal Lake Trail, Mt Hood Wilderness, OR",
    rating: 4.8,
    phone_num: null,
    social_media: null
  },
  {
    place_id: 5,
    name: "Alpine Visitor Center",
    description: "Information center with exhibits on local flora, fauna, and geology",
    place_type: "Visitor Center",
    latitude: 45.5189,
    longitude: -122.6734,
    picture_url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop",
    address: "Highway 26, Government Camp, OR 97028",
    rating: 4.3,
    phone_num: "+1 (503) 555-0789",
    social_media: null
  },
  {
    place_id: 6,
    name: "Sunset Viewpoint",
    description: "Popular lookout point offering breathtaking sunset views over the valley",
    place_type: "Viewpoint",
    latitude: 45.5278,
    longitude: -122.6789,
    picture_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    address: "Skyline Drive, Portland, OR 97210",
    rating: 4.9,
    phone_num: null,
    social_media: null
  },
  {
    place_id: 7,
    name: "Adventure Outfitters",
    description: "Full-service outdoor gear shop with equipment rentals and guided tours",
    place_type: "Outdoor Store",
    latitude: 45.5223,
    longitude: -122.6712,
    picture_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    address: "456 Pine Street, Portland, OR 97204",
    rating: 4.4,
    phone_num: "+1 (503) 555-0321",
    social_media: "@adventureoutfitters"
  },
  {
    place_id: 8,
    name: "Forest Picnic Area",
    description: "Shaded picnic area with tables, grills, and access to nature trails",
    place_type: "Park",
    latitude: 45.5267,
    longitude: -122.6756,
    picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    address: "National Forest Road 18, OR",
    rating: 4.1,
    phone_num: null,
    social_media: null
  }
];

export function PlaceSearchModal({ isOpen, onClose, onSelectPlace }: PlaceSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Place[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      // Show all places when search is empty
      setResults(MOCK_PLACES);
      return;
    }

    // Simulate API search delay
    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = MOCK_PLACES.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.place_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPlace = (place: Place) => {
    onSelectPlace(place);
    onClose();
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Search Places</DialogTitle>
          <DialogDescription>
            Search and select places to add to your itinerary
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for places, attractions, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[50vh] px-6 pb-6">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4>No places found</h4>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((place) => (
                <PlaceSearchResult
                  key={place.place_id}
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

function PlaceSearchResult({ place, onSelect }: { place: Place; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex gap-4 p-3 border rounded-lg hover:border-primary hover:bg-accent/50 transition-all text-left group"
    >
      {/* Place Image */}
      <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0 bg-muted">
        {place.picture_url ? (
          <img
            src={place.picture_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Place Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="truncate">{place.name}</h4>
          {place.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {place.place_type && (
          <Badge variant="secondary" className="mb-2">
            {place.place_type}
          </Badge>
        )}

        {place.description && (
          <p className="text-muted-foreground line-clamp-2 mb-2">
            {place.description}
          </p>
        )}

        {place.address && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{place.address}</span>
          </div>
        )}
      </div>
    </button>
  );
}
