import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set",
  );
}

const googleAI = createGoogleGenerativeAI({
  apiKey,
  headers: {
    "x-goog-api-key": apiKey,
  },
});

const embeddingModel = googleAI.textEmbeddingModel("text-embedding-004");

export async function generateEmbedding(value: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value,
  });

  return embedding;
}

function generateChunks(input: string) {
  return input
    .split("\n\n")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export async function generateEmbeddings(value: string) {
  const chunks = generateChunks(value);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    content: chunks[index],
    embedding,
  }));
}
