"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/blog/tiptap-ui-primitive/button"
import { Spacer } from "@/components/blog/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/blog/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/blog/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/blog/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/blog/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/blog/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/blog/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/blog/tiptap-node/list-node/list-node.scss"
import "@/components/blog/tiptap-node/image-node/image-node.scss"
import "@/components/blog/tiptap-node/heading-node/heading-node.scss"
import "@/components/blog/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/blog/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/blog/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/blog/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/blog/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/blog/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/blog/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/blog/tiptap-ui/link-popover"
import { MarkButton } from "@/components/blog/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/blog/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/blog/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/blog/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/blog/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/blog/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/blog/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/blog/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/blog/tiptap-templates/simple/data/content.json"
import { apiClient } from "@/lib/api"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  likeCount = 0,
  isLiked = false,
  onLikeToggleAction,
  loadingLike = false
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  likeCount?: number
  isLiked?: boolean
  onLikeToggleAction?: () => Promise<void>
  loadingLike?: boolean
}) => {
  return (
    <>
      <ToolbarGroup className="flex flex-1 items-center justify-center pt-4 pb-4">
        <button
          onClick={onLikeToggleAction}
          disabled={loadingLike}
          className={`flex items-center gap-3 py-2 px-4 rounded-full transition-all ${
            isLiked 
              ? "text-rose-500 hover:text-rose-400 bg-rose-500/10" 
              : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
          }`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <div className="flex items-center gap-1.5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="16" 
              height="16" 
              fill="currentColor"
            >
              <path d="M12 21s-7.5-4.873-10-8.2C-0.2 8.9 3.333 4 7.5 6.5 9.5 7.9 12 10.2 12 10.2s2.5-2.3 4.5-3.7C20.667 4 24.2 8.9 22 12.8 19.5 16.127 12 21 12 21z" />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </div>
          <span className={`text-sm font-medium border-l pl-3 ${
            isLiked ? "border-rose-500" : "border-gray-400"
          }`}>{formatLikeCount(likeCount)}</span>
        </button>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup className="hidden">
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator className="hidden" />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

const formatLikeCount = (count: number): string => {
    if (count < 1000) return count.toString();
    
    const tiers = [
        { threshold: 1e12, suffix: 'T' },
        { threshold: 1e9, suffix: 'B' },
        { threshold: 1e6, suffix: 'M' },
        { threshold: 1e3, suffix: 'k' }
    ];

    for (let {threshold, suffix} of tiers) {
        if (count >= threshold) {
            const scaled = count / threshold;
            const decimals = threshold === 1e3 ? 2 : 1;
            return scaled.toFixed(decimals).replace(/\.?0+$/, '') + suffix;
        }
    }

    return count.toString();
};

export function SimpleViewer({
  blog_id,
  likeCount = 0,
  isLiked = false,
  onLikeToggleAction,
  loadingLike = false
} : {
  blog_id?: string
  likeCount?: number
  isLiked?: boolean
  onLikeToggleAction?: () => Promise<void>
  loadingLike?: boolean
}) {
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    editable : false,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content : ""
  })

  React.useMemo(()=>{
    if(editor) {
      (apiClient.get(`/api/v2/blogs/${blog_id}/content`)).then((val : any)=>{
        editor?.commands.setContent(val)
      })
    }
  },[editor])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          className="hidden border-none"
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              likeCount={likeCount}
              isLiked={isLiked}
              onLikeToggleAction={onLikeToggleAction}
              loadingLike={loadingLike}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}
