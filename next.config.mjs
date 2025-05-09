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
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
