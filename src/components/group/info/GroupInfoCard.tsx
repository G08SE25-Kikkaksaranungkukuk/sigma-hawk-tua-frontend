'use client';

import { useState, useEffect } from "react";
import { ExpandableSection } from "./ExpandableSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Interest, Member, ItineraryResponse } from "@/lib/types";
import { ItineraryCard } from "@/components/group/Itinerary/ItineraryCard";
import { groupService } from "@/lib/services/group/group-service";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [itineraries, setItineraries] = useState<ItineraryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItineraries();
  }, [groupInfo.group_id]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const data = await groupService.getItineraries(groupInfo.group_id.toString());
      setItineraries(data);
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