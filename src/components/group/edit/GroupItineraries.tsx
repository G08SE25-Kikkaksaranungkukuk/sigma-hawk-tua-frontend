import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Clock, Pencil, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ItineraryEditor } from "./ItineraryEditor";

interface Itinerary {
  itinerary_id?: number;
  title: string | null;
  description: string | null;
  start_date: Date;
  end_date: Date;
  places: Place[];
}

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
}

export function GroupItineraries({ groupId }: { groupId: number }) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    {
      itinerary_id: 1,
      title: "Mountain Hiking Adventure",
      description: "A 3-day hiking trip through scenic mountain trails",
      start_date: new Date("2024-11-01"),
      end_date: new Date("2024-11-03"),
      places: [
        {
          place_id: 1,
          name: "Eagle Peak Trailhead",
          description: "Challenging hiking trail with panoramic mountain views and diverse wildlife",
          place_type: "Hiking Trail",
          latitude: 45.5231,
          longitude: -122.6765,
          picture_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
          address: "Mountain View Road, Portland, OR 97219",
          rating: 4.5
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
          rating: 4.2
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
          rating: 4.8
        }
      ]
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);

  const handleCreateItinerary = () => {
    setEditingItinerary(null);
    setIsEditing(true);
  };

  const handleEditItinerary = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary);
    setIsEditing(true);
  };

  const handleSaveItinerary = (itinerary: Itinerary) => {
    if (itinerary.itinerary_id) {
      // Update existing
      setItineraries(itineraries.map(i =>
        i.itinerary_id === itinerary.itinerary_id ? itinerary : i
      ));
      toast.success("Itinerary updated successfully");
    } else {
      // Create new
      const newItinerary = {
        ...itinerary,
        itinerary_id: Math.max(...itineraries.map(i => i.itinerary_id || 0), 0) + 1
      };
      setItineraries([...itineraries, newItinerary]);
      toast.success("Itinerary created successfully");
    }
    setIsEditing(false);
  };

  const handleDeleteItinerary = (id: number) => {
    setItineraries(itineraries.filter(i => i.itinerary_id !== id));
    toast.success("Itinerary deleted successfully");
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 1 ? "1 day" : `${diff} days`;
  };

  // Show editor when creating or editing
  if (isEditing) {
    return (
      <ItineraryEditor
        itinerary={editingItinerary}
        onSave={handleSaveItinerary}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Show list view
  return (
    <div className="space-y-6">
      <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-orange-400">Group Itineraries</CardTitle>
            <CardDescription className="text-orange-200/80">
              Manage travel plans and destinations for your group
            </CardDescription>
          </div>
          <Button onClick={handleCreateItinerary} className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25">
            <Plus className="mr-2 h-4 w-4" />
            Create Itinerary
          </Button>
        </CardHeader>
        <CardContent>
          {itineraries.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
              <h3 className="text-orange-300">No itineraries yet</h3>
              <p className="text-orange-200/60 mt-2">
                Create your first itinerary to start planning group activities
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {itineraries.map((itinerary) => (
                <div
                  key={itinerary.itinerary_id}
                  className="border border-gray-800/70 bg-[#1a1b23]/50 rounded-xl p-4 hover:border-[#ff6600]/50 transition-colors"
                >
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
                        onClick={() => handleEditItinerary(itinerary)}
                        className="text-orange-300 hover:text-white hover:bg-[#ff6600]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItinerary(itinerary.itinerary_id!)}
                        className="text-orange-300 hover:text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2 text-orange-200/70">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(itinerary.start_date, "MMM d, yyyy")} - {format(itinerary.end_date, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-200/70">
                      <Clock className="h-4 w-4" />
                      <span>{calculateDuration(itinerary.start_date, itinerary.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-200/70">
                      <MapPin className="h-4 w-4" />
                      <span>{itinerary.places.length} {itinerary.places.length === 1 ? 'place' : 'places'}</span>
                    </div>
                  </div>

                  {itinerary.places.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {itinerary.places.slice(0, 4).map((place) => (
                        <div key={place.place_id} className="flex gap-3 p-2 border border-gray-800/50 rounded-lg bg-[#0b0b0c]/50">
                          <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-gray-800/50">
                            {place.picture_url ? (
                              <img
                                src={place.picture_url}
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-orange-300/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-orange-200">{place.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {place.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-orange-200/60">{place.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {place.place_type && (
                                <Badge variant="secondary" className="text-xs py-0 h-5 bg-[#ff6600]/20 text-orange-300 border-none">
                                  {place.place_type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {itinerary.places.length > 4 && (
                        <div className="flex items-center justify-center p-2 border border-dashed border-gray-700 rounded-lg text-orange-200/60">
                          +{itinerary.places.length - 4} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
