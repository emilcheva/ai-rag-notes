import { neon } from "@neondatabase/serverless";
import { test as teardown } from "@playwright/test";

import { env } from "~/env";
import { TEST_UNIQUE_ID } from "./fixtures/auth";

teardown("teardown e2e auth", async () => {
  const sql = neon(env.POSTGRES_URL);

  try {
    // Execute all delete queries in a single transaction
    await sql.transaction([
      sql`DELETE FROM note WHERE "owner_id" = ${TEST_UNIQUE_ID}`,
      sql`DELETE FROM session WHERE "user_id" = ${TEST_UNIQUE_ID}`,
      sql`DELETE FROM account WHERE "user_id" = ${TEST_UNIQUE_ID}`,
      sql`DELETE FROM "user" WHERE id = ${TEST_UNIQUE_ID}`,
    ]);

    console.log("Teardown completed successfully");
  } catch (error) {
    console.error("Error in teardown transaction:", error);
    throw error;
  }
});
