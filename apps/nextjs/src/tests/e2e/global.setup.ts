import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { test as setup } from "@playwright/test";

import { env } from "~/env";
import { TEST_UNIQUE_ID, TEST_USER } from "./fixtures/auth";

setup("setup e2e auth", async () => {
  const authDir = path.join(process.cwd(), "src", "tests", "e2e", ".auth");
  await fs.mkdir(authDir, { recursive: true });

  const signature = crypto
    .createHmac("sha256", env.BETTER_AUTH_SECRET)
    .update(TEST_USER.sessionToken)
    .digest("base64");

  const signedValue = `${TEST_USER.sessionToken}.${signature}`;

  const now = new Date();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Use Neon's non-interactive transaction API - https://github.com/neondatabase/serverless?tab=readme-ov-file#transaction
  const sql = neon(env.POSTGRES_URL);

  try {
    // Execute all queries in a single transaction using SQL template literals
    await sql.transaction([
      sql`INSERT INTO "user" (id, name, email, "email_verified", image, "created_at", "updated_at") 
          VALUES (${TEST_UNIQUE_ID}, ${TEST_USER.name}, ${TEST_USER.email}, ${false}, ${TEST_USER.image}, ${now}, ${now}) 
          ON CONFLICT (id) DO NOTHING`,

      sql`INSERT INTO account (id, "account_id", "provider_id", "user_id", "access_token", scope, "created_at", "updated_at") 
          VALUES (${TEST_UNIQUE_ID}, ${TEST_USER.accountId}, ${"github"}, ${TEST_UNIQUE_ID}, ${"gho_000"}, ${"read:user,user:email"}, ${now}, ${now}) 
          ON CONFLICT (id) DO NOTHING`,

      sql`INSERT INTO session (id, token, "user_id", "expires_at", "created_at", "updated_at") 
          VALUES (${TEST_UNIQUE_ID}, ${TEST_USER.sessionToken}, ${TEST_UNIQUE_ID}, ${expiresAt}, ${now}, ${now}) 
          ON CONFLICT (token) DO UPDATE SET "expires_at" = ${expiresAt}`,
    ]);

    console.log(
      "====== Create test user transaction completed successfully ======",
    );
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error;
  }

  const cookieObject = {
    name: "better-auth.session_token",
    value: encodeURIComponent(signedValue),
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    expires: Math.round(expiresAt.getTime() / 1000),
  };

  await fs.writeFile(
    path.join(authDir, "auth.json"),
    JSON.stringify({ cookies: [cookieObject], origins: [] }, null, 2),
  );
});
