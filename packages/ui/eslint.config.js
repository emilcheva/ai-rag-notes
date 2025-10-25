import baseConfig from "@ragnotes/eslint-config/base";
import reactConfig from "@ragnotes/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    // ignore ai-elements from linting as they come from ai-sdk
    ignores: ["dist/**", "src/ai-elements/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
