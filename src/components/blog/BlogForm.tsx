"use client";

import { useState } from "react";

type Props = {
    currentUser: { id: string; name?: string };
    onCreated?: () => void;
};

export default function BlogForm({ onCreated }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setLoading(true);
        setLoading(false)
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <div>
                <label className="block text-sm text-gray-300 mb-1">Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded px-3 py-2 bg-slate-800 text-white border border-slate-700"
                    placeholder="Enter blog title"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-300 mb-1">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full rounded px-3 py-2 bg-slate-800 text-white border border-slate-700"
                    placeholder="Write your blog here..."
                />
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}
            {success && <div className="text-sm text-green-400">{success}</div>}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-black rounded disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post Blog"}
                </button>
            </div>
        </form>
    );
}