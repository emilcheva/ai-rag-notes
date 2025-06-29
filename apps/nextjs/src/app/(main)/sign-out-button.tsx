"use client";

import { LogOut } from "lucide-react";

import { Button } from "@ragnotes/ui/button";

import { signOut } from "~/actions";

export function SignOutButton() {
  return (
    <form>
      <Button
        variant="destructive"
        title="Sign out"
        size="lg"
        formAction={signOut}
      >
        <LogOut />
      </Button>
    </form>
  );
}
