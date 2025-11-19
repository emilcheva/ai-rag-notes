import baseConfig, { restrictEnvAccess } from "@ragnotes/eslint-config/base";
import nextjsConfig from "@ragnotes/eslint-config/nextjs";
import reactConfig from "@ragnotes/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**", "src/app/api/chat/route.ts"],
    rules: {
      "playwright/expect-expect": ["error", { assertFunctionNames: ["a11y"] }],
    },
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
