import React, { useState, useEffect } from 'react';
import { Interest } from '@/lib/types/api';
import { groupService } from '@/lib/services/group/group-service';
import { InterestsPill } from '@/components/ui/interests-pill';

interface InterestSelectorProps {
  selectedInterestKeys: string[];
  onInterestKeysChange: (interestKeys: string[]) => void;
}

export function InterestSelector({ selectedInterestKeys, onInterestKeysChange }: InterestSelectorProps) {
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        const response = await groupService.getInterests();
        // Normalize the response - handle both array and object formats
        let interests: Interest[] = [];
        if (Array.isArray(response)) {
          interests = response;
        } else if (response && typeof response === 'object' && Array.isArray((response as any).interests)) {
          interests = (response as any).interests;
        }
        
        setAvailableInterests(interests);
      } catch (error) {
        console.error('Failed to fetch interests:', error);
        setAvailableInterests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const toggleInterest = (interestKey: string) => {
    const isSelected = selectedInterestKeys.includes(interestKey);
    console.log(`Toggling interest ${interestKey}, currently selected:`, selectedInterestKeys);
    
    if (isSelected) {
      onInterestKeysChange(selectedInterestKeys.filter(key => key !== interestKey));
    } else {
      onInterestKeysChange([...selectedInterestKeys, interestKey]);
    }
  };

  // Get selected Interest objects for displaying in InterestsPill
  const selectedInterests = Array.isArray(availableInterests) 
    ? availableInterests.filter(interest => selectedInterestKeys.includes(interest.key))
    : [];

  if (loading) {
    return (
      <div className="text-[#9aa3b2] text-sm">
        Loading interests...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.isArray(availableInterests) && availableInterests.map((interest) => {
          const isSelected = selectedInterestKeys.includes(interest.key);
          return (
            <button
              key={interest.key}
              type="button"
              onClick={() => toggleInterest(interest.key)}
              className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 hover:opacity-80 flex items-center gap-1 border ${
                isSelected
                  ? `text-white border-current`
                  : 'bg-[#1a1b23] text-[#9aa3b2] border-gray-700 hover:border-[#ff6600]/50'
              }`}
              style={isSelected ? { 
                '--tw-bg-opacity': '1',
                backgroundColor: interest.color, 
                borderColor: interest.color 
              } as React.CSSProperties : {}}
            >
              <span>{interest.emoji}</span>
              <span>{interest.label}</span>
            </button>
          );
        })}
      </div>
      
      {selectedInterests.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium mb-2 text-[#9aa3b2]">
            Selected Interests:
          </div>
          <InterestsPill interests={selectedInterests} />
        </div>
      )}
    </div>
  );
}