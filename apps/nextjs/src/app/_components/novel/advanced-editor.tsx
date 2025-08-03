"use client";

import type { EditorInstance } from "novel";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useDebouncedCallback } from "use-debounce";

import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { slashCommand, suggestionItems } from "./slash-command";

import "./editor.css";

const TailwindAdvancedEditor = ({
  onChange = (editor: EditorInstance) => {
    console.log(editor.getJSON());
  },
  isEditable = true,
}: {
  onChange?: (editor: EditorInstance) => void;
  isEditable?: boolean;
}) => {
  const extensions = [...defaultExtensions, slashCommand];

  const debouncedUpdates = useDebouncedCallback((editor: EditorInstance) => {
    onChange(editor);
  }, 500);

  return (
    <div className="relative w-full">
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          editable={isEditable}
          extensions={extensions}
          className="relative h-[120px] w-full overflow-y-auto rounded-md border bg-transparent px-3 py-2 shadow-sm outline-none has-[:focus]:ring-1 has-[:focus]:ring-ring md:h-[290px]"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-sm dark:prose-invert prose-headings:font-title font-default outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 py-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full cursor-pointer items-start gap-4 rounded-md px-2 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
