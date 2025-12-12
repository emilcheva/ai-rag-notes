"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  AlertCircle,
  Bot,
  Expand,
  Minimize,
  Send,
  Trash,
  X,
} from "lucide-react";

import { cn } from "@ragnotes/ui";
import { Button } from "@ragnotes/ui/button";
import { Textarea } from "@ragnotes/ui/textarea";

import type { NoteData } from "./ai-note-response";
import Markdown from "../markdown/markdown";
import { NotesResponseList } from "./ai-note-response";

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
        text: "I'm your notes assistant. I can find and summarize any information that you saved.",
      },
    ],
  },
];

function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { messages, sendMessage, setMessages, status, error } = useChat({
    messages: initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isProcessing = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      void sendMessage({ text: input });
      setInput("");
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSubmit(e);
    }
  };

  if (!open) return null;

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

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
            {isExpanded ? <Minimize size={17} /> : <Expand size={17} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages(initialMessages)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
            title="Clear chat"
            disabled={isProcessing}
          >
            <Trash size={17} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
          >
            <X size={17} />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isProcessing && lastMessageIsUser && <Loader />}
        {status === "error" && <ErrorMessage error={error} />}
        <div ref={messagesEndRef} />
      </div>

      <form className="flex gap-2 border-t p-3" onSubmit={onSubmit}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="max-h-[120px] min-h-[40px] resize-none overflow-y-auto"
          maxLength={1000}
          autoFocus
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isProcessing}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

interface ChatMessageProps {
  message: UIMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  const currentStep = message.parts[message.parts.length - 1];

  return (
    <div
      className={cn(
        "mb-2 flex flex-col",
        message.role === "user"
          ? "ml-auto max-w-[80%] items-end"
          : "mr-auto items-start",
      )}
    >
      <div
        className={cn(
          "rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "bg-primary/40 text-primary-foreground"
            : "bg-muted/50",
        )}
      >
        {message.role === "assistant" && (
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Bot className="size-5 text-primary" />
            AI Assistant
          </div>
        )}
        {currentStep?.type === "text" && currentStep.text.trim() && (
          <Markdown>{currentStep.text}</Markdown>
        )}
        {currentStep?.type === "tool-getInformation" &&
          (currentStep.state === "output-available" ? (
            formatResponseWithNoteLinks(currentStep.output)
          ) : (
            <div className="animate-pulse italic">Searching notes...</div>
          ))}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="ml-2 flex items-center gap-1 py-2">
      <div className="size-1.5 animate-pulse rounded-full bg-primary" />
      <div className="size-1.5 animate-pulse rounded-full bg-primary delay-150" />
      <div className="size-1.5 animate-pulse rounded-full bg-primary delay-300" />
    </div>
  );
}

interface ErrorMessageProps {
  error?: Error | null;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
      <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-red-500" />
      <div className="space-y-1">
        <p className="font-medium">Something went wrong</p>
        <p className="text-xs">{error.message}</p>
        {/* Show the stack trace in development mode */}
        {/* {process.env.NODE_ENV === "development" && error.stack && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-medium">
              Technical details
            </summary>
            <pre className="mt-1 overflow-auto text-xs">{error.stack}</pre>
          </details>
        )} */}
      </div>
    </div>
  );
}

function formatResponseWithNoteLinks(content: unknown): React.ReactNode {
  if (typeof content !== "string") {
    try {
      const output = content as {
        notes?: NoteData[];
        message?: string;
      };

      if (!output.notes || output.notes.length === 0) {
        return (
          <p className="text-muted-foreground">
            {output.message ?? "No relevant notes found"}
          </p>
        );
      }

      return (
        <NotesResponseList notes={output.notes} message={output.message} />
      );
    } catch (error) {
      console.error("Error formatting tool output:", error);
      return <p className="text-sm text-red-500">Error displaying results</p>;
    }
  }

  return content;
}
