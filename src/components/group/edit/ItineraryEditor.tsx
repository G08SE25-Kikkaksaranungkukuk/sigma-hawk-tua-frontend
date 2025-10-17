import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Plus, X, Calendar, ArrowLeft, Link2 } from "lucide-react";
import { Itinerary, ItineraryRequest } from '@/lib/types'
import { groupService } from "@/lib/services/group/group-service";
import { toast } from "sonner";

interface ItineraryEditorProps {
  groupId: number;
  itinerary?: Itinerary;
  onSave: () => void;
  onCancel: () => void;
}

export function ItineraryEditor({ groupId, itinerary, onSave, onCancel }: ItineraryEditorProps) {
  const [formData, setFormData] = useState({
    title: itinerary?.title || "",
    description: itinerary?.description || "",
    start_date: itinerary?.start_date ? formatDateForInput(itinerary.start_date) : "",
    end_date: itinerary?.end_date ? formatDateForInput(itinerary.end_date) : ""
  });

  const [places, setPlaces] = useState<string[]>(itinerary?.place_links || []);
  const [newPlaceLink, setNewPlaceLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateItinerary = async (itineraryData: ItineraryRequest) => {
    try {
      const response = await groupService.createItinerary(itineraryData);
      await groupService.assignItineraryToGroup(groupId.toString(), response.itinerary_id);
      toast.success("Itinerary created successfully");
      onSave(); // Trigger refetch
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast.error("Failed to create itinerary");
      throw error;
    }
  }

  const updateItinerary = async (itineraryData: Itinerary) => {
    try {
      await groupService.updateItinerary(groupId.toString(), itineraryData);
      toast.success("Itinerary updated successfully");
      onSave(); // Trigger refetch
    } catch (error) {
      console.error("Error updating itinerary:", error);
      toast.error("Failed to update itinerary");
      throw error;
    }
  }

  const handleAddPlace = () => {
    const trimmedLink = newPlaceLink.trim();
    
    if (!trimmedLink) {
      toast.error("Please enter a Google Maps link");
      return;
    }

    // Check if link already exists
    if (places.includes(trimmedLink)) {
      toast.error("This place link is already added");
      return;
    }

    setPlaces([...places, trimmedLink]);
    setNewPlaceLink("");
    toast.success("Place link added to itinerary");
  };

  const handleRemovePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
    toast.success("Place removed from itinerary");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date) {
      toast.error("Please select start and end dates");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const itineraryData: ItineraryRequest = {
        title: formData.title,
        description: formData.description,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        place_links: places
      };

      if (itinerary?.itinerary_id) {
        // For update, we need to include all Itinerary fields
        const updateData: Itinerary = {
          itinerary_id: itinerary.itinerary_id,
          title: formData.title,
          description: formData.description,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          place_links: places,
          created_at: itinerary.created_at
        };
        await updateItinerary(updateData);
      } else {
        await handleCreateItinerary(itineraryData);
      }
    } catch (error) {
      // Error handling is done in the individual functions
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-orange-400">
            {itinerary ? "Edit Itinerary" : "Create New Itinerary"}
          </h2>
          <p className="text-orange-200/70">
            Plan your journey and add places to visit
          </p>
        </div>
      </div>

      <form id="itinerary-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70">
          <CardHeader>
            <CardTitle className="text-orange-400">Basic Information</CardTitle>
            <CardDescription className="text-orange-200/60">Set the title, dates, and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-orange-200/90">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Beach Trip"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-[#0b0b0c]/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-400/50 focus:ring-orange-400/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-orange-200/90">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  className="bg-[#0b0b0c]/50 border-gray-700/50 text-white focus:border-orange-400/50 focus:ring-orange-400/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-orange-200/90">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                  className="bg-[#0b0b0c]/50 border-gray-700/50 text-white focus:border-orange-400/50 focus:ring-orange-400/30"
                />
              </div>
            </div>

            {calculateDuration() && (
              <div className="flex items-center gap-2 text-orange-200/70">
                <Calendar className="h-4 w-4 text-orange-400" />
                <span>Duration: {calculateDuration()}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="text-orange-200/90">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your itinerary..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-[#0b0b0c]/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-400/50 focus:ring-orange-400/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Map Preview Card */}
        {places.length > 0 && (
          <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70">
            <CardHeader>
              <CardTitle className="text-orange-400">Map Preview</CardTitle>
              <CardDescription className="text-orange-200/60">
                {places.length} {places.length === 1 ? 'location' : 'locations'} selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapPreview places={places} />
            </CardContent>
          </Card>
        )}

        {/* Places Card */}
        <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70">
          <CardHeader>
            <div>
              <CardTitle className="text-orange-400">Places</CardTitle>
              <CardDescription className="text-orange-200/60">
                Add Google Maps links for places to visit (placeholder for Google API fetch)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Place Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Paste Google Maps link here..."
                  value={newPlaceLink}
                  onChange={(e) => setNewPlaceLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPlace();
                    }
                  }}
                  className="bg-[#0b0b0c]/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-400/50 focus:ring-orange-400/30"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddPlace}
                className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#ff7722] hover:to-[#ff9944] text-white shadow-lg shadow-[#ff6600]/30 hover:shadow-[#ff6600]/50 transition-all"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            {/* Places List */}
            {places.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-700/50 rounded-lg bg-[#0b0b0c]/30">
                <Link2 className="mx-auto h-12 w-12 text-orange-400/50 mb-4" />
                <h4 className="text-orange-200/90 text-lg font-semibold">No places added yet</h4>
                <p className="text-orange-200/60 mt-2">
                  Start building your itinerary by adding Google Maps links
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place, index) => (
                  <PlaceCard
                    key={index}
                    place={place}
                    index={index}
                    onRemove={() => handleRemovePlace(index)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-700/50 text-orange-200/90 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-400/50 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#ff7722] hover:to-[#ff9944] text-white shadow-lg shadow-[#ff6600]/30 hover:shadow-[#ff6600]/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : itinerary ? "Update Itinerary" : "Create Itinerary"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function PlaceCard({ place, index, onRemove }: { place: string; index: number; onRemove: () => void }) {
  return (
    <div className="relative group flex items-center gap-3 p-3 border border-gray-700/50 rounded-lg hover:border-orange-400/50 transition-colors bg-[#0b0b0c]/30">
      {/* Place Number Badge */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-white font-semibold shrink-0 shadow-lg shadow-[#ff6600]/30">
        {index + 1}
      </div>

      {/* Link Icon */}
      <Link2 className="h-5 w-5 text-orange-400 shrink-0" />

      {/* Place Link */}
      <div className="flex-1 min-w-0">
        <a 
          href={place}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-200/90 hover:text-orange-400 truncate block transition-colors"
        >
          {place}
        </a>
        <p className="text-xs text-orange-200/50 mt-0.5">
          Google Maps Link (placeholder for API fetch)
        </p>
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-400"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function MapPreview({ places }: { places: string[] }) {
  return (
    <div className="relative w-full h-64 bg-[#0b0b0c]/50 rounded-lg overflow-hidden border border-gray-800/50">
      {/* Map Background with Grid Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 to-orange-900/10">
        <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
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
              /* eslint-disable-next-line react/forbid-dom-props */
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-full pin-wrapper"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative group">
                  {/* eslint-disable-next-line react/forbid-dom-props */}
                  <MapPin className="h-8 w-8 fill-[#ff6600] text-[#ff8533] drop-shadow-lg animate-bounce pin-animation" style={{ animationDelay: `${index * 0.1}s`, animationDuration: '2s' }} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#12131a]/95 backdrop-blur-sm border border-orange-400/30 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-xs text-orange-200/90">Place {index + 1}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="bg-[#12131a]/90 backdrop-blur-sm border border-gray-800/70 rounded shadow-lg px-3 py-1.5">
          <p className="text-xs text-orange-200/70">
            {places.length} {places.length === 1 ? 'location' : 'locations'}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
