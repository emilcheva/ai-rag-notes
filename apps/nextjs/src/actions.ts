"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/auth/server";

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
  redirect("/");
}
