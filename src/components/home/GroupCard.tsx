import React from 'react';
import { Button } from '../ui/button';
import { InterestsPill } from '../ui/interests-pill';
import { GroupResponse } from '@/lib/types';

interface GroupCardProps {
  group: GroupResponse;
  onView?: (group: GroupResponse) => void;
  onJoin?: (group: GroupResponse) => void;
  showJoinButton?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onView,
  onJoin,
  showJoinButton = false,
}) => {
  console.log('Rendering GroupCard for group:', group);
  return (
    <div className="bg-gray-800/60 border border-orange-500/20 rounded-xl p-4 hover:bg-gray-800/80 transition-colors">
      <h3 className="text-lg font-semibold text-orange-300 mb-2">
        {group.group_name}
      </h3>
      <InterestsPill interests={group.interests || []} className="mb-3" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-orange-400">
          {group.members.length} member{group.members.length !== 1 ? 's' : ''}
        </span>
        <div className="flex gap-2">
          {showJoinButton ? (
            <Button
              size="sm"
              variant="outline"
              className="border-orange-500 text-orange-400"
              onClick={() => onJoin?.(group)}
            >
              Join
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-orange-500 text-black hover:bg-orange-600"
              onClick={() => onView?.(group)}
            >
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
