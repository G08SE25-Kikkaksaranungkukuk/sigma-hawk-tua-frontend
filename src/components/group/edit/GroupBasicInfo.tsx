import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";
import { toast } from "sonner";

interface GroupBasicInfoProps {
  groupData: {
    group_id: number;
    group_name: string;
    description: string | null;
    profile_url: string | null;
    max_members: number;
  };
  setGroupData: (data: any) => void;
}

export function GroupBasicInfo({ groupData, setGroupData }: GroupBasicInfoProps) {
  const [formData, setFormData] = useState({
    group_name: groupData.group_name,
    description: groupData.description || "",
    profile_url: groupData.profile_url || "",
    max_members: groupData.max_members
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupData({ ...groupData, ...formData });
    toast.success("Group information updated successfully!");
  };

  return (
    <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-orange-400">Basic Information</CardTitle>
        <CardDescription className="text-orange-200/80">
          Update your group's basic details and settings
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="profile_url" className="text-orange-300">Group Banner Image</Label>
            <div className="space-y-3">
              {formData.profile_url && (
                <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-800/70">
                  <img
                    src={formData.profile_url}
                    alt="Group banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="profile_url"
                  placeholder="Enter banner image URL"
                  value={formData.profile_url}
                  onChange={(e) => setFormData({ ...formData, profile_url: e.target.value })}
                  className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
                />
                <Button type="button" variant="outline" size="icon" className="border-gray-600 text-orange-300 hover:bg-[#ff6600] hover:text-white hover:border-[#ff6600]">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-orange-200/60 text-sm">
                This image will be displayed as the hero banner on your group page
              </p>
            </div>
          </div>

          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group_name" className="text-orange-300">Group Name</Label>
            <Input
              id="group_name"
              placeholder="Enter group name"
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              required
              className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-orange-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your group's purpose and activities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 resize-none"
            />
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <Label htmlFor="max_members" className="text-orange-300">Maximum Members</Label>
            <Input
              id="max_members"
              type="number"
              min="1"
              max="100"
              value={formData.max_members}
              onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
              required
              className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
            />
            <p className="text-orange-200/60 text-sm">
              Set the maximum number of members allowed in this group
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" className="border-gray-600 text-orange-300 hover:bg-[#1a1b23]/80 hover:text-orange-200">
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 transition-all duration-200">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
