"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/user";
import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

const interestsList = [
    { id: "SEA", label: "🌊 Sea", color: "blue" },
    { id: "MOUNTAIN", label: "⛰️ Mountain", color: "green" },
    { id: "WATERFALL", label: "💧 Waterfall", color: "sky" },
    { id: "NATIONAL_PARK", label: "🏞️ National Park", color: "teal" },
    { id: "ISLAND", label: "🏝️ Island", color: "cyan" },
    { id: "TEMPLE", label: "🙏 Temple", color: "indigo" },
    { id: "SHOPPING_MALL", label: "🛍️ Shopping Mall", color: "violet" },
    { id: "MARKET", label: "🏪 Market", color: "orange" },
    { id: "CAFE", label: "☕ Cafe", color: "amber" },
    { id: "HISTORICAL", label: "🏛️ Historical", color: "yellow" },
    { id: "AMUSEMENT_PARK", label: "🎢 Amusement Park", color: "pink" },
    { id: "ZOO", label: "🦁 Zoo", color: "emerald" },
    { id: "FESTIVAL", label: "🎉 Festival", color: "red" },
    { id: "MUSEUM", label: "🏛️ Museum", color: "purple" },
    { id: "FOOD_STREET", label: "🍴 Food Street", color: "rose" },
    { id: "BEACH_BAR", label: "🍹 Beach Bar", color: "cyan" },
    { id: "THEATRE", label: "🎭 Theatre", color: "slate" },
];

const DRAFT_KEY = "blogCreationDraft";

export default function BlogCreatePage() {
    const router = useRouter();
    const [json_config, set_json_config] = useState<string | undefined>();
    const [html_output, set_html_output] = useState<string | undefined>();
    const [title, setTitle] = useState<string | undefined>("");
    const [description, setDescription] = useState<string | undefined>("");
    const [tags, setTags] = useState<number[]>([]);
    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser();

    // Load draft from local storage on page load
    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
                const { title, description, json_config, html_output, tags } = JSON.parse(savedDraft);
                setTitle(title || "Sample Trip");
                setDescription(description || "(Sample) Tokyo racecourse: following the trail of umamusume legends");
                set_json_config(json_config);
                set_html_output(html_output);
                setTags(tags || []);
            }
        } catch (error) {
            console.error("Failed to load draft from local storage", error);
        }
    }, []);

    // Save draft to local storage whenever content changes
    useEffect(() => {
        try {
            const draft = { title, description, json_config, html_output, tags };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch (error) {
            console.error("Failed to save draft to local storage", error);
        }
    }, [title, description, json_config, html_output, tags]);

    if (userLoading) {
        return (
            <div className="flex items-center justify-center bg-black min-h-screen">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        );
    }

    const handleBlogChange = (json_config?: string, html_output?: string) => {
        set_json_config(json_config);
        set_html_output(html_output);
    };

    const toggleTag = (tagIndex: number) => {
        setTags((prevTags) =>
            prevTags.includes(tagIndex)
                ? prevTags.filter((t) => t !== tagIndex)
                : [...prevTags, tagIndex]
        );
    };

    const handleFormSubmit = async () => {
        try {
            // submit logic to the server here
            await apiClient.post(
                "/api/v2/blogs",
                {
                    json_config,
                    html_output,
                    title,
                    description,
                    interest_id: tags,
                },
                { withCredentials: true }
            );
            // Clear the draft from local storage after successful submission
            localStorage.removeItem(DRAFT_KEY);
            router.push("/blog");
        } catch (error) {
            console.error("Failed to submit blog", error);
            // Optionally, inform the user that the submission failed
        }
    };    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-4/5 h-auto mb-3 m-1 mt-5 justify-between flex flex-row">
                <div className="gap-4 flex-row flex">
                    <div className="gap-4 flex-col flex">
                        <Input value={title} onChange={(val)=>{setTitle(val.target.value)}} className="min-w-[250px] max-w-[350px] min-h-[30px] border-white/10 font-bold text-xl" placeholder="Title"/>
                    </div>
                </div>
                <button onClick={handleFormSubmit} className="bg-orange-600 hover:bg-orange-700 rounded-md px-2 py-1.5 text-sm font-bold">Submit / Edit</button>
            </div>
            
            {/* This is the container for the Description and the new Tagging System */}
            <div className="w-4/5 h-auto mb-5 justify-between flex flex-col gap-3">
                {/* Existing Description Input */}
                <Input value={description} onChange={(val)=>{setDescription(val.target.value)}} className="w-full min-h-[50px] focus:border-0 border-white/10 flex justify-start items-left" placeholder="Description"/>
                
                {/* Start of the Tagging System Element */}
                <div className="p-4 border border-white/10 rounded-md bg-white/5">
                    <div className="flex flex-wrap gap-2">
                        {interestsList.map((interest, index) => (
                            <button
                                key={interest.id}
                                type="button"
                                onClick={() => toggleTag(index + 1)}
                                className={`px-2 py-1 rounded-full border-2 text-xs font-medium transition-all chip-bounce ${
                                    tags.includes(index + 1)
                                        ? `bg-orange-500 text-black border-transparent shadow-lg orange-glow`
                                        : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10"
                                }`}
                            >
                                {interest.label}
                            </button>
                        ))}
                    </div>
                </div>
                {/* End of the Tagging System Element */}
                
            </div>
            
            <div className="w-4/5 flex items-center justify-center border-1 border-white/10 mb-5">
                <SimpleEditor
                    mode="default"
                    onUpdate={handleBlogChange}
                    initialContent={html_output}
                />
            </div>
        </div>
    );
}
