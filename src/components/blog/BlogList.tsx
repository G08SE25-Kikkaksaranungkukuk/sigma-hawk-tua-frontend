"use client";

import { apiClient } from "@/lib/api";
import { UserProfile } from "@/lib/types";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Blog = {
    blog_id: string;
    title: string;
    description: string;
    created_at?: string;
};

type Props = {
    currentUser?: UserProfile | null;
    refreshSignal?: number;
    onDeleted?: () => void;
};

export default function BlogList({ currentUser, refreshSignal = 0, onDeleted }: Props) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        if (!currentUser) {
            setBlogs([]);
            return;
        }

        let mounted = true;
        const fetchBlogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiClient.get(`/api/v2/blogs/list/me`, {
                    withCredentials : true
                });
                const data = res as unknown as Blog[]
                if (mounted) setBlogs(data || []);
            } catch (err: any) {
                if (mounted) setError(err.message || "Error loading blogs");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchBlogs();
        return () => {
            mounted = false;
        };
    }, [currentUser, refreshSignal]);

    const deleteBlog = async (id: string) => {
        if (!confirm("Delete this blog?")) return;
        try {
            const res = await apiClient.delete(`/api/v2/blogs/${id}`, {withCredentials : true});
            setBlogs((s) => s.filter((b) => b.blog_id !== id));
            onDeleted?.();
        } catch (err: any) {
            alert(err.message || "Failed to delete");
        }
    };

    if (!currentUser) {
        return <div className="text-gray-400">Log in to see your blogs.</div>;
    }

    if (loading) return <div className="text-gray-400">Loading blogs...</div>;
    if (error) return <div className="text-red-400">{error}</div>;
    if (blogs.length === 0) return <div className="text-gray-400">You haven't written any blogs yet.</div>;

    return (
        <div className="space-y-4 mt-5">
            {blogs.map((b) => (
                <article key={b.blog_id} className="p-4 bg-slate-900/60 hover:bg-slate-900/80 rounded-md border border-slate-700">
                    <div className="flex justify-between items-start" onClick={(e)=>{ if(e.target === e.currentTarget) router.push(`/blog/${b.blog_id}`)}}>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                            <div className="text-sm text-gray-400 mt-1">
                                {b.created_at ? new Date(b.created_at).toLocaleString() : ""}
                            </div>
                        </div>
                        <div className="space-x-2 space-y-2">
                            <button
                                onClick={() => window.location.href = `/blog/${b.blog_id}/edit`}
                                className="gap-1 justify-center items-center flex flex-row bg-orange-500 px-2 py-1 rounded-md text-white text-sm text-red-400 hover:text-red-300"
                            >
                                <Pencil className="text-sm" size={16}/>
                                Edit
                            </button>
                            <button
                                onClick={() => deleteBlog(b.blog_id)}
                                className="gap-1 justify-center items-center flex flex-row bg-red-500 px-2 py-1 rounded-md text-white text-sm text-red-400 hover:text-red-300"
                            >
                                <Trash className="text-sm" size={16}/>
                                Delete
                            </button>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-300 line-clamp-4">{b.description}</p>
                </article>
            ))}
        </div>
    );
}