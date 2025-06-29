"use client";

import { LogOut } from "lucide-react";

import { Button } from "@ragnotes/ui/button";

export function SignOutButton() {
  return (
    <Button variant="outline" title="Sign out">
      <LogOut />
    </Button>
  );
}
