"use client";

import { useRef,useEffect } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

// ---------- Extensions ----------
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";

// ---------- Toolbar ----------
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// ---------- Buttons ----------
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";

// ---------- Image Upload ----------
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// ---------- Styles ----------
import "@/components/tiptap-templates/simple/simple-editor.scss";
import {VITE_DB_URL} from "../../../../config"

export function SimpleEditor({value, onChange}) {



  const toolbarRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "simple-editor",
      },
    },

    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your email...",
      }),

      Image,

      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error(error),
      }),
    ],

    onUpdate: ({ editor }) => {
      
      onChange(editor.getHTML());

    },

    content: value,
  });

    useEffect(() => {
  if (!editor) return;

  if (editor.getHTML() !== value) {
    editor.commands.setContent(value);
  }
}, [value, editor]);



  return (

    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>

        <Toolbar
          ref={toolbarRef}
          className="d-flex align-items-center justify-content-center"
        >
          <ToolbarGroup>
            <UndoRedoButton action="undo" />
            <UndoRedoButton action="redo" />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <HeadingDropdownMenu levels={[1, 2, 3]} />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <ListDropdownMenu types={["bulletList", "orderedList"]} />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="underline" />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <ImageUploadButton text="Image" />
          </ToolbarGroup>
 
        </Toolbar>
        <EditorContent editor={editor} className="simple-editor-content" />


      </EditorContext.Provider>
    </div>
  );
}
