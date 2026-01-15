import { ethers, network } from "hardhat";

// ------------------------------------------------------------
// [Configuration] Enter deployed contract addresses here!
// ------------------------------------------------------------
const ADDRESS = {
  MockUSDT: "0xd9a1Fb1AF398E4555c92943BBCEB8D6F4C25d742",         // Deployed MockUSDT address
  ArkGoldExchanger: "0x611F976cAdA5d02D744CfA9Ffc05e9d491e7d529", // Deployed ArkGoldExchanger address
  ArkGold: "0x5C32E009922B30a62F486843D12476D58aA83D70",          // Deployed ArkGold address
};

async function main() {
  console.log(`\n🚀 Starting Buy & Sell Test on ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`👤 User (Deployer): ${deployer.address}`);

  // 1. Connect Contracts
  const usdt = await ethers.getContractAt("MockUSDT", ADDRESS.MockUSDT);
  const exchanger = await ethers.getContractAt("ArkGoldExchanger", ADDRESS.ArkGoldExchanger);
  const arkGold = await ethers.getContractAt("ArkGold", ADDRESS.ArkGold);

  // 2. Check Current Gold Price
  console.log("\n📊 Checking Gold Price...");
  const pricePerOunce = await exchanger.getGoldPrice();
  // pricePerOunce는 18 decimals ($4622.30 * 10^18)
  console.log(`   Current Price: $${ethers.utils.formatUnits(pricePerOunce, 18)} / Oz`);

  // 3. Goal: Calculate 20 ArkGold (20 Oz) Buy
  const targetGoldAmount = ethers.utils.parseUnits("20", 18); // 20 tokens
  
  // Calculate required USDT (Inverse calculation)
  // Logic: usdtNeeded = (GoldAmount * Price) / 1e18 / 1e12 (Decimal Adjust)
  // Safe Math: (20 * 1e18 * price) / 1e30
  const costInUsdt18 = targetGoldAmount.mul(pricePerOunce).div(ethers.utils.parseUnits("1", 18));
  const costInUsdt6 = costInUsdt18.div(ethers.utils.parseUnits("1", 12));
  
  // Add a little buffer (Prevent Rounding issue)
  const buyAmountUSDT = costInUsdt6.add(ethers.utils.parseUnits("1", 6)); // + $1 buffer

  console.log(`   Target: 20 Oz`);
  console.log(`   Estimated Cost: ${ethers.utils.formatUnits(buyAmountUSDT, 6)} USDT`);

  // 4. Check & Secure USDT Balance
  let usdtBalance = await usdt.balanceOf(deployer.address);
  console.log(`\n💰 Current USDT Balance: ${ethers.utils.formatUnits(usdtBalance, 6)}`);

  if (usdtBalance.lt(buyAmountUSDT)) {
    console.log("   ⚠️ USDT Insufficient. Minting from Faucet (Deployer only)...");
    // MockUSDT deployer has 1M, so if running as deployer it should be enough.
    // If insufficient, call faucet (MockUSDT faucet gives 1000 -> might need repeat)
    const tx = await usdt.faucet();
    await tx.wait();
    console.log("   ✅ Faucet Called");
  }

  // 5. Approve (Authorize USDT Usage)
  console.log("\n🔓 Approving USDT...");
  const approveTx = await usdt.approve(exchanger.address, buyAmountUSDT);
  await approveTx.wait();
  console.log("   ✅ Approved");

  // 6. [BUY] Execute Gold Buy
  console.log(`\n🛒 Buying 20 ArkGold...`);
  const buyTx = await exchanger.buyGold(buyAmountUSDT, 0); // minOut 0 (Test)
  console.log(`   Tx Hash: ${buyTx.hash}`);
  await buyTx.wait();
  console.log("   ✅ Buy Confirmed!");

  // Check Balance
  const goldBalance = await arkGold.balanceOf(deployer.address);
  console.log(`   🦁 ArkGold Balance: ${ethers.utils.formatUnits(goldBalance, 18)} Oz`);

  // 7. [SELL] Execute Gold Sell
  console.log(`\n📉 Selling 20 ArkGold...`);
  // ArkGold does not need separate Approve as Exchanger has Burner Role (Code logic)
  
  const sellTx = await exchanger.sellGold(targetGoldAmount, 0); // minOut 0 (Test)
  console.log(`   Tx Hash: ${sellTx.hash}`);
  await sellTx.wait();
  console.log("   ✅ Sell Confirmed!");

  // Check Final Balance
  const finalGoldBalance = await arkGold.balanceOf(deployer.address);
  const finalUsdtBalance = await usdt.balanceOf(deployer.address);

  console.log("\n🎉 Test Finished!");
  console.log(`   Final ArkGold: ${ethers.utils.formatUnits(finalGoldBalance, 18)} Oz`);
  console.log(`   Final USDT: ${ethers.utils.formatUnits(finalUsdtBalance, 6)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});