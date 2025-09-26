import React from 'react';
import { Button } from '../ui/button';
import { Search, Plus } from 'lucide-react';
import { GroupCard } from './GroupCard';
import { GroupResponse } from '@/lib/types';

interface YourGroupsSectionProps {
  groups: GroupResponse[];
  loading: boolean;
  error: string | null;
  onCreateGroup: () => void;
  onViewGroup: (group: GroupResponse) => void;
  onSearchGroups: () => void;
}

export const YourGroupsSection: React.FC<YourGroupsSectionProps> = ({
  groups,
  loading,
  error,
  onCreateGroup,
  onViewGroup,
  onSearchGroups,
}) => {
  const handleSearch = () => {
    onSearchGroups();
  };

  if (loading) {
    return (
      <section className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
        <div className="text-center text-red-400">
          <p>Error loading groups: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-orange-500 text-orange-400"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-orange-400">
          Your Groups
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
            onClick={onCreateGroup}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Group
          </Button>
          <Button
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-8 text-orange-300/70">
            <p>You haven't joined any groups yet.</p>
            <Button 
              className="mt-4 bg-orange-500 text-black hover:bg-orange-600"
              onClick={onCreateGroup}
            >
              Create Your First Group
            </Button>
          </div>
        ) : (
          groups.map((group) => (
            <GroupCard
              key={group.group_id}
              group={group}
              onView={onViewGroup}
              showJoinButton={false}
            />
          ))
        )}
      </div>
    </section>
  );
};
