"use client";

import { useRef, useState } from "react";
import { Bot, Expand, Minimize, Send, Trash, X } from "lucide-react";

import { cn } from "@ragnotes/ui";
import { Button } from "@ragnotes/ui/button";
import { Textarea } from "@ragnotes/ui/textarea";

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

function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
            title="Clear chat"
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
        {/* TODO: Render messages here */}
        <div ref={messagesEndRef} />
      </div>

      <form className="flex gap-2 border-t p-3">
        <Textarea
          placeholder="Type your message..."
          className="max-h-[120px] min-h-[40px] resize-none overflow-y-auto"
          maxLength={1000}
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Loader() {
  return (
    <div className="ml-2 flex items-center gap-1 py-2">
      <div className="size-1.5 animate-pulse rounded-full bg-primary" />
      <div className="size-1.5 animate-pulse rounded-full bg-primary delay-150" />
      <div className="size-1.5 animate-pulse rounded-full bg-primary delay-300" />
    </div>
  );
}
