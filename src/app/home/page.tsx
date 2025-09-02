"use client";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Plane,
    Heart,
    Users,
    Search,
    Plus,
    MapPin,
    Camera,
    Globe,
    Bell,
    Settings,
    User,
    Menu,
} from "lucide-react";

export default function homePage() {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Navigation Bar */}
            <nav className="relative z-20 bg-gray-900/90 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                            <Plane className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            TravelMatch
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Button
                            variant="ghost"
                            className="text-orange-300 hover:text-orange-400"
                        >
                            Discover
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-orange-300 hover:text-orange-400"
                        >
                            My Groups
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-orange-300 hover:text-orange-400"
                        >
                            Messages
                        </Button>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-orange-400 hover:bg-orange-500/10"
                        >
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-orange-400 hover:bg-orange-500/10"
                        >
                            <Settings className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-orange-400 hover:bg-orange-500/10"
                        >
                            <User className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-orange-400 hover:bg-orange-500/10"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full float"></div>
                <div className="absolute top-40 right-20 w-12 h-12 bg-orange-400/30 rounded-full float-delayed"></div>
                <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full float-delayed-2"></div>
                <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/25 rounded-full float"></div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-orange-500/15 rounded-full float-delayed"></div>

                {/* Floating icons */}
                <div className="absolute top-32 right-32 text-orange-500/30 float-delayed">
                    <Heart className="w-8 h-8" />
                </div>
                <div className="absolute top-1/3 right-16 text-orange-500/30 float">
                    <Globe className="w-5 h-5" />
                </div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-center pt-16 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
                        <Plane className="w-8 h-8 text-black" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            TravelMatch
                        </h1>
                        <p className="text-orange-300">
                            Find your perfect travel companion
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

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Your Groups Section */}
                    <section className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-orange-400">
                                Your Groups
                            </h2>
                            <Button
                                variant="outline"
                                className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Create Group
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-800/60 border border-orange-500/20 rounded-xl p-4 hover:bg-gray-800/80 transition-colors">
                                <h3 className="text-lg font-semibold text-orange-300 mb-2">
                                    Thailand Adventure
                                </h3>
                                <p className="text-sm text-orange-200/80 mb-3">
                                    Exploring temples and beaches in Thailand
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-orange-400">
                                        5 members
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-orange-500 text-black hover:bg-orange-600"
                                    >
                                        View
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-gray-800/60 border border-orange-500/20 rounded-xl p-4 hover:bg-gray-800/80 transition-colors">
                                <h3 className="text-lg font-semibold text-orange-300 mb-2">
                                    Europe Backpack
                                </h3>
                                <p className="text-sm text-orange-200/80 mb-3">
                                    Budget backpacking across Europe
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-orange-400">
                                        3 members
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-orange-500 text-black hover:bg-orange-600"
                                    >
                                        View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Group Search Section */}
                    <section className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
                        <h2 className="text-2xl font-bold text-orange-400 mb-6">
                            Search Groups
                        </h2>

                        <div className="flex gap-2 mb-6">
                            <Input
                                placeholder="Search for groups..."
                                className="flex-1 border-orange-500/30 focus:border-orange-500 bg-gray-800/50 text-white"
                            />
                            <Button className="bg-orange-500 text-black hover:bg-orange-600">
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-gray-800/60 border border-orange-500/20 rounded-xl p-4 hover:bg-gray-800/80 transition-colors cursor-pointer">
                                <h3 className="text-lg font-semibold text-orange-300 mb-1">
                                    Travel Buddies Thailand
                                </h3>
                                <p className="text-sm text-orange-200/80 mb-2">
                                    A group for travelers in Thailand
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-orange-400">
                                        12 members
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-orange-500 text-orange-400"
                                    >
                                        Join
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-gray-800/60 border border-orange-500/20 rounded-xl p-4 hover:bg-gray-800/80 transition-colors cursor-pointer">
                                <h3 className="text-lg font-semibold text-orange-300 mb-1">
                                    Europe Adventure
                                </h3>
                                <p className="text-sm text-orange-200/80 mb-2">
                                    Find companions for your Europe trip
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-orange-400">
                                        8 members
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-orange-500 text-orange-400"
                                    >
                                        Join
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-gray-800/60 border border-orange-500/20 rounded-xl p-4 hover:bg-gray-800/80 transition-colors cursor-pointer">
                                <h3 className="text-lg font-semibold text-orange-300 mb-1">
                                    Japan Culture Trip
                                </h3>
                                <p className="text-sm text-orange-200/80 mb-2">
                                    Explore Japanese culture and traditions
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-orange-400">
                                        15 members
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-orange-500 text-orange-400"
                                    >
                                        Join
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Bottom stats */}
                <div className="mt-12 mb-8 bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-2xl font-bold text-orange-400">
                                50K+
                            </p>
                            <p className="text-sm text-orange-300/70">
                                Travelers
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-500">
                                120+
                            </p>
                            <p className="text-sm text-orange-300/70">
                                Countries
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-600">
                                1M+
                            </p>
                            <p className="text-sm text-orange-300/70">
                                Matches
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-t border-orange-500/20 mt-12">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                    <Plane className="w-5 h-5 text-black" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    TravelMatch
                                </span>
                            </div>
                            <p className="text-orange-300/80 text-sm leading-relaxed mb-4">
                                Connect with fellow travelers, discover amazing
                                destinations, and create unforgettable memories
                                together. Your perfect travel companion is just
                                a click away.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    size="sm"
                                    className="bg-orange-500 text-black hover:bg-orange-600"
                                >
                                    Join Now
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-500 text-orange-400"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-orange-400 mb-4">
                                Quick Links
                            </h3>
                            <div className="space-y-2">
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Discover Groups
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Create Group
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    My Profile
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Messages
                                </a>
                            </div>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-lg font-semibold text-orange-400 mb-4">
                                Support
                            </h3>
                            <div className="space-y-2">
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Help Center
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Safety Tips
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Contact Us
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-orange-500/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-orange-300/60 text-sm">
                            © 2025 TravelMatch. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
                            >
                                Cookie Settings
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
