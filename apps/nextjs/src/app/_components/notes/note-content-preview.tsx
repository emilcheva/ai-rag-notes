import type { JSONContent } from "novel";
import { generateHTML } from "@tiptap/html";

import { toast } from "@ragnotes/ui/toast";

import { defaultExtensions } from "../novel/extensions";

export function NoteContentPreview({ content }: { content: string }) {
  try {
    const parsedContent =
      typeof content === "string"
        ? (JSON.parse(content) as JSONContent)
        : content;

    const html = generateHTML(parsedContent, defaultExtensions);

    return (
      <div
        className="prose prose-sm max-w-none [&>*]:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error: unknown) {
    console.error("Error rendering html content", error);
    toast.error("Error rendering html content");
    return null;
  }
}
