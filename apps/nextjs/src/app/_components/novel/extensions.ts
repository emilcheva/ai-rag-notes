import { TextAlign } from "@tiptap/extension-text-align";
import { Youtube } from "@tiptap/extension-youtube";
import { mergeAttributes } from "@tiptap/react";
import {
  Color,
  HighlightExtension,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UploadImagesPlugin,
} from "novel";
import { Markdown } from "tiptap-markdown";

import { cn } from "@ragnotes/ui";

const highlight = HighlightExtension;
const underline = TiptapUnderline;
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cn("cursor-pointer underline underline-offset-[3px]"),
  },
});

const textAlign = TextAlign.configure({
  alignments: ["left", "center", "right"],
  types: ["heading", "paragraph"],
  defaultAlignment: "left",
});

const color = Color;

const textStyle = TextStyle;
const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cn("mx-auto rounded-lg border border-stone-200 opacity-40"),
      }),
    ];
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      style: {
        default: null,
      },
      alt: {
        default: "Image",
      },
      title: {
        default: null,
      },
      height: {
        default: null,
      },
      width: {
        default: null,
      },
      dataID: {
        default: null,
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { height, width, style } = HTMLAttributes;
    const attributes = {
      ...HTMLAttributes,
      style: `height: ${height} !important; width: ${width} !important; ${style} !important;`,
    };
    return ["img", mergeAttributes(this.options.HTMLAttributes, attributes)];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cn("mx-auto rounded-lg border border-muted"),
  },
});

const MarkdownExtension = Markdown.configure({
  html: false,
  transformCopiedText: true,
});

const youtubeExtension = Youtube.configure({
  HTMLAttributes: {
    class: cn("mx-auto my-4"),
  },
  inline: true,
  width: 640,
  height: 480,
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cn("not-prose pl-2"),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cn("my-2 flex items-start gap-2"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cn("mb-6 mt-4 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cn("not-prose -mt-2 list-outside list-disc leading-3"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cn("not-prose ml-6 mt-2 !list-outside !list-decimal leading-3"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cn("mb-2 ml-4 leading-normal"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cn("border-l-4 border-primary pl-4"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cn(
        "rounded-md border bg-muted p-5 font-mono font-medium text-foreground",
      ),
    },
  },
  code: {
    HTMLAttributes: {
      class: cn(
        "rounded-md bg-muted px-1.5 py-1 font-mono font-medium text-foreground",
      ),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    class: "border-border",
    width: 4,
  },
  gapcursor: false,
});

export const defaultExtensions = [
  starterKit,
  tiptapLink,
  tiptapImage,
  taskList,
  taskItem,
  horizontalRule,
  textAlign,
  color,
  textStyle,
  highlight,
  underline,
  placeholder,
  MarkdownExtension,
  youtubeExtension,
];
