"use client";

import router from "next/router";
import { LogOut } from "lucide-react";

import { Button } from "@ragnotes/ui/button";

import { authClient } from "~/auth/client";

export function SignOutButton() {
  return (
    <form>
      <Button
        variant="outline"
        title="Sign out"
        size="md"
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                void router.push("/");
              },
            },
          });
        }}
      >
        <LogOut />
      </Button>
    </form>
  );
}
