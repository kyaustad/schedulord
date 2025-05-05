import createJiti from "jiti";
import { fileURLToPath } from "url";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env/env.ts");
const nextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },
};

export default nextConfig;
