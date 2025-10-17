"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/user";
import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

const DRAFT_KEY = "blogCreationDraft";

export default function BlogCreatePage() {
    const router = useRouter();
    const [json_config, set_json_config] = useState<string | undefined>();
    const [html_output, set_html_output] = useState<string | undefined>();
    const [title, setTitle] = useState<string | undefined>("");
    const [description, setDescription] = useState<string | undefined>("");
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
                const { title, description, json_config, html_output } = JSON.parse(savedDraft);
                setTitle(title || "Sample Trip");
                setDescription(description || "(Sample) Tokyo racecourse: following the trail of umamusume legends");
                set_json_config(json_config);
                set_html_output(html_output);
            }
        } catch (error) {
            console.error("Failed to load draft from local storage", error);
        }
    }, []);

    // Save draft to local storage whenever content changes
    useEffect(() => {
        try {
            const draft = { title, description, json_config, html_output };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch (error) {
            console.error("Failed to save draft to local storage", error);
        }
    }, [title, description, json_config, html_output]);

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
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-4/5 h-auto mb-3 m-1 mt-5 justify-between flex flex-row">
                <div className="gap-4 flex-row flex">
                    <div className="gap-4 flex-col flex">
                        <Input value={title} onChange={(val)=>{setTitle(val.target.value)}} className="min-w-[250px] max-w-[350px] min-h-[30px] border-white/10 font-bold text-xl" placeholder="Title"/>
                    </div>
                </div>
                <button onClick={handleFormSubmit} className="bg-orange-600 hover:bg-orange-700 rounded-md px-2 py-1.5 text-sm font-bold">Submit / Edit</button>
            </div>
            <div className="w-4/5 h-auto mb-5 justify-between flex flex-row">
                <Input value={description} onChange={(val)=>{setDescription(val.target.value)}} className="w-full min-h-[50px] focus:border-0 border-white/10 flex justify-start items-left" placeholder="Description"/>
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
