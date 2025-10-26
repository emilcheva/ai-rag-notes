import type { UIMessage } from "ai";
import { headers } from "next/headers";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod/v4";

import { auth } from "~/auth/server";
import { env } from "~/env";
import { api } from "~/trpc/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
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

  const { messages } = (await req.json()) as { messages: UIMessage[] };

  // only last 10 messages to not overflow the context window
  const lastMessages = messages.slice(-10);

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(lastMessages),
    system: `
      You are a helpful assistant that can answer questions based on the user's notes.
      
      ALWAYS check the user's notes before answering any questions by using the getInformation tool.
      When using the getInformation tool, ALWAYS pass the user's exact question as the query parameter.
      
      When answering:
      1. Cite the specific notes you're using
      2. Try to summarize the information from the notes and answer the question
      3. Use markdown formatting to make your responses clear and well-structured
      4. If multiple notes are relevant, synthesize the information from all of them
      5. If no relevant information is found in the notes, clearly state that and then answer based on your general knowledge
      
      Be concise but thorough in your responses. Focus on providing accurate information from the notes.
    `,
    tools: {
      getInformation: tool({
        description: `Get information from the user's notes to answer questions. You MUST pass the user's exact question as the query parameter.`,
        parameters: z.object({
          query: z
            .string()
            .describe(
              "The user's exact question - pass the full question text here",
            ),
        }),
        returns: z.object({
          notes: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              similarity: z.number(),
            }),
          ),
          message: z.string(),
        }),
        //@ts-expect-error ai-sdk types are not compatible with zod
        execute: async ({ query }: { query: string }) => {
          try {
            const session = await auth.api.getSession({
              headers: await headers(),
            });

            if (!session?.user) {
              console.error("Authentication required - no valid session");
              return { notes: [], message: "Authentication required" };
            }

            const relevantNotes = await api.embeddings.findRelevantContent({
              query,
            });

            if (!relevantNotes) {
              console.error("No relevant notes found");
              return {
                notes: [],
                message:
                  "Can you be more specific or try with another question?",
              };
            }

            return {
              notes: relevantNotes,
              message: `Found ${relevantNotes.length} relevant notes`,
            };
          } catch (error) {
            console.error("Error searching for relevant notes:", error);
            return { notes: [], message: "Error searching for notes" };
          }
        },
      }),
    },
    onError(error) {
      console.error("AI streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
