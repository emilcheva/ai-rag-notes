import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@ragnotes/ui/theme";

import logo from "~/assets/rag-notes-logo.png";
import { SignOutButton } from "../_components/auth/sign-out-button";

export function Navbar() {
  return (
    <nav className="mb-4 flex justify-center border-b bg-card p-4">
      <div className="mx-auto flex w-full items-center justify-between md:container lg:max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-card-foreground transition-opacity hover:opacity-80 md:text-xl"
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
