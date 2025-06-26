import { NextResponse } from "next/server";

import { appRouter } from "@ragnotes/api";

import { env } from "~/env";

export async function GET() {
  // Only allow access in development environment
  if (env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { renderTrpcPanel } = await import("trpc-ui");

  return new NextResponse(
    renderTrpcPanel(appRouter, {
      url: "/api/trpc",
    }),
    {
      status: 200,
      headers: [["Content-Type", "text/html"] as [string, string]],
    },
  );
}
