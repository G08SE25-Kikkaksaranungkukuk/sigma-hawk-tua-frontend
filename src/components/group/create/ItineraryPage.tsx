import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Calendar, MapPin, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/group/create/StepIndicator';
import { Itinerary, Place } from '@/lib/types';
import { ItineraryCard } from '@/components/group/Itinerary/ItineraryCard';
import { ItineraryEditor } from '@/components/group/edit/ItineraryEditor';
import { toast } from 'sonner';
import { groupService } from '@/lib/services/group/group-service';
import { placeService } from '@/lib/services/place/placeService';
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

interface ItineraryPageProps {
  groupId: number;
  onComplete: () => void;
  groupData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
  };
}

export function ItineraryPage({ groupId, onComplete, groupData }: ItineraryPageProps) {
  const [itineraries, setItineraries] = useState<ItineraryWithPlaces[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<ItineraryWithPlaces | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch itineraries on mount
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

  const handleSaveItinerary = async () => {
    // Refetch itineraries after save
    await fetchItineraries();
    setIsEditing(false);
  };

  const handleEditItinerary = (itinerary: ItineraryWithPlaces) => {
    setEditingItinerary(itinerary);
    setIsEditing(true);
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

  const handleCompleteCreation = () => {
    // All itineraries have been created via API already
    onComplete();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Show editor when creating or editing
  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 text-[#9aa3b2] hover:text-[#e8eaee] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Itineraries
          </button>

          {/* Step Indicator */}
          <StepIndicator currentStep={2} />

          <ItineraryEditor
            groupId={groupId}
            itinerary={editingItinerary}
            onSave={handleSaveItinerary}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Step Indicator */}
        <StepIndicator currentStep={2} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-white mb-3">Plan Your Itineraries</h1>
          <p className="text-[#9aa3b2]">
            Add one or more itineraries for <span className="text-[#ff6600]">{groupData.title || 'your group'}</span>
          </p>
        </div>

        {/* Group Info Badge */}
        <div className="flex items-center justify-center gap-6 text-sm mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm rounded-full border border-orange-500/20">
            <MapPin className="w-4 h-4 text-[#ff6600]" />
            <span className="text-[#e8eaee]">{groupData.destination || 'Destination not set'}</span>
          </div>
          {groupData.startDate && groupData.endDate && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm rounded-full border border-orange-500/20">
              <Calendar className="w-4 h-4 text-[#ff6600]" />
              <span className="text-[#e8eaee]">
                {formatDate(groupData.startDate)} → {formatDate(groupData.endDate)}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff6600]" />
              <span className="ml-3 text-[#9aa3b2]">Loading itineraries...</span>
            </div>
          ) : (
            <>
              {/* Saved Itineraries */}
              {itineraries.length > 0 && (
                <div className="space-y-6 mb-6">
                  {itineraries.map((itinerary) => (
                    <ItineraryCard
                      key={itinerary.itinerary_id}
                      itinerary={itinerary}
                      onEdit={() => handleEditItinerary(itinerary)}
                      onDelete={() => confirmDelete(itinerary.itinerary_id)}
                    />
                  ))}
                </div>
              )}

              {/* Create New Itinerary Button */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#ff6600]/10 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-[#ff6600]" />
                  </div>
                  <h3 className="text-[#e8eaee] text-xl mb-2">
                    {itineraries.length === 0 ? 'Create Your First Itinerary' : 'Add Another Itinerary'}
                  </h3>
                  <p className="text-[#9aa3b2] mb-6 text-sm">
                    {itineraries.length === 0 
                      ? 'Start planning your journey by creating an itinerary'
                      : 'Plan multiple itineraries for different parts of your trip'}
                  </p>
                  <Button
                    onClick={handleCreateItinerary}
                    className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 transition-all duration-200 hover:shadow-[#ff6600]/40"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    New Itinerary
                  </Button>
                </div>
              </div>

              {/* Complete Creation Button */}
              {itineraries.length > 0 && (
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20">
                  <div className="space-y-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#ff6600]/30 to-transparent"></div>
                    
                    <Button
                      onClick={handleCompleteCreation}
                      className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 transition-all duration-200 hover:shadow-[#ff6600]/40 h-14"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Complete Group Setup
                    </Button>

                    <p className="text-[#9aa3b2] text-sm text-center">
                      You can add more itineraries later
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-gray-900/90 backdrop-blur-sm border-orange-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#e8eaee]">Delete Itinerary</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9aa3b2]">
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-[#e8eaee] hover:bg-gray-700 border-gray-700">
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
