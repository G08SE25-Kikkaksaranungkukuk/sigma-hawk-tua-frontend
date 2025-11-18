"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/user";
import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import React from "react";
import { apiClient } from "@/lib/api";
import { Check } from "lucide-react";
import {motion} from "framer-motion";

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

export default function blogEditPage({params} : {params : Promise<{blog_id? : string}>}) {
    const router = useRouter();
    const {blog_id} = React.use(params)
    const [json_config , set_json_config] = React.useState<string|undefined>()
    const [html_output, set_html_output] = React.useState<string|undefined>()
    const [title, setTitle] = React.useState<string|undefined>("Umamusume Trip")
    const [description, setDescription] = React.useState<string|undefined>("Tokyo racecourse: following the trail of umamusume legends")
    const [tags, setTags] = React.useState<number[]>([]);
    const [showFeedBack,setShowFeedBack] = React.useState<boolean>(false);
    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser();

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="flex items-center justify-center bg-black min-h-screen">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        );
    }

    const handleBlogChange = (json_config? : string , html_output? : string) => {
        set_json_config(json_config);
        set_html_output(html_output);
    }

    const toggleTag = (tagIndex: number) => {
        setTags((prevTags) =>
            prevTags.includes(tagIndex)
                ? prevTags.filter((t) => t !== tagIndex)
                : [...prevTags, tagIndex]
        );
    };

    const handleFormSubmit = async () => {
        // submit logic to the server here
        setShowFeedBack(true);
        await apiClient.put(`/api/v2/blogs/${blog_id}`,{
            json_config,html_output,title,description, interest_id: tags
        },{withCredentials : true});
        await new Promise((resolve)=>{
            setTimeout(resolve,500)
        })
        setShowFeedBack(false);
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex flex-col justify-center items-center">
            <div className="w-4/5 h-auto mb-3 m-1 mt-5 justify-between flex flex-row">
                <div className="gap-4 flex-row flex">
                    <div className="gap-4 flex-col flex">
                        <Input value={title} onChange={(val)=>{setTitle(val.target.value)}} className="min-w-[250px] max-w-[350px] min-h-[30px] border-white/10 font-bold text-xl" placeholder="Title"/>
                    </div>
                </div>
                {(showFeedBack)? (
                    <motion.button animate="visible" onClick={handleFormSubmit} className="w-[150px] bg-green-600 hover:bg-green-700 flex flex-row justify-center items-center rounded-md px-2 py-1.5 text-sm font-bold gap-1"><Check/> Done</motion.button>
                ) : (                    
                    <motion.button animate="visible" onClick={handleFormSubmit} className="w-[150px] bg-orange-600 hover:bg-orange-700 rounded-md px-2 py-1.5 text-sm font-bold">Submit / Edit</motion.button>
                )}
            </div>
            <div className="w-4/5 h-auto mb-5 justify-between flex flex-col gap-3">
                <Input value={description} onChange={(val)=>{setDescription(val.target.value)}} className="w-full min-h-[50px] focus:border-0 border-white/10 flex justify-start items-left" placeholder="Description"/>
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
            </div>
            <div className="w-4/5 flex items-center justify-center border-1 border-white/10 mb-5">
                <SimpleEditor mode="edit" onInit={(t,d, interest_id)=>{
                    setTitle(t);
                    setDescription(d);
                    setTags(interest_id || []);
                    console.log(interest_id);
                    console.log(tags);
                }} blog_id={blog_id} onUpdate={handleBlogChange}/>
            </div>
        </div>
    );
}
