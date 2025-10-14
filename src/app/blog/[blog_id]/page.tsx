"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { apiClient } from "@/lib/api";
import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor";
import { SimpleViewer } from "@/components/blog/tiptap-templates/simple/simple-viewer";

export default function blogEditPage({params} : {params : Promise<{blog_id? : string}>}) {
    const router = useRouter();
    const {blog_id} = React.use(params)
    const [htmlContent, setHtmlContent] = React.useState<string>("");
    
    React.useEffect(()=>{
        (async ()=>{
            const ret = await apiClient.get(`/api/v2/blogs/${blog_id}/content`) as string
            setHtmlContent(ret)
        })()
    },[])

    return (
        <>
            <SimpleViewer blog_id={blog_id}/>
        </>
    )
}
