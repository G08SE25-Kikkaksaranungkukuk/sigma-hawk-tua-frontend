import { placeService } from "@/lib/services/place/placeService";
import { Itinerary, ItineraryGroupHistory } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";
import React from "react";

interface UserTravelHistoryCardProps {
    itineraries: ItineraryGroupHistory[];
}

// A simple utility function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A skeleton card component for the loading state
const SkeletonCard = () => (
    <div className="bg-gray-800/50 border border-orange-500/20 rounded-lg p-4 animate-pulse">
        <div className="flex gap-3">
            <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-orange-500/20 border-2 border-orange-400/30"></div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="h-6 bg-orange-300/30 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-orange-200/30 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-orange-200/30 rounded w-1/3"></div>
            </div>
        </div>
    </div>
);

export const UserTravelHistoryCard: React.FC<UserTravelHistoryCardProps> = ({ itineraries }) => {
    
    const [processedItineraries, setProcessedItineraries] = React.useState<ItineraryGroupHistory[]>([]);
    const [isLoading, setIsLoading] = React.useState(true); // Added loading state
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const preprocessItinerary = React.useCallback(async () => {
        setIsLoading(true); // Set loading true at the start of processing
        const processed: ItineraryGroupHistory[] = [];

        for (const val of itineraries) {
            try {
                const businessId = val.itinerary.place_links.at(0);
                // Fetch details for one itinerary
                const place = await placeService.getBusinessDetails(businessId ?? "");
                
                // Create a deep enough copy to avoid mutation issues
                const newItinerary: Itinerary = { ...val.itinerary };
                newItinerary.place_links = place?.photos_sample.map((p) => p.photo_url) as string[] ?? ["/placeholder.avif"];

                processed.push({
                    ...val,
                    itinerary: newItinerary
                });
            } catch (error) {
                console.error(`Failed to process itinerary ${val.itinerary_id}:`, error);
                // Add a fallback version so the UI doesn't crash
                processed.push({
                    ...val,
                    itinerary: {
                        ...val.itinerary,
                        place_links: ["/placeholder.avif"]
                    }
                });
            }
            
            // Wait 100ms before the next loop iteration to avoid 429s
            // await delay(100); 
        }
        
        setProcessedItineraries(processed);
        setIsLoading(false); // Processing complete
    }, [itineraries]);

    React.useEffect(() => {
        if (itineraries && itineraries.length > 0) {
            preprocessItinerary();
        } else {
            setIsLoading(false); // Not loading if no itineraries
            setProcessedItineraries([]);
        }
    }, [itineraries, preprocessItinerary]); // Added preprocessItinerary to dependency array

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="w-full bg-gray-900/80 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Travel History
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {/* Render a skeleton for each itinerary being loaded */}
                    {itineraries.map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
                {/* Style block for scrollbar */}
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 3px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 146, 60, 0.3); border-radius: 3px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 146, 60, 0.5); }
                `}</style>
            </div>
        );
    }

    // --- Empty State (after loading) ---
    if (!processedItineraries || processedItineraries.length === 0) {
        return (
            <div className="w-full bg-gray-900/80 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Travel History
                </h3>
                <p className="text-orange-200/60 text-center py-8">No travel history yet</p>
            </div>
        );
    }

    // --- Data Loaded State ---
    return (
        <div className="w-full bg-gray-900/80 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Travel History
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {processedItineraries.map((itinerary, index) => (
                    <div
                        key={itinerary.itinerary_id || index}
                        className="bg-gray-800/50 border border-orange-500/20 rounded-lg p-4 hover:bg-gray-800/70 hover:border-orange-500/40 transition-all duration-200"
                    >
                        <div className="flex gap-3">
                            {/* Image or Icon */}
                            <div className="flex-shrink-0">
                                {itinerary.itinerary.place_links ? (
                                    <img
                                        src={itinerary.itinerary.place_links.at(0)}
                                        alt={itinerary.itinerary.title || 'Trip'}
                                        referrerPolicy="no-referrer"
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-orange-400/30"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-orange-500/20 border-2 border-orange-400/30 flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-orange-400" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-orange-300 font-semibold text-lg mb-1 truncate">
                                    {itinerary.itinerary.title || 'Untitled Trip'}
                                </h4>

                                {itinerary.itinerary.description && (
                                    <div className="flex items-center gap-1 text-orange-200/80 text-sm mb-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{itinerary.itinerary.description}</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 text-xs text-orange-200/70">
                                    {(itinerary.itinerary.start_date || itinerary.itinerary.end_date) && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {formatDate(itinerary.itinerary.start_date.toString())}
                                                {itinerary.itinerary.end_date && ` - ${formatDate(itinerary.itinerary.end_date.toString())}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.5);
        }
      `}</style>
        </div>
    );
};