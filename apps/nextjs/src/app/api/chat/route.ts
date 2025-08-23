import { headers } from "next/headers";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { UIMessage } from "ai";
import { convertToModelMessages, streamText } from "ai";

import { auth } from "~/auth/server";
import { env } from "~/env";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Auth guard
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Not authenticated", { status: 401 });
  }

  const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    headers: {
      "x-goog-api-key": env.GOOGLE_GENERATIVE_AI_API_KEY,
    },
  });

  const { messages }: { messages: UIMessage[] } = await req.json();

  // only last 10 messages to not overflow the context window
  const lastMessages = messages.slice(-10);

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(lastMessages),
    system:
      "You are a helpful assistant that can answer questions and help with tasks",
    onError(error) {
      console.error("AI streamText error:", error);
    },
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
