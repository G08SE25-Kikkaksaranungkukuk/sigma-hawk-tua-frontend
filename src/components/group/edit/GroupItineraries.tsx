import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ItineraryEditor } from "@/components/group/edit/ItineraryEditor";
import { ItineraryCard } from "@/components/group/Itinerary/ItineraryCard";
import { Itinerary, Place } from "@/lib/types";
import { groupService } from "@/lib/services/group/group-service";
import { placeService } from "@/lib/services/place/placeService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Extended Itinerary type with fetched places
interface ItineraryWithPlaces extends Itinerary {
  places?: Place[];
}

export function GroupItineraries({ groupId }: { groupId: number }) {
  const [itineraries, setItineraries] = useState<ItineraryWithPlaces[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<ItineraryWithPlaces | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch itineraries on mount and when needed
  const fetchItineraries = async () => {
    try {
      setIsLoading(true);
      const data = await groupService.getItineraries(groupId.toString());
      
      // Fetch place details for each itinerary
      const itinerariesWithPlaces = await Promise.all(
        data.map(async (itinerary) => {
          if (!itinerary.place_links || itinerary.place_links.length === 0) {
            return { ...itinerary, places: [] };
          }

          // Fetch details for each business ID
          const placesPromises = itinerary.place_links.map(async (businessId) => {
            try {
              const place = await placeService.getBusinessDetails(businessId);
              return place;
            } catch (error) {
              console.error(`Error fetching place ${businessId}:`, error);
              return null;
            }
          });

          const places = await Promise.all(placesPromises);
          // Filter out null values (failed requests)
          const validPlaces = places.filter((place): place is Place => place !== null);

          return {
            ...itinerary,
            places: validPlaces
          };
        })
      );

      setItineraries(itinerariesWithPlaces);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      toast.error("Failed to load itineraries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, [groupId]);

  const handleCreateItinerary = () => {
    setEditingItinerary(undefined);
    setIsEditing(true);
  };

  const handleEditItinerary = (itinerary: ItineraryWithPlaces) => {
    setEditingItinerary(itinerary);
    setIsEditing(true);
  };

  const handleSaveItinerary = async () => {
    // Refetch itineraries after save
    await fetchItineraries();
    setIsEditing(false);
  };

  const handleDeleteItinerary = async (id: number) => {
    try {
      await groupService.deleteItinerary(groupId.toString(), id);
      toast.success("Itinerary deleted successfully");
      // Refetch itineraries after delete
      await fetchItineraries();
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast.error("Failed to delete itinerary");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
  };

  // Show editor when creating or editing
  if (isEditing) {
    return (
      <ItineraryEditor
        groupId={groupId}
        itinerary={editingItinerary}
        onSave={handleSaveItinerary}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Show list view
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/60 backdrop-blur-sm border-orange-500/20 shadow-2xl">
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
              <span className="ml-3 text-orange-200/70">Loading itineraries...</span>
            </div>
          ) : itineraries.length === 0 ? (
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
                <ItineraryCard
                  key={itinerary.itinerary_id}
                  itinerary={itinerary}
                  onEdit={() => handleEditItinerary(itinerary)}
                  onDelete={() => confirmDelete(itinerary.itinerary_id!)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-gray-900/90 backdrop-blur-sm border-orange-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-300">Delete Itinerary</AlertDialogTitle>
            <AlertDialogDescription className="text-orange-200/70">
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-orange-200 hover:bg-gray-700 border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteItinerary(deletingId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
