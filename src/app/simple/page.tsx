"use client"

import { SimpleEditor } from "@/components/blog/tiptap-templates/simple/simple-editor"

export default function Page() {
  return (
    <SimpleEditor 
      mode="default"
      onUpdate={(json_config, html_output) => {
        console.log('Editor updated:', { json_config, html_output })
      }}
    />
  )
}
