import { ethers, run, network } from "hardhat";
import { prompt } from "prompts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);


    const { isDeploy } = await prompt([
    {
      type: "confirm",
      name: "isDeploy",
      message: `Deploying ArkGold Contract Set
      🔱 with the account: ${await deployer.getAddress()}
      Running on network: ${network.name}
      Do you continue?`,
    },
  ]);

  if (!isDeploy) {
    return;
  }

  // ------------------------------------------------------
  // 1. (Deploy Phase)
  // ------------------------------------------------------

  // 1-1. Mock
  console.log(" Deploying Mocks...");
  
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.deployed(); 
  console.log(" - MockUSDT Deployed:", usdt.address); 

  const oraclePrice = "462230000000";
  const MockOracle = await ethers.getContractFactory("MockV3Aggregator");
  const oracle = await MockOracle.deploy(8, oraclePrice); 
  await oracle.deployed();
  console.log(" - MockOracle Deployed:", oracle.address);


  console.log(" Deploying Assets... ");

  const ArkGold = await ethers.getContractFactory("ArkGold");
  const arkGold = await ArkGold.deploy();
  await arkGold.deployed();
  console.log(" - ArkGold (Token):", arkGold.address);

  const ArkGoldNFT = await ethers.getContractFactory("ArkGoldNFT1155");
  const nft = await ArkGoldNFT.deploy();
  await nft.deployed();
  console.log(" - ArkGoldNFT (1155):", nft.address);


  console.log("\n3️⃣  Deploying Vaults...");

  const USDTVault = await ethers.getContractFactory("USDTVault");
  const usdtVault = await USDTVault.deploy(usdt.address);
  await usdtVault.deployed();
  console.log(" - USDTVault:", usdtVault.address);

  const GoldVault = await ethers.getContractFactory("GoldVault");
  const goldVault = await GoldVault.deploy(nft.address);
  await goldVault.deployed();
  console.log(" - GoldVault:", goldVault.address);

  // 1-4. Exchanger
  console.log("\n4️⃣  Deploying Exchanger...");

  const ArkGoldExchanger = await ethers.getContractFactory("ArkGoldExchanger");
  const exchanger = await ArkGoldExchanger.deploy(
    arkGold.address,
    usdt.address,
    usdtVault.address,
    goldVault.address,
    oracle.address
  );
  await exchanger.deployed();
  console.log(" - ArkGoldExchanger:", exchanger.address);

  // ------------------------------------------------------
  // 2. Wiring 
  // ------------------------------------------------------
  console.log("\n5️⃣  Setting up Permissions (Wiring)...");

  const MINTER_ROLE = await arkGold.MINTER_ROLE();
  const BURNER_ROLE = await arkGold.BURNER_ROLE();
  const EXCHANGER_ROLE = await usdtVault.EXCHANGER_ROLE();
  const DEFAULT_ADMIN_ROLE = await goldVault.DEFAULT_ADMIN_ROLE();

  // A. ArkGold grant to Exchanger(Mint / Burn)
  let tx = await arkGold.grantRole(MINTER_ROLE, exchanger.address);
  await tx.wait();
  tx = await arkGold.grantRole(BURNER_ROLE, exchanger.address);
  await tx.wait();
  console.log(" ✅ ArkGold: Minter/Burner role granted to Exchanger");

  // B. USDT Vault grant to Exchanger
  tx = await usdtVault.grantRole(EXCHANGER_ROLE, exchanger.address);
  await tx.wait();
  console.log(" ✅ USDTVault: Exchanger role granted to Exchanger");

  // C. Gold Vault grant to Exchanger
  tx = await goldVault.grantRole(DEFAULT_ADMIN_ROLE, exchanger.address);
  await tx.wait();
  console.log(" ✅ GoldVault: Admin role granted to Exchanger");

  const NFT_MINTER_ROLE = await nft.MINTER_ROLE();
  await nft.grantRole(NFT_MINTER_ROLE, deployer.address);

  console.log("\n🎉 All Done! ArkGold System is ready on", (await ethers.provider.getNetwork()).name);

  // ------------------------------------------------------
  // 3. 초기 세팅 (Initial Liquidity)
  // ------------------------------------------------------
  console.log("\n💧 Minting Initial Gold (1kg)...");
  // 1kg 바 (1000g)
  const weight1kg = ethers.utils.parseUnits("1000", 18);
  await nft.mint(deployer.address, 1, weight1kg, "GENESIS-BAR-1KG");
  // 금고로 전송
  await nft.safeTransferFrom(deployer.address, goldVault.address, 1, 1, "0x");
  console.log("✅ Initial 1kg Gold Deposited into Vault!");

  // ------------------------------------------------------
  // 4. 검증 (Verification)
  // ------------------------------------------------------
  console.log("\n⏳ Waiting for block confirmations before verification...");
  // Mantle은 빠르지만, Explorer 인덱싱을 위해 15~30초 대기 추천
  await delay(20000); 

  console.log("🔍 Starting Verification...");

  const verify = async (address: string, args: any[]) => {
    try {
      await run("verify:verify", {
        address: address,
        constructorArguments: args,
      });
    } catch (e: any) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log(`   ${address} is already verified.`);
      } else {
        console.log(`   Error verifying ${address}:`, e.message);
      }
    }
  };

  await verify(usdt.address, []);
  await verify(oracle.address, [8, oraclePrice]);
  await verify(arkGold.address, []);
  await verify(nft.address, []);
  await verify(usdtVault.address, [usdt.address]);
  await verify(goldVault.address, [nft.address]);
  await verify(exchanger.address, [
    arkGold.address,
    usdt.address,
    usdtVault.address,
    goldVault.address,
    oracle.address,
  ]);

  console.log("\n🎉 Deployment & Verification Finished!");
  console.table({
    MockUSDT: usdt.address,
    MockOracle: oracle.address,
    ArkGold: arkGold.address,
    ArkGoldNFT: nft.address,
    USDTVault: usdtVault.address,
    GoldVault: goldVault.address,
    Exchanger: exchanger.address,
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/** Deployed Information
 * 
 * Deploying contracts with account: 0xEeFE0C690aF97991a48118521D16B7f9aB472752
✔ Deploying ArkGold Contract Set
      🔱 with the account: 0xEeFE0C690aF97991a48118521D16B7f9aB472752
      Running on network: mantleSepolia
      Do you continue? … yes
 Deploying Mocks...
 - MockUSDT Deployed: 0x2a0DC6c51641A55fa464d6D369e0C72337bC5099
 - MockOracle Deployed: 0xeaeAd465b128692c84c1A3B3913CCc6d8ee0efB7
 Deploying Assets... 
 - ArkGold (Token): 0x3076e90edF9E67D030E66a15Ec3F133f865a9611
 - ArkGoldNFT (1155): 0x29CFCF5B9653afB2Bbda52923a773d9967377291

3️⃣  Deploying Vaults...
 - USDTVault: 0x4a34c46273fa4351C5c25895c34662BAD96eFa30
 - GoldVault: 0xC72e70CDF0442FfBc037E33EeaDB84Cb7db5a0AE

4️⃣  Deploying Exchanger...
 - ArkGoldExchanger: 0x211EfA007348bC841857386Fa4D98368AA4B30Ec

5️⃣  Setting up Permissions (Wiring)...
 ✅ ArkGold: Minter/Burner role granted to Exchanger
 ✅ USDTVault: Exchanger role granted to Exchanger
 ✅ GoldVault: Admin role granted to Exchanger

🎉 All Done! ArkGold System is ready on unknown

💧 Minting Initial Gold (1kg)...
✅ Initial 1kg Gold Deposited into Vault!

⏳ Waiting for block confirmations before verification...
🔍 Starting Verification...
Successfully submitted source code for contract
contracts/stable-coin/MockUSDT.sol:MockUSDT at 0x2a0DC6c51641A55fa464d6D369e0C72337bC5099
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MockUSDT on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0x2a0DC6c51641A55fa464d6D369e0C72337bC5099#code

Successfully submitted source code for contract
contracts/oracle/MockV3Aggregator.sol:MockV3Aggregator at 0xeaeAd465b128692c84c1A3B3913CCc6d8ee0efB7
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MockV3Aggregator on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0xeaeAd465b128692c84c1A3B3913CCc6d8ee0efB7#code

Successfully submitted source code for contract
contracts/ark-gold/ArkGold.sol:ArkGold at 0x3076e90edF9E67D030E66a15Ec3F133f865a9611
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ArkGold on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0x3076e90edF9E67D030E66a15Ec3F133f865a9611#code

Successfully submitted source code for contract
contracts/ark-gold/ArkGoldNFT1155.sol:ArkGoldNFT1155 at 0x29CFCF5B9653afB2Bbda52923a773d9967377291
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ArkGoldNFT1155 on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0x29CFCF5B9653afB2Bbda52923a773d9967377291#code

Successfully submitted source code for contract
contracts/vault/USDTVault.sol:USDTVault at 0x4a34c46273fa4351C5c25895c34662BAD96eFa30
for verification on the block explorer. Waiting for verification result...

Successfully verified contract USDTVault on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0x4a34c46273fa4351C5c25895c34662BAD96eFa30#code

Successfully submitted source code for contract
contracts/vault/GoldVault.sol:GoldVault at 0xC72e70CDF0442FfBc037E33EeaDB84Cb7db5a0AE
for verification on the block explorer. Waiting for verification result...

Successfully verified contract GoldVault on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0xC72e70CDF0442FfBc037E33EeaDB84Cb7db5a0AE#code

Successfully submitted source code for contract
contracts/ark-gold/ArkGoldExchanger.sol:ArkGoldExchanger at 0x211EfA007348bC841857386Fa4D98368AA4B30Ec
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ArkGoldExchanger on the block explorer.
https://explorer.sepolia.mantle.xyz/address/0x211EfA007348bC841857386Fa4D98368AA4B30Ec#code


🎉 Deployment & Verification Finished!
┌────────────┬──────────────────────────────────────────────┐
│  (index)   │                    Values                    │
├────────────┼──────────────────────────────────────────────┤
│  MockUSDT  │ '0x2a0DC6c51641A55fa464d6D369e0C72337bC5099' │
│ MockOracle │ '0xeaeAd465b128692c84c1A3B3913CCc6d8ee0efB7' │
│  ArkGold   │ '0x3076e90edF9E67D030E66a15Ec3F133f865a9611' │
│ ArkGoldNFT │ '0x29CFCF5B9653afB2Bbda52923a773d9967377291' │
│ USDTVault  │ '0x4a34c46273fa4351C5c25895c34662BAD96eFa30' │
│ GoldVault  │ '0xC72e70CDF0442FfBc037E33EeaDB84Cb7db5a0AE' │
│ Exchanger  │ '0x211EfA007348bC841857386Fa4D98368AA4B30Ec' │
└────────────┴──────────────────────────────────────────────┘
 */