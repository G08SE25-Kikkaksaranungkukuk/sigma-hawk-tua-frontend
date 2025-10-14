'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupBasicInfo } from "@/components/group/edit/GroupBasicInfo";
import { GroupItineraries } from "@/components/group/edit/GroupItineraries";
import { GroupMembers } from "@/components/group/edit/GroupMembers";
import { GroupInterests } from "@/components/group/edit/GroupInterests";
import { GroupHero } from "@/components/group/edit/GroupHero";
import { FloatingElements } from "@/components/shared";

export default function App() {
  // Mock group data - in real app, this would come from API/Supabase
  const [groupData, setGroupData] = useState({
    group_id: 1,
    group_name: "Adventure Seekers",
    group_leader_id: 1,
    description: "A group for outdoor enthusiasts who love hiking and exploring nature",
    profile_url: "https://images.unsplash.com/photo-1603741614953-4187ed84cc50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjAzNzAyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    max_members: 10,
    created_at: new Date("2024-01-15"),
    updated_at: new Date()
  });

  const [memberCount] = useState(3);

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <FloatingElements />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Hero Section */}
        <GroupHero 
          groupData={groupData} 
          memberCount={memberCount}
          maxMembers={groupData.max_members}
        />

        <div className="mb-8">
          <h2 className="text-3xl text-orange-400 mb-2">Group Configuration</h2>
          <p className="text-orange-200/80">
            Manage your group settings, itineraries, and members
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#12131a]/90 backdrop-blur-sm border border-gray-800/70 p-1.5 gap-1.5 rounded-xl h-auto">
            <TabsTrigger 
              value="basic"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6600] data-[state=active]:to-[#ff8533] data-[state=active]:text-white text-orange-200/80 hover:text-orange-300 transition-all rounded-lg h-11"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="itineraries"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6600] data-[state=active]:to-[#ff8533] data-[state=active]:text-white text-orange-200/80 hover:text-orange-300 transition-all rounded-lg h-11"
            >
              Itineraries
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6600] data-[state=active]:to-[#ff8533] data-[state=active]:text-white text-orange-200/80 hover:text-orange-300 transition-all rounded-lg h-11"
            >
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="interests"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff6600] data-[state=active]:to-[#ff8533] data-[state=active]:text-white text-orange-200/80 hover:text-orange-300 transition-all rounded-lg h-11"
            >
              Interests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <GroupBasicInfo groupData={groupData} setGroupData={setGroupData} />
          </TabsContent>

          <TabsContent value="itineraries">
            <GroupItineraries groupId={groupData.group_id} />
          </TabsContent>

          <TabsContent value="members">
            <GroupMembers groupId={groupData.group_id} maxMembers={groupData.max_members} />
          </TabsContent>

          <TabsContent value="interests">
            <GroupInterests groupId={groupData.group_id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
