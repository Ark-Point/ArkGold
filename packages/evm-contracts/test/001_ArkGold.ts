import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ArkGold RWA Protocol Real-World Price Test", function () {
  
  // 1 Troy Ounce = 31.1034768 g
  const GRAMS_PER_OUNCE = ethers.utils.parseUnits("31.1034768", 18);

  async function deployProtocolFixture() {
    const [deployer, user1, user2] = await ethers.getSigners();

    // ------------------------------------------------------
    // 1. Deply & Set up 
    // ------------------------------------------------------

    // A. Mock USDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();
    await usdt.deployed(); 

    // B. Mock Oracle
    // Current PAXG - USD Price : $4,622.30 / oz
    // Chainlink use 8 decimals : 4622.30 * 10^8 = 462230000000
    const ORACLE_PRICE = "462230000000";
    const MockOracle = await ethers.getContractFactory("MockV3Aggregator");
    const oracle = await MockOracle.deploy(8, ORACLE_PRICE); 
    await oracle.deployed();

    // C. (Token, NFT)
    const ArkGold = await ethers.getContractFactory("ArkGold");
    const arkGold = await ArkGold.deploy();
    await arkGold.deployed();

    const ArkGoldNFT = await ethers.getContractFactory("ArkGoldNFT1155");
    const nft = await ArkGoldNFT.deploy();
    await nft.deployed();

    // D. (Vaults)
    const USDTVault = await ethers.getContractFactory("USDTVault");
    const usdtVault = await USDTVault.deploy(usdt.address);
    await usdtVault.deployed();

    const GoldVault = await ethers.getContractFactory("GoldVault");
    const goldVault = await GoldVault.deploy(nft.address);
    await goldVault.deployed();

    // E. (Exchanger)
    const Exchanger = await ethers.getContractFactory("ArkGoldExchanger");
    const exchanger = await Exchanger.deploy(
      arkGold.address,
      usdt.address,
      usdtVault.address,
      goldVault.address,
      oracle.address
    );
    await exchanger.deployed();

    // ------------------------------------------------------
    // 2. Wiring
    // ------------------------------------------------------
    const MINTER_ROLE = await arkGold.MINTER_ROLE();
    const BURNER_ROLE = await arkGold.BURNER_ROLE();
    await arkGold.grantRole(MINTER_ROLE, exchanger.address);
    await arkGold.grantRole(BURNER_ROLE, exchanger.address);

    const EXCHANGER_ROLE = await usdtVault.EXCHANGER_ROLE();
    await usdtVault.grantRole(EXCHANGER_ROLE, exchanger.address);

    const DEFAULT_ADMIN_ROLE = await goldVault.DEFAULT_ADMIN_ROLE();
    const ORACLE_ROLE = await goldVault.ORACLE_ROLE();
    await goldVault.grantRole(DEFAULT_ADMIN_ROLE, exchanger.address);
    await goldVault.grantRole(ORACLE_ROLE, deployer.address);

    const NFT_MINTER_ROLE = await nft.MINTER_ROLE();
    const NFT_BURNER_ROLE = await nft.BURNER_ROLE();
    await nft.grantRole(NFT_MINTER_ROLE, deployer.address);

    // ------------------------------------------------------
    // 3. Initial set up  
    // ------------------------------------------------------
    // USDT airdrop to User1 ($200,000)
    // 1kg(약 32oz) =>  $150,000 required.
    const initialUsdtBalance = ethers.utils.parseUnits("200000", 6);
    await usdt.transfer(user1.address, initialUsdtBalance);
    await usdt.connect(user1).approve(exchanger.address, ethers.constants.MaxUint256);

    return { usdt, oracle, arkGold, nft, usdtVault, goldVault, exchanger, deployer, user1, user2 };
  }

  // ==============================================================================
  // Test Start 
  // ==============================================================================

  
  describe("GoldVault Inventory & PoR", function () {
    it("Should track available Token IDs correctly", async function () {
      const { goldVault, nft, deployer } = await loadFixture(deployProtocolFixture);
      
      // 100g gold nft mint(amount: 2) - (ID: 101, 102)
      // Input weight in grams (g): 100 * 10^18
      const weight100g = ethers.utils.parseUnits("100", 18);
      await nft.mint(deployer.address, 101, weight100g, "BAR-101");
      await nft.mint(deployer.address, 102, weight100g, "BAR-102");

      // Vault deposit
      await nft.safeTransferFrom(deployer.address, goldVault.address, 101, 1, "0x");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 102, 1, "0x");

      const inventory = await goldVault.getAvailableTokenIds();

      expect(inventory.length).to.equal(2);
      expect(inventory[0]).to.equal(101);
      expect(inventory[1]).to.equal(102);

      const totalWeight = await goldVault.totalNftWeight();
      expect(totalWeight).to.equal(ethers.utils.parseUnits("200", 18));
    });
  });

  
  describe("Buy Gold (Ounce Base)", function () {
    it("Should buy exactly 1 Ounce with $4,622.30", async function () {
      const { exchanger, arkGold, usdt, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

      
      const weight1kg = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 999, weight1kg, "BAR-1KG");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 999, 1, "0x");

      // Convert 4622.30 -> 6 decimals
      const usdtAmount = ethers.utils.parseUnits("4622.3", 6);
      
      await expect(exchanger.connect(user1).buyGold(usdtAmount, 0))
        .to.emit(exchanger, "GoldBought")
        .withArgs(user1.address, usdtAmount, ethers.utils.parseUnits("1", 18));

      expect(await arkGold.balanceOf(user1.address)).to.equal(ethers.utils.parseUnits("1", 18));
    });
  });

  describe("Sell Gold", function () {
    it("Should receive correct USDT when selling 0.1 Ounce", async function () {
        const { exchanger, usdt, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

        await nft.mint(deployer.address, 999, ethers.utils.parseUnits("1000", 18), "BAR-1KG");
        await nft.safeTransferFrom(deployer.address, goldVault.address, 999, 1, "0x");

        const buyAmount = ethers.utils.parseUnits("4622.3", 6);
        await exchanger.connect(user1).buyGold(buyAmount, 0);

        // $4,622.30 * 0.1 = $462.23
        const sellAmount = ethers.utils.parseUnits("0.1", 18);
        const expectedUsdt = ethers.utils.parseUnits("462.23", 6);

        await expect(exchanger.connect(user1).sellGold(sellAmount, 0))
            .to.emit(exchanger, "GoldSold")
            .withArgs(user1.address, sellAmount, expectedUsdt);
        
        // 200,000 - 4,622.30 + 462.23 = 195,839.93
        const finalBalance = await usdt.balanceOf(user1.address);
        expect(finalBalance).to.equal(ethers.utils.parseUnits("195839.93", 6));
    });
  });

  describe("Redeem Gold (Gram -> Ounce Conversion)", function () {
    
    it("Should calculate cost for 100g Bar correctly", async function () {
        const { exchanger, goldVault, nft, deployer, arkGold, user1 } = await loadFixture(deployProtocolFixture);

        await nft.mint(deployer.address, 999, ethers.utils.parseUnits("1000", 18), "LIQUIDITY-BAR");
        await nft.safeTransferFrom(deployer.address, goldVault.address, 999, 1, "0x");

        const weight100g = ethers.utils.parseUnits("100", 18);
        await nft.mint(deployer.address, 888, weight100g, "BAR-100G");
        await nft.safeTransferFrom(deployer.address, goldVault.address, 888, 1, "0x");

        // (100 * 1e18) / 31.1034768
        // about 3.21507 oz
        const expectedBurnAmount = weight100g.mul(ethers.utils.parseUnits("1", 18)).div(GRAMS_PER_OUNCE);
        
        const previewAmount = await exchanger.previewRedeem(888);
        expect(previewAmount).to.equal(expectedBurnAmount);

        // 3. ( user $15,000 buy -> 3.24 oz)
        await exchanger.connect(user1).buyGold(ethers.utils.parseUnits("15000", 6), 0);

        await expect(exchanger.connect(user1).redeemGold(888))
            .to.emit(exchanger, "GoldRedeemed")
            .withArgs(user1.address, 888, expectedBurnAmount);

        expect(await nft.balanceOf(user1.address, 888)).to.equal(1);
        const inventory = await goldVault.getAvailableTokenIds();
        expect(inventory).to.not.include(888);
    });

    it("Should allow redeeming 1 Don (3.75g)", async function () {
        const { exchanger, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

        await nft.mint(deployer.address, 999, ethers.utils.parseUnits("100", 18), "LIQUIDITY");
        await nft.safeTransferFrom(deployer.address, goldVault.address, 999, 1, "0x");

        const weight1Don = ethers.utils.parseUnits("3.75", 18);
        await nft.mint(deployer.address, 777, weight1Don, "DON-777");
        await nft.safeTransferFrom(deployer.address, goldVault.address, 777, 1, "0x");

        // 3.75 / 31.1034768... ≈ 0.120565 oz
        const expectedBurn = weight1Don.mul(ethers.utils.parseUnits("1", 18)).div(GRAMS_PER_OUNCE);

        // 3. ( user buy $600 -> 0.13 oz)
        await exchanger.connect(user1).buyGold(ethers.utils.parseUnits("600", 6), 0);

        await expect(exchanger.connect(user1).redeemGold(777))
            .to.emit(exchanger, "GoldRedeemed")
            .withArgs(user1.address, 777, expectedBurn);
    });
  });

  describe("Security Checks", function () {
    it("Hacker cannot withdraw collateral from GoldVault directly", async function () {
        const { goldVault, user2 } = await loadFixture(deployProtocolFixture);

        await expect(
            goldVault.connect(user2).withdrawCollateral(user2.address, 101)
        ).to.be.reverted; 
    });

    it("Hacker cannot mint ArkGold directly", async function () {
        const { arkGold, user2 } = await loadFixture(deployProtocolFixture);

        await expect(
            arkGold.connect(user2).mint(user2.address, 1000)
        ).to.be.reverted;
    });

    it("Should block functionality when paused", async function () {
      const { exchanger, deployer, user1 } = await loadFixture(deployProtocolFixture);

      await exchanger.connect(deployer).pause();

      await expect(
          exchanger.connect(user1).buyGold(100, 0)
      ).to.be.revertedWithCustomError(exchanger, "EnforcedPause")

      await expect(
          exchanger.connect(user1).redeemGold(101)
      ).to.be.revertedWithCustomError(exchanger, "EnforcedPause")
    });
  });

  describe("Edge Cases", function () {
    it("Should revert if price is zero (Oracle Fail)", async function () {
        const { exchanger, oracle, user1 } = await loadFixture(deployProtocolFixture);
        
        // Oracle price 0 ( Emergency )
        await oracle.updateAnswer(0);

        // try buy -> InvalidPrice Error occurred
        await expect(
            exchanger.connect(user1).buyGold(ethers.utils.parseUnits("1000", 6), 0)
        ).to.be.revertedWithCustomError(exchanger, "InvalidPrice");
    });

    it("Should fail if trying to redeem NFT not in Vault", async function () {
        const { exchanger, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);
        
        await nft.mint(deployer.address, 999, ethers.utils.parseUnits("10", 18), "NOT-IN-VAULT");

        await expect(
            exchanger.connect(user1).redeemGold(999)
        ).to.be.revertedWith("NFT not in Vault");
    });

    it("Should REVERT if user tries to send Batch NFTs (safeBatchTransferFrom)", async function () {
      const { goldVault, nft, deployer } = await loadFixture(deployProtocolFixture);
      
      await nft.mint(deployer.address, 1, 100, "B1");
      await nft.mint(deployer.address, 2, 100, "B2");

      await expect(
          nft.safeBatchTransferFrom(deployer.address, goldVault.address, [1, 2], [1, 1], "0x")
      ).to.be.revertedWith("Batch transfer not supported");
    });

    it("Should revert buyGold if slippage is exceeded", async function () {
      const { exchanger, user1 } = await loadFixture(deployProtocolFixture);
      
      const usdtAmount = ethers.utils.parseUnits("2000", 6);
      
      const tooHighMinAmount = ethers.utils.parseUnits("1.1", 18);

      await expect(
          exchanger.connect(user1).buyGold(usdtAmount, tooHighMinAmount)
      ).to.be.revertedWithCustomError(exchanger, "SlippageExceeded");
    });
  });
});