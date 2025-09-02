import React from 'react';
import { Plane, Heart, MapPin, Camera } from 'lucide-react';
import { APP_CONFIG } from '../../config/shared';

export const AppIntro: React.FC = () => {
  return (
    <>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-center pt-16 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
            <Plane className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              {APP_CONFIG.APP_NAME}
            </h1>
            <p className="text-orange-300">
              {APP_CONFIG.APP_DESCRIPTION}
            </p>
          </div>
        </div>
      </header>

      {/* Feature highlights */}
      <div className="relative z-10 flex justify-center mb-12">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center text-orange-200/80">
            <Heart className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <p className="text-sm">Connect</p>
          </div>
          <div className="text-center text-orange-200/80">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <p className="text-sm">Explore</p>
          </div>
          <div className="text-center text-orange-200/80">
            <Camera className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <p className="text-sm">Create</p>
          </div>
        </div>
      </div>
    </>
  );
};
