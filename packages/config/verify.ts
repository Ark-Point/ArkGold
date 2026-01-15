import { config } from "./src/index";

console.log("--- Config Verification ---");
console.log("Environment:", config.app.environment);
if (config.app.environment !== "local") {
  console.error("❌ Environment mismatch! Expected 'local', got:", config.app.environment);
  process.exit(1);
}

// Verify Contract Addresses (from local.ts)
if (!config.contract.MockUSDT) {
  console.error("❌ MockUSDT contract address missing!");
  process.exit(1);
}
console.log("✅ MockUSDT:", config.contract.MockUSDT);

// Verify Environment Variables (from env.local via dotenv)
// env.local has NEXT_PUBLIC_MANTLE_RPC_URL
console.log("Mantle RPC URL:", config.mantle.rpcUrl);

if (!config.mantle.rpcUrl) {
    console.error("❌ Mantle RPC URL missing! Env var loading failed.");
    process.exit(1);
}

console.log("✅ Configuration verified successfully.");
