'use client';

import { useState, useEffect } from "react";
import { ExpandableSection } from "./ExpandableSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Interest, Member, Itinerary, Place } from "@/lib/types";
import { ItineraryCard } from "@/components/group/Itinerary/ItineraryCard";
import { groupService } from "@/lib/services/group/group-service";
import { placeService } from "@/lib/services/place/placeService";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Extended Itinerary type with fetched places
interface ItineraryWithPlaces extends Itinerary {
  places?: Place[];
}

export interface GroupInfoProps {
  group_id: number
  group_name: string
  group_leader_id: number
  interests: Interest[]
  description: string
  members: Member[]
  max_members: number
  created_at: string
  updated_at: string
}

export function GroupInfoCard({ groupInfo }: { groupInfo: GroupInfoProps }) {
  const [itineraries, setItineraries] = useState<ItineraryWithPlaces[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItineraries();
  }, [groupInfo.group_id]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const data = await groupService.getItineraries(groupInfo.group_id.toString());
      
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
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/60 backdrop-blur-sm border-orange-500/20 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white text-xl">Trip Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-[rgba(255,102,0,0.25)]">
          <ExpandableSection title="About this group" defaultExpanded>
            <div className="space-y-4">
              <p>
                {groupInfo.description}
              </p>
            </div>
          </ExpandableSection>
          
          <ExpandableSection title="Itinerary">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
              </div>
            ) : itineraries.length === 0 ? (
              <div className="text-center py-8 text-orange-200/70">
                <CalendarDays className="mx-auto h-12 w-12 text-orange-400/50 mb-4" />
                <p className="text-sm">No itineraries yet</p>
                <p className="text-xs text-orange-200/50 mt-2">
                  The group host can add itineraries from the edit page
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {itineraries.map((itinerary) => (
                  <ItineraryCard
                    key={itinerary.itinerary_id}
                    itinerary={itinerary}
                  />
                ))}
              </div>
            )}
          </ExpandableSection>
        </div>
      </CardContent>
    </Card>
  );
}