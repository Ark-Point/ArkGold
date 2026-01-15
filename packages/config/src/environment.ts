import * as dotenv from "dotenv";
import * as path from "path";

// Browser check: Skip dotenv loading if running in a client-side environment
if (typeof window === "undefined") {
  // __dirname points to packages/config/dist, so go up to root using ../../../.
  const nodeEnv = process.env.APP_ENV || process.env.NODE_ENV || "local";
  
  // Handle case where Next.js or other tools might mock __dirname or it's not reliable
  // But strictly keeping original logic:
  const envPath = path.resolve(__dirname, `../../../env.${nodeEnv}`);

  dotenv.config({ path: envPath });

  console.log(`✅ Loading environment variables from: env.${nodeEnv}`);
}
