// import { User, Camera, MapPin, Star, Sparkles, Trophy, Globe } from "lucide-react";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { User, Camera, MapPin, Star, Sparkles, Trophy, Globe } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface ProfileSetupScreenProps {
  userName: string;
  onContinue: () => void;
}

export default function ProfileSetupScreen({ userName, onContinue }: ProfileSetupScreenProps) {
  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full float"></div>
        <div className="absolute top-60 right-16 w-12 h-12 bg-orange-400/30 rounded-full float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full float-delayed-2"></div>
        <Star className="absolute top-32 right-32 text-orange-500/40 w-6 h-6 float" />
        <Sparkles className="absolute bottom-32 left-32 text-orange-400/40 w-5 h-5 float-delayed" />
        <Trophy className="absolute top-1/2 right-10 text-orange-300/40 w-4 h-4 float-delayed-2" />
        <Globe className="absolute top-1/4 left-16 text-orange-400/30 w-5 h-5 float" />
      </div>

      <div className="max-w-md mx-auto pt-8 relative z-10">
        <Card className="card-hover shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm bounce-in">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-t-lg">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center pulse-soft">
                <User className="w-12 h-12 text-black" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-black" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome, {userName}! 🎉</CardTitle>
            <p className="text-black/80">
              Let's make your profile shine ✨
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Progress indicator */}
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 rounded-xl border-2 border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-orange-300">Profile Completion</span>
                <span className="text-sm font-bold text-orange-400">25%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full orange-glow" style={{ width: '25%' }}></div>
              </div>
            </div>

            {/* Profile completion steps */}
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border-2 border-orange-500/30 card-hover">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-300">📸 Add Profile Photo</h3>
                  <p className="text-sm text-orange-400/70">Show your amazing smile</p>
                </div>
                <Button variant="outline" size="sm" className="btn-hover-lift border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                  Upload
                </Button>
              </div>

              <div className="flex items-center p-4 bg-gradient-to-r from-orange-600/10 to-orange-500/10 rounded-xl border-2 border-orange-500/30 card-hover">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-300">📍 Set Location</h3>
                  <p className="text-sm text-orange-400/70">Find travelers near you</p>
                </div>
                <Button variant="outline" size="sm" className="btn-hover-lift border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                  Set
                </Button>
              </div>

              <div className="flex items-center p-4 bg-gradient-to-r from-orange-400/10 to-orange-600/10 rounded-xl border-2 border-orange-500/30 card-hover">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-300">✍️ Bio & Preferences</h3>
                  <p className="text-sm text-orange-400/70">Tell your travel story</p>
                </div>
                <Button variant="outline" size="sm" className="btn-hover-lift border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                  Add
                </Button>
              </div>
            </div>

            {/* Achievement section */}
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 rounded-xl border-2 border-orange-500/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-orange-300">First Achievement Unlocked!</span>
              </div>
              <p className="text-center text-sm text-orange-400/70">
                🎯 <span className="font-medium text-orange-400">New Explorer</span> - Welcome to TravelMatch!
              </p>
            </div>

            {/* Continue Button */}
            <Button
              onClick={onContinue}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black rounded-xl font-semibold text-lg shadow-xl btn-hover-lift border-0 orange-glow"
            >
              🌟 Continue to Dashboard
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-orange-400/70">
                🕐 You can complete these steps later in your profile settings
              </p>
              <div className="flex justify-center space-x-4 text-xs text-orange-400/50">
                <span className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>50K+ travelers</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>4.9 rating</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}