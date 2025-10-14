import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Plus, X, Calendar, ArrowLeft } from "lucide-react";
import { PlaceSearchModal } from "@/components/group/edit/PlaceSearchModal";
import { toast } from "sonner";

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

interface Itinerary {
  itinerary_id?: number;
  title: string | null;
  description: string | null;
  start_date: Date;
  end_date: Date;
  places: Place[];
}

interface ItineraryEditorProps {
  itinerary: Itinerary | null;
  onSave: (itinerary: Itinerary) => void;
  onCancel: () => void;
}

export function ItineraryEditor({ itinerary, onSave, onCancel }: ItineraryEditorProps) {
  const [formData, setFormData] = useState({
    title: itinerary?.title || "",
    description: itinerary?.description || "",
    start_date: itinerary?.start_date ? formatDateForInput(itinerary.start_date) : "",
    end_date: itinerary?.end_date ? formatDateForInput(itinerary.end_date) : ""
  });

  const [places, setPlaces] = useState<Place[]>(itinerary?.places || []);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleAddPlace = (place: Place) => {
    // Check if place already exists
    if (places.find(p => p.place_id === place.place_id)) {
      toast.error("Place already added to itinerary");
      return;
    }
    setPlaces([...places, place]);
    toast.success(`Added ${place.name} to itinerary`);
  };

  const handleRemovePlace = (placeId: number) => {
    setPlaces(places.filter(p => p.place_id !== placeId));
    toast.success("Place removed from itinerary");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date) {
      toast.error("Please select start and end dates");
      return;
    }

    const itineraryData: Itinerary = {
      itinerary_id: itinerary?.itinerary_id,
      title: formData.title,
      description: formData.description,
      start_date: new Date(formData.start_date),
      end_date: new Date(formData.end_date),
      places: places
    };

    onSave(itineraryData);
  };

  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date) return null;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 1 ? "1 day" : `${diff} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2>{itinerary ? "Edit Itinerary" : "Create New Itinerary"}</h2>
          <p className="text-muted-foreground">
            Plan your journey and add places to visit
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Set the title, dates, and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Beach Trip"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>

            {calculateDuration() && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Duration: {calculateDuration()}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your itinerary..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Map Preview Card */}
        {places.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Map Preview</CardTitle>
              <CardDescription>
                {places.length} {places.length === 1 ? 'location' : 'locations'} selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapPreview places={places} />
            </CardContent>
          </Card>
        )}

        {/* Places Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Places</CardTitle>
              <CardDescription>
                Add destinations and activities to your itinerary
              </CardDescription>
            </div>
            <Button type="button" onClick={() => setIsSearchModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Place
            </Button>
          </CardHeader>
          <CardContent>
            {places.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h4>No places added yet</h4>
                <p className="text-muted-foreground mt-2 mb-4">
                  Start building your itinerary by adding places
                </p>
                <Button type="button" onClick={() => setIsSearchModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Place
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {places.map((place, index) => (
                  <PlaceCard
                    key={place.place_id}
                    place={place}
                    index={index}
                    onRemove={() => handleRemovePlace(place.place_id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center sticky bottom-0 bg-background py-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {itinerary ? "Update Itinerary" : "Create Itinerary"}
          </Button>
        </div>
      </form>

      {/* Place Search Modal */}
      <PlaceSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPlace={handleAddPlace}
      />
    </div>
  );
}

function PlaceCard({ place, index, onRemove }: { place: Place; index: number; onRemove: () => void }) {
  return (
    <div className="relative group flex gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors">
      {/* Place Number Badge */}
      <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 shadow-sm">
        {index + 1}
      </div>

      {/* Place Image */}
      <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-muted">
        {place.picture_url ? (
          <img
            src={place.picture_url}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Place Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="truncate">{place.name}</h4>
            {place.place_type && (
              <Badge variant="secondary" className="mt-1">
                {place.place_type}
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {place.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{place.rating.toFixed(1)}</span>
          </div>
        )}

        {place.description && (
          <p className="text-muted-foreground line-clamp-2 mb-2">
            {place.description}
          </p>
        )}

        {place.address && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{place.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MapPreview({ places }: { places: Place[] }) {
  // Calculate center and bounds
  const avgLat = places.reduce((sum, p) => sum + (p.latitude || 0), 0) / places.length;
  const avgLng = places.reduce((sum, p) => sum + (p.longitude || 0), 0) / places.length;

  return (
    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
      {/* Map Background with Grid Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Place Pins */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full h-full">
          {places.map((place, index) => {
            // Distribute pins in a circular pattern
            const angle = (index / places.length) * 2 * Math.PI;
            const radius = 35; // percentage
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <div
                key={place.place_id}
                className="absolute transform -translate-x-1/2 -translate-y-full"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative group">
                  <MapPin className="h-8 w-8 fill-red-500 text-red-700 drop-shadow-lg animate-bounce" style={{ animationDelay: `${index * 0.1}s`, animationDuration: '2s' }} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-xs">{place.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="bg-background border rounded shadow px-3 py-1.5">
          <p className="text-xs text-muted-foreground">
            {places.length} {places.length === 1 ? 'location' : 'locations'}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
