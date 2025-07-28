import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Files, FileText, Link } from "lucide-react";

import { cn } from "@ragnotes/ui";

interface EmptyStateProps {
  title: string;
  description: string;
  icons?: LucideIcon[];
}

export function EmptyState({
  title,
  description,
  icons = [FileText, Link, Files],
}: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-8 py-4">
      <div className="group flex flex-col items-center justify-center gap-y-6 rounded-xl border-2 border-dashed bg-background p-10 shadow-sm transition duration-500 hover:duration-200">
        <div className="isolate flex justify-center">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className={cn(
                "relative grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200",
                index === 0
                  ? "relative left-2.5 top-1.5 -rotate-6 group-hover:-translate-x-5 group-hover:-translate-y-0.5 group-hover:-rotate-12"
                  : index === 1
                    ? "z-10 group-hover:-translate-y-0.5"
                    : "relative right-2.5 top-1.5 rotate-6 group-hover:-translate-y-0.5 group-hover:translate-x-5 group-hover:rotate-12",
              )}
            >
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-y-2 text-center">
          <h6 className="text-lg font-medium">{title}</h6>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
