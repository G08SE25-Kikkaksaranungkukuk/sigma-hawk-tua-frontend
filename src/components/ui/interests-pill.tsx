import React from 'react';
import { Interest } from '@/lib/types/api';

interface InterestsPillProps {
  interests: Interest[];
  className?: string;
}

export const InterestsPill: React.FC<InterestsPillProps> = ({
  interests,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {interests?.length > 0 ? (
        interests.map((interest, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-current bg-current/10 text-current"
            style={{ '--tw-text-opacity': '1', color: interest.color } as React.CSSProperties}
          >
            <span>{interest.emoji}</span>
            <span>{interest.label}</span>
          </span>
        ))
      ) : (
        <span className="text-sm text-orange-200/80">No interests specified</span>
      )}
    </div>
  );
};
