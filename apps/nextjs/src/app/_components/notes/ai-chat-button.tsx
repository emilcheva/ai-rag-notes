"use client";

import type { UIMessage } from "ai";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Bot, Expand, Minimize, Trash, X } from "lucide-react";

import { cn } from "@ragnotes/ui";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@ragnotes/ui/ai-elements/conversation";
import { Loader } from "@ragnotes/ui/ai-elements/loader";
import { Message, MessageContent } from "@ragnotes/ui/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@ragnotes/ui/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@ragnotes/ui/ai-elements/reasoning";
import { Response } from "@ragnotes/ui/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@ragnotes/ui/ai-elements/source";
import { Button } from "@ragnotes/ui/button";

import type { NoteData } from "./ai-note-response";
import { NoteResponseLink, NotesResponseList } from "./ai-note-response";

export function AIChatButton() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatOpen(true)} variant="outline">
        <Bot />
        <span className="ml-2">Ask AI</span>
      </Button>
      <AIChatBox open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const initialMessages: UIMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I'm your notes assistant. I can find any information that you saved. Ask me questions about your notes!",
      },
    ],
  },
];

function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
  });

  const isProcessing = status === "submitted" || status === "streaming";

  const [isExpanded, setIsExpanded] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      void sendMessage({ text: input });
      setInput("");
    }
  }

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col rounded-lg border bg-card shadow-lg duration-300 animate-in slide-in-from-bottom-10 2xl:right-16",
        isExpanded
          ? "h-[650px] max-h-[90vh] w-[550px]"
          : "h-[500px] max-h-[80vh] w-80 sm:w-96",
      )}
    >
      <div className="flex items-center justify-between rounded-t-lg border-b bg-primary p-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h3 className="font-medium">Notes Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize /> : <Expand />}
          </Button>
          <Button
            onClick={() => setMessages(initialMessages)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
            title="Clear chat"
            disabled={isProcessing}
          >
            <Trash />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" && (
                  <Sources>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "source-url":
                          return (
                            <>
                              <SourcesTrigger
                                count={
                                  message.parts.filter(
                                    (part) => part.type === "source-url",
                                  ).length
                                }
                              />
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            </>
                          );
                      }
                    })}
                  </Sources>
                )}
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response
                              key={`${message.id}`}
                              className={
                                message.id === "welcome-message"
                                  ? "rounded-lg border border-primary/30 bg-primary/10 p-4 font-medium"
                                  : ""
                              }
                            >
                              {part.text}
                            </Response>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}`}
                              className="w-full rounded-lg border border-primary/30 bg-primary/10 p-4 font-medium"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        case "tool-getInformation":
                          return (
                            <div
                              key={`${message.id}`}
                              className="my-2 flex flex-col gap-3"
                            >
                              <div className="min-w-40 rounded-md border border-muted bg-muted/50 p-3 text-sm">
                                <div className="mb-1 text-xs font-medium text-muted-foreground">
                                  Answer
                                </div>
                                {part.state === "output-available" &&
                                  formatResponseWithNoteLinks(part.output)}
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <PromptInput onSubmit={handleSubmit} className="mt-4 flex gap-2 p-4">
        <PromptInputTextarea
          className="border-0"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          value={input}
        />
        <PromptInputToolbar>
          <PromptInputSubmit
            variant="secondary"
            disabled={!input}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

// Helper function to process text with note links
function processTextWithNoteLinks(content: string): React.ReactNode {
  const noteIdRegex = /\[Note ID: ([a-zA-Z0-9-]+)\]/g;

  if (!noteIdRegex.test(content)) {
    return content;
  }

  // Reset regex state
  noteIdRegex.lastIndex = 0;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = noteIdRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add the note link
    const noteId = match[1];
    if (noteId) {
      parts.push(<NoteResponseLink key={`link-${noteId}`} noteId={noteId} />);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <>{parts}</>;
}

// Helper function to format response text with note links
function formatResponseWithNoteLinks(content: unknown): React.ReactNode {
  // If content is not a string (likely an object from tool output)
  if (typeof content !== "string") {
    try {
      // Try to parse the tool output
      const output = content as {
        notes?: NoteData[];
        message?: string;
      };

      if (!output.notes) {
        return (
          <p className="text-muted-foreground">
            No notes information available
          </p>
        );
      }

      // Format the notes as links
      return (
        <NotesResponseList notes={output.notes} message={output.message} />
      );
    } catch (error) {
      console.error("Error formatting tool output:", error);
      return <p className="text-sm text-red-500">Error displaying results</p>;
    }
  }

  // For text responses, process note links
  return processTextWithNoteLinks(content);
}
