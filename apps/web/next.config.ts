import dotenv from "dotenv";
import type { NextConfig } from "next";
import path from "path";

// Load environment variables from root env.local
dotenv.config({ path: path.join(__dirname, "../../env.local") });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
