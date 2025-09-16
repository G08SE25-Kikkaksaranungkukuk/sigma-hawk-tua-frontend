"use client";
import { Plane, Heart, Map, Camera, Globe, Users } from "lucide-react";
import { Button } from "../components/ui/button";

interface WelcomeScreenProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export default function WelcomeScreen({
    onGetStarted,
    onLogin,
}: WelcomeScreenProps) {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden bg-floating-shapes">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full float"></div>
                <div className="absolute top-40 right-20 w-12 h-12 bg-orange-400/30 rounded-full float-delayed"></div>
                <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full float-delayed-2"></div>
                <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/25 rounded-full float"></div>

                {/* Floating icons */}
                <div className="absolute top-32 right-32 text-orange-500/30 float-delayed">
                    <Heart className="w-8 h-8" />
                </div>
                <div className="absolute bottom-32 left-32 text-orange-400/30 float">
                    <Map className="w-6 h-6" />
                </div>
                <div className="absolute top-1/2 left-10 text-orange-300/25 float-delayed-2">
                    <Camera className="w-7 h-7" />
                </div>
                <div className="absolute top-1/3 right-16 text-orange-500/30 float">
                    <Globe className="w-5 h-5" />
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md space-y-8 text-center bounce-in">
                    {/* Logo */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl pulse-soft orange-glow">
                                <Plane className="w-12 h-12 text-black" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                <Users className="w-4 h-4 text-black" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                                ThamRoi
                            </h1>
                            <p className="text-xl text-orange-300 mt-2 drop-shadow">
                                Find your perfect travel companion
                            </p>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-3 gap-4 py-4">
                        <div className="text-center text-orange-200/80">
                            <Heart className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                            <p className="text-xs">Connect</p>
                        </div>
                        <div className="text-center text-orange-200/80">
                            <Map className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                            <p className="text-xs">Explore</p>
                        </div>
                        <div className="text-center text-orange-200/80">
                            <Camera className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                            <p className="text-xs">Create</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-4 slide-up">
                        <Button className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black text-lg rounded-2xl font-semibold shadow-xl btn-hover-lift border-0 orange-glow">
                            <a href="/signup">🚀 Start Your Journey</a>
                        </Button>

                        <Button
                            onClick={onLogin}
                            variant="outline"
                            className="w-full h-14 border-2 border-orange-500/50 text-orange-500 bg-black hover:bg-orange-500/10 hover:text-white text-lg rounded-2xl backdrop-blur-sm btn-hover-lift"
                        >
                            <a href="/login">✨ Welcome Back</a>
                        </Button>
                    </div>

                    {/* Additional info */}
                    <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-4 mt-6 border border-orange-500/20">
                        <p className="text-sm text-orange-300">
                            🌍 Join{" "}
                            <span className="font-semibold text-orange-400">
                                50,000+
                            </span>{" "}
                            travelers worldwide
                        </p>
                        <p className="text-xs text-orange-400/70 mt-1">
                            Connect • Explore • Create memories together
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
