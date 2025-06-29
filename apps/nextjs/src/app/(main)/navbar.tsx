import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@ragnotes/ui/theme";

import logo from "~/assets/rag-notes-logo.png";
import { SignOutButton } from "./sign-out-button";

export function Navbar() {
  return (
    <nav className="mb-4 flex justify-center border-b bg-card p-4">
      <div className="container mx-auto flex items-center justify-between xl:max-w-6xl">
        <Link
          href="/notes"
          className="flex items-center gap-3 text-xl font-semibold text-card-foreground transition-opacity hover:opacity-80"
        >
          <Image
            src={logo}
            alt="AI RAG Notes Logo"
            width={64}
            height={64}
            className="rounded"
          />
          AI RAG Notes
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}
