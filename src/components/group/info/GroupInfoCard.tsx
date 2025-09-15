import { ExpandableSection } from "./ExpandableSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Interest, Member } from "@/lib/types";

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
  return (
    <Card className="bg-[#12131a] border-[rgba(255,102,0,0.25)] rounded-2xl">
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
            <div className="space-y-6">
              <div className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#ff6600] rounded-full"></div>
                <div className="absolute left-1.5 top-5 w-0.5 h-full bg-[#ff6600]/30"></div>
                <h4 className="text-white mb-2 font-medium">Day 1: Bangkok Exploration</h4>
                <p className="text-sm text-gray-300">
                  Arrival, Grand Palace tour, Wat Pho temple visit, evening river cruise
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#ff6600] rounded-full"></div>
                <div className="absolute left-1.5 top-5 w-0.5 h-full bg-[#ff6600]/30"></div>
                <h4 className="text-white mb-2 font-medium">Day 2: Bangkok Markets & Street Food</h4>
                <p className="text-sm text-gray-300">
                  Chatuchak Weekend Market, cooking class, street food tour in Chinatown
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#ff6600] rounded-full"></div>
                <div className="absolute left-1.5 top-5 w-0.5 h-full bg-[#ff6600]/30"></div>
                <h4 className="text-white mb-2 font-medium">Day 3: Travel to Chiang Mai</h4>
                <p className="text-sm text-gray-300">
                  Morning flight, check-in, explore Old City, evening at Night Bazaar
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#ff6600] rounded-full"></div>
                <div className="absolute left-1.5 top-5 w-0.5 h-full bg-[#ff6600]/30"></div>
                <h4 className="text-white mb-2 font-medium">Day 4: Temples & Lantern Preparation</h4>
                <p className="text-sm text-gray-300">
                  Doi Suthep temple, lantern making workshop, traditional dinner
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#ff6600] rounded-full"></div>
                <h4 className="text-white mb-2 font-medium">Day 5: Yi Peng Lantern Festival</h4>
                <p className="text-sm text-gray-300">
                  Festival celebrations, lantern release ceremony, farewell dinner
                </p>
              </div>
            </div>
          </ExpandableSection>
          
          <ExpandableSection title="Requirements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Valid passport with at least 6 months remaining</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Travel insurance required</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Moderate fitness level for temple climbing</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Respectful clothing for temple visits</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Basic English communication skills</p>
                </div>
              </div>
            </div>
          </ExpandableSection>
          
          <ExpandableSection title="House Rules">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Be respectful of local customs and traditions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Stay with the group during activities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">No illegal substances or excessive drinking</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Contribute positively to group dynamics</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ff6600] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Report any issues to the host immediately</p>
                </div>
              </div>
            </div>
          </ExpandableSection>
        </div>
      </CardContent>
    </Card>
  );
}