import React from 'react';
import { APP_CONFIG } from '../../config/shared';

export const AppStats: React.FC = () => {
  return (
    <div className="mt-12 mb-0 bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
      <div className="grid grid-cols-3 gap-6 text-center">
        {APP_CONFIG.STATS.map((stat, index) => (
          <div key={stat.label}>
            <p className={`text-2xl font-bold ${
              index === 0 ? 'text-orange-400' : 
              index === 1 ? 'text-orange-500' : 'text-orange-600'
            }`}>
              {stat.value}
            </p>
            <p className="text-sm text-orange-300/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
