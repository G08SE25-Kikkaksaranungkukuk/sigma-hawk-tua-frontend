"use client";

import { useRouter, useParams } from "next/navigation";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor";
import { SimpleViewer } from "@/components/blog/tiptap-templates/simple/simple-viewer";
import { tr } from "zod/v4/locales";

interface LikeInterface{
    is_like_by_me : Boolean,
    count : Number
}

const formatLikeCount = (count: number): string => {
    if (count < 1000) return count.toString();
    
    const tiers = [
        { threshold: 1e12, suffix: 'T' },
        { threshold: 1e9, suffix: 'B' },
        { threshold: 1e6, suffix: 'M' },
        { threshold: 1e3, suffix: 'k' }
    ];

    for (const {threshold, suffix} of tiers) {
        if (count >= threshold) {
            const scaled = count / threshold;
            // For thousands, show two decimal places (1.23k)
            // For millions and above, show one decimal place (1.2M)
            const decimals = threshold === 1e3 ? 2 : 1;
            // Only show decimals if they're non-zero
            return scaled.toFixed(decimals).replace(/\.?0+$/, '') + suffix;
        }
    }

    return count.toString();
}

export default function blogEditPage() {
    const router = useRouter();
    const params = useParams();
    const blog_id = (params as any)?.blog_id as string | undefined;
    const [htmlContent, setHtmlContent] = React.useState<string>("");
    
    // Like UI state
    const [likedCount, setLikedCount] = React.useState<number | null>(null);
    const [liked, setLiked] = React.useState<boolean>(false);
    const [loadingLike, setLoadingLike] = React.useState<boolean>(false);
    
    React.useEffect(()=>{
        if (!blog_id) return;
        (async ()=>{
            try {
                const ret = await apiClient.get(`/api/v2/blogs/${blog_id}/content`,{withCredentials: true}) as string
                setHtmlContent(ret)
            } catch (err) {
                console.error('Failed to load blog content', err);
            }
        })()
    },[blog_id])

    // fetch likes on mount
    React.useEffect(() => {
        if (!blog_id) return;
        (async () => {
            try {
                // try to get { count, liked } first
                const res = await apiClient.get(`/api/v2/blogs/${blog_id}/likes`,{withCredentials: true});
                const data = res as unknown as LikeInterface;
                if (data && typeof data === "object") {
                    setLikedCount(typeof data.count === "number" ? data.count : (typeof data === "number" ? data : 0));
                    setLiked(Boolean(data.is_like_by_me));
                } else if (typeof data === "number") {
                    setLikedCount(data);
                } else {
                    // fallback: try separate endpoints (count-only)
                    const countRes = await apiClient.get(`/api/v2/blogs/${blog_id}/likes`,{withCredentials: true});
                    const count = countRes as unknown as LikeInterface;
                    setLikedCount(typeof count === 'number' ? count : 0);
                }
            } catch (err) {
                console.error("Failed to fetch likes:", err);
                setLikedCount(0);
            }
        })();
    }, [blog_id]);

    // Function to like a blog
    const likeBlog = async () => {
        if (!blog_id) return;
        try {
            const res = await apiClient.post(`/api/v2/blogs/${blog_id}/likes`, {}, {withCredentials: true});
            const data = res as unknown as LikeInterface;
            setLikedCount((val)=>typeof val === "number" ? val+1 : 0);
            setLiked(true);
            return true;
        } catch (err) {
            console.error("Like failed:", err);
            return false;
        }
    };

    // Function to unlike a blog
    const unlikeBlog = async () => {
        if (!blog_id) return;
        try {
            const res = await apiClient.delete(`/api/v2/blogs/${blog_id}/likes`, {withCredentials: true});
            const data = res as unknown as LikeInterface;
            setLikedCount((val)=>typeof val === "number" ? val-1 : 0);
            setLiked(false);
            return true;
        } catch (err) {
            console.error("Unlike failed:", err);
            return false;
        }
    };

    const toggleLike = async () => {
        if (!blog_id || loadingLike) return;
        setLoadingLike(true);
        const wasLiked = liked;
        
        // Optimistic update
        setLiked(!wasLiked);
        
        try {
            // Call appropriate API based on current state
            const success = wasLiked ? await unlikeBlog() : await likeBlog();
            
            if (!success) {
                // Revert optimistic update if API call failed
                setLiked(wasLiked);
            }
        } catch (err) {
            console.error("Like toggle failed:", err);
            // revert optimistic
            setLiked(prev => !prev);
        } finally {
            setLoadingLike(false);
        }
    };

    return (
        <>
            {/* Back to Blog Feed Button */}
                <div className="pt-6 pb-4">
                    <button
                        onClick={() => router.push('/blogfeed')}
                        className="flex items-center gap-2 text-orange-300 hover:text-orange-400 transition-colors group ml-10"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Blog Feed</span>
                    </button>
                </div>

            <SimpleViewer 
                blog_id={blog_id}
                likeCount={likedCount ?? 0}
                isLiked={liked}
                onLikeToggleAction={toggleLike}
                loadingLike={loadingLike}
            />
            {/* Floating like button (fixed bottom-right) */}
            <div
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
                aria-hidden={false}
            >
                <button
                    onClick={toggleLike}
                    disabled={loadingLike}
                    title={liked ? "Unlike" : "Like"}
                    className={
                        "flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors " +
                        (liked ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20")
                    }
                    aria-pressed={liked}
                >
                    {/* Heart SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                        <path d="M12 21s-7.5-4.873-10-8.2C-0.2 8.9 3.333 4 7.5 6.5 9.5 7.9 12 10.2 12 10.2s2.5-2.3 4.5-3.7C20.667 4 24.2 8.9 22 12.8 19.5 16.127 12 21 12 21z" />
                    </svg>
                </button>

                <div
                    className="min-w-[44px] px-3 py-1 rounded-full bg-black/70 text-white text-sm flex items-center justify-center shadow-md"
                    title={`${likedCount ?? 0} likes`}
                >
                    {likedCount !== null ? formatLikeCount(likedCount) : "-"}
                </div>
            </div>
        </>
    )
}
