"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@ragnotes/ui/button";

import { authClient } from "~/auth/client";

export function SignOutButton() {
  const router = useRouter();
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
                void router.push("/sign-in");
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
