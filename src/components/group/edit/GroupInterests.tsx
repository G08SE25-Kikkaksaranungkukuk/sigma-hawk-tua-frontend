import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag } from "lucide-react";
import { toast } from "sonner";

const SUGGESTED_INTERESTS = [
  "Hiking", "Camping", "Photography", "Food & Dining", "Beach",
  "Mountains", "Culture", "History", "Adventure Sports", "Wildlife",
  "City Exploration", "Road Trips", "Backpacking", "Luxury Travel"
];

export function GroupInterests({ groupId }: { groupId: number }) {
  const [interests, setInterests] = useState<string[]>([
    "Hiking", "Camping", "Photography"
  ]);
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (!trimmedInterest) return;
    
    if (interests.includes(trimmedInterest)) {
      toast.error("Interest already added");
      return;
    }

    setInterests([...interests, trimmedInterest]);
    setNewInterest("");
    toast.success("Interest added");
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
    toast.success("Interest removed");
  };

  const availableSuggestions = SUGGESTED_INTERESTS.filter(
    suggestion => !interests.includes(suggestion)
  );

  return (
    <div className="space-y-6">
      <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-orange-400">Group Interests</CardTitle>
          <CardDescription className="text-orange-200/80">
            Define what your group is interested in to attract like-minded members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Interests */}
          <div className="space-y-3">
            <h4 className="text-orange-300">Current Interests</h4>
            {interests.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-700 rounded-xl">
                <Tag className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
                <p className="text-orange-200/60">No interests added yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-2 px-3 py-1.5 bg-[#ff6600]/20 text-orange-300 border-none hover:bg-[#ff6600]/30">
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom Interest */}
          <div className="space-y-3">
            <h4 className="text-orange-300">Add Custom Interest</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter interest name..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInterest(newInterest);
                  }
                }}
                className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
              />
              <Button
                onClick={() => handleAddInterest(newInterest)}
                disabled={!newInterest.trim()}
                className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Suggested Interests */}
          {availableSuggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-orange-300">Suggested Interests</h4>
              <div className="flex flex-wrap gap-2">
                {availableSuggestions.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#ff6600]/20 transition-colors px-3 py-1.5 border-gray-700 text-orange-200/80 hover:text-orange-300 hover:border-[#ff6600]/50"
                    onClick={() => handleAddInterest(suggestion)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
