'use client';

import { useState, useEffect, use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GroupBasicInfo } from "@/components/group/edit/GroupBasicInfo";
import { GroupItineraries } from "@/components/group/edit/GroupItineraries";
import { GroupMembers } from "@/components/group/edit/GroupMembers";
import { GroupInterests } from "@/components/group/edit/GroupInterests";
import { GroupHero } from "@/components/group/edit/GroupHero";
import { FloatingElements } from "@/components/shared";
import { groupService } from '@/lib/services/group/group-service';
import { GroupResponse } from "@/lib/types";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function App({ params }: { params: Promise<{ groupId?: string }> }) {
  const { groupId } = use(params);
  
  const [groupData, setGroupData] = useState<GroupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Draft data for Basic Info
  const [draftBasicInfo, setDraftBasicInfo] = useState<{ formData: any; profileImageFile: File | null } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch group data from API
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        setError("Invalid group ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const groupResponse = await groupService.getGroupDetails(groupId);
        setGroupData(groupResponse);
      } catch (err) {
        console.error("Failed to fetch group data:", err);
        setError("Failed to load group information");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  // Track if there are unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(draftBasicInfo !== null);
  }, [draftBasicInfo]);

  // Handle save all changes
  const handleSaveChanges = async () => {
    if (!groupData || !draftBasicInfo) {
      toast.error("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      // Create FormData for the update request
      const updateData = new FormData();
      updateData.append('group_name', draftBasicInfo.formData.group_name);
      if (draftBasicInfo.formData.description) {
        updateData.append('description', draftBasicInfo.formData.description);
      }
      updateData.append('max_members', draftBasicInfo.formData.max_members.toString());
      
      // Add profile image if a new one was uploaded
      if (draftBasicInfo.profileImageFile) {
        updateData.append('profile', draftBasicInfo.profileImageFile);
      }

      // Call the update API
      const updatedGroup = await groupService.updateGroup(groupData.group_id.toString(), updateData);
      
      // Update the group data with the response
      setGroupData(updatedGroup);
      
      // Clear draft data
      setDraftBasicInfo(null);
      
      toast.success("Changes saved successfully!");
    } catch (error: any) {
      console.error('Failed to save changes:', error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mb-4" />
          <p className="text-orange-200/80">Loading group data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !groupData) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center">
        <FloatingElements />
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl text-orange-400 mb-2">{error || "Group not found"}</h2>
          <p className="text-orange-200/60 mb-6">
            We couldn't load the group information. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white rounded-lg font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <FloatingElements />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Hero Section */}
        <GroupHero 
          groupData={{
            group_name: groupData.group_name,
            description: groupData.description,
            profile_url: groupData.profile_url || null,
            created_at: new Date(groupData.created_at)
          }} 
          memberCount={groupData.members?.length || 0}
          maxMembers={groupData.max_members}
          groupId={groupData.group_id}
        />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-orange-400 mb-2">Group Configuration</h2>
            <p className="text-orange-200/80">
              Manage your group settings, itineraries, and members
            </p>
          </div>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="relative px-6 py-3 bg-gradient-to-r from-[#ff6600] via-[#ff7722] to-[#ff8533] hover:from-[#ff7722] hover:via-[#ff8533] hover:to-[#ff9944] text-white font-semibold shadow-2xl shadow-[#ff6600]/50 hover:shadow-[#ff6600]/70 transition-all duration-300 transform hover:scale-105 disabled:bg-gradient-to-r disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-gray-700/50 border border-orange-400/20 hover:border-orange-400/40 disabled:border-gray-700"
          >
            {/* Glow effect */}
            {hasUnsavedChanges && !isSaving && (
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[#ff6600] to-[#ff8533] opacity-30 blur-xl animate-pulse" />
            )}
            <span className="relative flex items-center">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </> 
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save All Changes
                  {hasUnsavedChanges && <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full animate-pulse" />}
                </>
              )}
            </span>
          </Button>
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
            <GroupBasicInfo 
              groupData={{
                group_id: groupData.group_id,
                group_name: groupData.group_name,
                description: groupData.description,
                profile_url: groupData.profile_url || null,
                max_members: groupData.max_members
              }} 
              setGroupData={(updatedData) => {
                setGroupData(prev => prev ? { ...prev, ...updatedData } : null);
              }}
              onDataChange={setDraftBasicInfo}
            />
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
