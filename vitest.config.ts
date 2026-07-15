import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["prototypes/**/*.test.ts", "apps/web/src/test/**/*.test.tsx"],
    setupFiles: ["./apps/web/src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"]
    }
  }
});
