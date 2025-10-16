"use client";

import { useRouter } from "next/navigation";
import { useUserGroups, useGroupSearch } from "@/lib/hooks/home";
import { useCurrentUser } from "@/lib/hooks/user";
import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import React from "react";
import { apiClient } from "@/lib/api";
import { Check } from "lucide-react";
import {motion} from "framer-motion";

export default function blogEditPage({params} : {params : Promise<{blog_id? : string}>}) {
    const router = useRouter();
    const {blog_id} = React.use(params)
    const [json_config , set_json_config] = React.useState<string|undefined>()
    const [html_output, set_html_output] = React.useState<string|undefined>()
    const [title, setTitle] = React.useState<string|undefined>("Umamusume Trip")
    const [description, setDescription] = React.useState<string|undefined>("Tokyo racecourse: following the trail of umamusume legends")
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

    const handleFormSubmit = async () => {
        // submit logic to the server here
        setShowFeedBack(true);
        await apiClient.put(`/api/v2/blogs/${blog_id}`,{
            json_config,html_output,title,description
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
            <div className="w-4/5 h-auto mb-5 justify-between flex flex-row">
                <Input value={description} onChange={(val)=>{setDescription(val.target.value)}} className="w-full min-h-[50px] focus:border-0 border-white/10 flex justify-start items-left" placeholder="Description"/>
            </div>
            <div className="w-4/5 flex items-center justify-center border-1 border-white/10 mb-5">
                <SimpleEditor mode="edit" onInit={(t,d)=>{
                    setTitle(t);
                    setDescription(d);
                }} blog_id={blog_id} onUpdate={handleBlogChange}/>
            </div>
        </div>
    );
}
