import { ethers, network } from "hardhat";

const ADDRESS = {
  MockUSDT: "0x8AcE21fFcaD3C88BeD80F9eD87A6639A1830EE33",
  ArkGoldExchanger: "0x716e73639aA52C529f9DB16d383f27803f1fa7A5",
  ArkGold: "0x5Cdc260886b73b54F18088726e1AB9072A21a5e0",
  ArkGoldNFT: "0x94e5294E7a514cC1B088233eFe7AFF8BA59dB8Dd",
  GoldVault: "0xdA8B9dB5d176dFcc355027273436a53A8Fad388e",
};

async function main() {
  console.log(`\n🚀 Starting Full Lifecycle Test (Buy -> Sell -> Redeem) on ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`👤 User (Deployer): ${deployer.address}`);

  const usdt = await ethers.getContractAt("MockUSDT", ADDRESS.MockUSDT);
  const exchanger = await ethers.getContractAt("ArkGoldExchanger", ADDRESS.ArkGoldExchanger);
  const arkGold = await ethers.getContractAt("ArkGold", ADDRESS.ArkGold);
  const nft = await ethers.getContractAt("ArkGoldNFT1155", ADDRESS.ArkGoldNFT);
  const vault = await ethers.getContractAt("GoldVault", ADDRESS.GoldVault);

  console.log("\n📦 [STEP 1] Admin: Mint & Deposit Gold Bar");
  
  const TOKEN_ID = 777;
  const WEIGHT_G = ethers.utils.parseUnits("37.5", 18); // 37.5g 
  
  // Mint
  try {
    const tx = await nft.mint(deployer.address, TOKEN_ID, WEIGHT_G, "TEST-BAR-10DON");
    await tx.wait();
    console.log(`   ✅ Minted NFT #${TOKEN_ID} (37.5g)`);
  } catch (e) {
    console.log(`   ℹ️ NFT #${TOKEN_ID} might already exist. Skipping mint.`);
  }

  // Deposit to Vault 
  const ownerOfNft = await nft.balanceOf(ADDRESS.GoldVault, TOKEN_ID);
  if (ownerOfNft.eq(0)) {
    console.log("   🚚 Transferring NFT to Vault...");
    const tx = await nft.safeTransferFrom(deployer.address, ADDRESS.GoldVault, TOKEN_ID, 1, "0x");
    await tx.wait();
    console.log("   ✅ Deposited to Vault");
  } else {
    console.log("   ✅ NFT is already in Vault");
  }

  // reserve check
  const inventory = await vault.getAvailableTokenIds();
  console.log(`   🏦 Vault Inventory IDs: [${inventory.join(", ")}]`);

  console.log("\n💰 [STEP 2] User: Prepare & Buy Gold");

  const pricePerOunce = await exchanger.getGoldPrice();
  console.log(`   📊 Gold Price: $${ethers.utils.formatUnits(pricePerOunce, 18)} / Oz`);

  // 37.5g -> 1.205 Oz
  const requiredOz = await exchanger.previewRedeem(TOKEN_ID);
  console.log(`   ⚖️ Required for Redeem: ${ethers.utils.formatUnits(requiredOz, 18)} AGLD`);

  // redeem required amount + 0.5 Oz (test sell amount)
  const bufferOz = ethers.utils.parseUnits("0.5", 18);
  const buyAmountOz = requiredOz.add(bufferOz);

  // Cost = (BuyAmountOz * Price) / 1e18 / 1e12
  const costUSDT = buyAmountOz.mul(pricePerOunce).div(ethers.utils.parseUnits("1", 30));
  const safeCostUSDT = costUSDT.add(ethers.utils.parseUnits("2", 6));

  console.log(`   🛒 Buying: ${ethers.utils.formatUnits(buyAmountOz, 18)} AGLD`);
  console.log(`   💵 Est. Cost: ${ethers.utils.formatUnits(safeCostUSDT, 6)} USDT`);

  // 2-4. USDT Approve
  const allowance = await usdt.allowance(deployer.address, ADDRESS.ArkGoldExchanger);
  if (allowance.lt(safeCostUSDT)) {
    const tx = await usdt.approve(ADDRESS.ArkGoldExchanger, ethers.constants.MaxUint256);
    await tx.wait();
    console.log("   ✅ USDT Approved");
  }

  const bal = await usdt.balanceOf(deployer.address);
  if(bal.lt(safeCostUSDT)) {
      await (await usdt.faucet()).wait();
      console.log("   💧 Faucet used");
  }

  const buyTx = await exchanger.buyGold(safeCostUSDT, 0);
  await buyTx.wait();
  console.log("   ✅ Buy Confirmed!");

  console.log("\n📉 [STEP 3] User: Sell Partial Gold (Test)");
  
  // sell 0.4 oz
  const sellAmountOz = ethers.utils.parseUnits("0.4", 18);
  
  const sellTx = await exchanger.sellGold(sellAmountOz, 0);
  await sellTx.wait();
  console.log(`   ✅ Sold ${ethers.utils.formatUnits(sellAmountOz, 18)} AGLD`);

  const currentAgldBal = await arkGold.balanceOf(deployer.address);
  console.log(`   🦁 Current Balance: ${ethers.utils.formatUnits(currentAgldBal, 18)} AGLD`);
  
  if (currentAgldBal.lt(requiredOz)) {
    console.error("   ❌ Not enough AGLD for redeem! Something went wrong with calculation.");
    return;
  }

  console.log("\n🎁 [STEP 4] User: Redeem Physical Gold (NFT)");

  console.log(`   🔥 Redeeming NFT #${TOKEN_ID}...`);
  const redeemTx = await exchanger.redeemGold(TOKEN_ID);
  await redeemTx.wait();
  console.log("   ✅ Redeem Transaction Confirmed!");

  console.log("\n🔍 [STEP 5] Verification");

  const userNftBal = await nft.balanceOf(deployer.address, TOKEN_ID);
  const vaultNftBal = await nft.balanceOf(ADDRESS.GoldVault, TOKEN_ID);

  if (userNftBal.eq(1) && vaultNftBal.eq(0)) {
    console.log("   ✅ SUCCESS: User owns the NFT, Vault is empty.");
  } else {
    console.log("   ❌ FAILURE: NFT ownership mismatch.");
    console.log(`      User: ${userNftBal}, Vault: ${vaultNftBal}`);
  }


  const finalAgldBal = await arkGold.balanceOf(deployer.address);
  console.log(`   🦁 Final AGLD Balance: ${ethers.utils.formatUnits(finalAgldBal, 18)} (Should be near 0.1)`);
  
  console.log("\n🎉 Full Lifecycle Test Complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});