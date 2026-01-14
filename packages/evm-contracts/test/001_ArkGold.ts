import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("ArkGold RWA Protocol Complete Test", function () {
  
  async function deployProtocolFixture() {
    const [deployer, user1, user2] = await ethers.getSigners();

    // 1. Mock Tokens & Oracle
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();
    await usdt.deployed(); 

    const MockOracle = await ethers.getContractFactory("MockV3Aggregator");
    // $100/g (8 decimals)
    const oracle = await MockOracle.deploy(8, "10000000000"); 
    await oracle.deployed();

    // 2. Assets
    const ArkGold = await ethers.getContractFactory("ArkGold");
    const arkGold = await ArkGold.deploy();
    await arkGold.deployed();

    const ArkGoldNFT = await ethers.getContractFactory("ArkGoldNFT1155");
    const nft = await ArkGoldNFT.deploy();
    await nft.deployed();

    // 3. Vaults
    const USDTVault = await ethers.getContractFactory("USDTVault");
    const usdtVault = await USDTVault.deploy(usdt.address);
    await usdtVault.deployed();

    const GoldVault = await ethers.getContractFactory("GoldVault");
    const goldVault = await GoldVault.deploy(nft.address);
    await goldVault.deployed();

    // 4. Exchanger
    const Exchanger = await ethers.getContractFactory("ArkGoldExchanger");
    const exchanger = await Exchanger.deploy(
      arkGold.address,
      usdt.address,
      usdtVault.address,
      goldVault.address,
      oracle.address
    );
    await exchanger.deployed();

    // --- Wiring ---
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
    await nft.grantRole(NFT_BURNER_ROLE, deployer.address);

    // [수정] Initial USDT: $200,000 (1kg 살 돈은 있어야 함)
    const initialUsdtBalance = ethers.utils.parseUnits("200000", 6);
    await usdt.transfer(user1.address, initialUsdtBalance);
    await usdt.connect(user1).approve(exchanger.address, ethers.constants.MaxUint256);

    return { usdt, oracle, arkGold, nft, usdtVault, goldVault, exchanger, deployer, user1, user2 };
  }

  // 1. GoldVault Test
  describe("GoldVault & Hybrid PoR Logic", function () {
    it("Should update reserve automatically when NFT is deposited", async function () {
      const { goldVault, nft, deployer } = await loadFixture(deployProtocolFixture);
      
      const weight = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 1, weight, "SERIAL-001");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 1, 1, "0x");

      expect(await goldVault.totalNftWeight()).to.equal(weight);
      expect(await goldVault.getReserve()).to.equal(weight);
    });

    it("Hybrid PoR: Should use the lower value (Circuit Breaker)", async function () {
      const { goldVault, nft, deployer } = await loadFixture(deployProtocolFixture);

      const weight = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 1, weight, "S-1");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 1, 1, "0x");
      
      expect(await goldVault.getReserve()).to.equal(weight);

      await goldVault.updateAuditedReserve(0);
      expect(await goldVault.getReserve()).to.equal(0);

      await goldVault.updateAuditedReserve(weight);
      expect(await goldVault.getReserve()).to.equal(weight);
    });
  });

  // 2. Buy Gold
  describe("Buy Gold", function () {
    it("Should buy gold correctly with 6-decimal USDT", async function () {
      const { exchanger, arkGold, usdt, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

      const weight = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 1, weight, "S-1");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 1, 1, "0x");

      const usdtAmount = ethers.utils.parseUnits("100", 6); // $100 -> 1g
      
      await expect(exchanger.connect(user1).buyGold(usdtAmount, 0))
        .to.emit(exchanger, "GoldBought")
        .withArgs(user1.address, usdtAmount, ethers.utils.parseUnits("1", 18));

      expect(await arkGold.balanceOf(user1.address)).to.equal(ethers.utils.parseUnits("1", 18));
    });

    it("Should revert if reserve is insufficient (PoR Check)", async function () {
      const { exchanger, user1 } = await loadFixture(deployProtocolFixture);
      const usdtAmount = ethers.utils.parseUnits("100", 6);
      await expect(exchanger.connect(user1).buyGold(usdtAmount, 0)).to.be.revertedWith("PoR Failed: Reserve Low");
    });
  });

  // 3. Sell Gold
  describe("Sell Gold", function () {
    it("Should sell gold correctly and receive USDT", async function () {
      const { exchanger, arkGold, usdt, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

      const weight = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 1, weight, "S-1");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 1, 1, "0x");
      
      await exchanger.connect(user1).buyGold(ethers.utils.parseUnits("1000", 6), 0);

      const sellAmount = ethers.utils.parseUnits("5", 18);
      await expect(exchanger.connect(user1).sellGold(sellAmount, 0))
        .to.emit(exchanger, "GoldSold")
        .withArgs(user1.address, sellAmount, ethers.utils.parseUnits("500", 6));

      expect(await arkGold.balanceOf(user1.address)).to.equal(ethers.utils.parseUnits("5", 18));
      expect(await usdt.balanceOf(user1.address)).to.equal(ethers.utils.parseUnits("199500", 6)); // 200,000 - 1000 + 500
    });
  });

  // 4. Redeem Gold
  describe("Redeem Gold", function () {
    it("Should redeem physical NFT by burning tokens", async function () {
      const { exchanger, arkGold, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

      const weight = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 777, weight, "KGE-BAR-777");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 777, 1, "0x");

      // [수정] 1kg(1000g)를 사려면 $100,000이 필요함 (1g=$100)
      // 이전 코드: 1000 (1000달러) -> 10g 밖에 안 됨
      // 수정 코드: 100000 (10만 달러) -> 1000g 구매 완료
      await exchanger.connect(user1).buyGold(ethers.utils.parseUnits("100000", 6), 0);
      
      // 이제 토큰 1000g이 있으므로 인출 가능
      await expect(exchanger.connect(user1).redeemGold(777))
        .to.emit(exchanger, "GoldRedeemed")
        .withArgs(user1.address, 777);

      expect(await arkGold.balanceOf(user1.address)).to.equal(0);
      expect(await nft.balanceOf(user1.address, 777)).to.equal(1);
      expect(await goldVault.totalNftWeight()).to.equal(0);
    });

    it("Should revert redeem if user has insufficient tokens", async function () {
      const { exchanger, goldVault, nft, deployer, user1 } = await loadFixture(deployProtocolFixture);

      const weight = ethers.utils.parseUnits("1000", 18);
      await nft.mint(deployer.address, 888, weight, "BAR-888");
      await nft.safeTransferFrom(deployer.address, goldVault.address, 888, 1, "0x");
      
      // 500g만 구매 ($50,000)
      await exchanger.connect(user1).buyGold(ethers.utils.parseUnits("50000", 6), 0);

      // 1000g 인출 시도 -> 실패
      await expect(exchanger.connect(user1).redeemGold(888)).to.be.reverted; 
    });
  });

  // 5. Security
  describe("Security & Pausable", function () {
    it("Should pause and block trades", async function () {
      const { exchanger, deployer, user1 } = await loadFixture(deployProtocolFixture);
      await exchanger.connect(deployer).pause();
      await expect(exchanger.connect(user1).buyGold(100, 0)).to.be.reverted; 
    });

    it("Should only allow Owner to pause", async function () {
        const { exchanger, user1 } = await loadFixture(deployProtocolFixture);
        await expect(exchanger.connect(user1).pause()).to.be.reverted;
    });
  });

  // ----------------------------------------------------------------
  // 7. Deployment Validations (Zero Address Check)
  // ----------------------------------------------------------------
  describe("Deployment Validations", function () {
    it("Should revert if deployed with zero address", async function () {
      const { arkGold, usdt, usdtVault, goldVault, oracle } = await loadFixture(deployProtocolFixture);
      const Exchanger = await ethers.getContractFactory("ArkGoldExchanger");

      // 1. RWA Token이 0 주소일 때
      await expect(
        Exchanger.deploy(
          ethers.constants.AddressZero, // Error here
          usdt.address,
          usdtVault.address,
          goldVault.address,
          oracle.address
        )
      ).to.be.revertedWithCustomError(Exchanger, "ZeroAddress");

      // 2. USDT가 0 주소일 때
      await expect(
        Exchanger.deploy(
          arkGold.address,
          ethers.constants.AddressZero, // Error here
          usdtVault.address,
          goldVault.address,
          oracle.address
        )
      ).to.be.revertedWithCustomError(Exchanger, "ZeroAddress");
    });
  });

  // ----------------------------------------------------------------
  // 8. Access Control (Hacker Checks)
  // ----------------------------------------------------------------
  describe("Access Control & Security", function () {
    it("Hacker should NOT be able to mint ArkGold directly", async function () {
      const { arkGold, user2 } = await loadFixture(deployProtocolFixture);
      
      // User2(해커)가 직접 mint 호출 시도 -> 권한 없음 에러
      await expect(
        arkGold.connect(user2).mint(user2.address, 1000)
      ).to.be.reverted; // AccessControl 에러
    });

    it("Hacker should NOT be able to withdraw from Vaults", async function () {
      const { usdtVault, goldVault, user2 } = await loadFixture(deployProtocolFixture);

      // USDT 금고 털기 시도
      await expect(
        usdtVault.connect(user2).withdraw(user2.address, 1000)
      ).to.be.reverted;

      // Gold 금고 털기 시도
      await expect(
        goldVault.connect(user2).withdrawCollateral(user2.address, 1)
      ).to.be.reverted;
    });

    it("Vault should reject Fake NFTs", async function () {
      const { goldVault, deployer } = await loadFixture(deployProtocolFixture);

      // 1. 가짜 NFT 컨트랙트 배포
      const FakeNFT = await ethers.getContractFactory("ArkGoldNFT1155");
      const fakeNft = await FakeNFT.deploy();
      await fakeNft.deployed();

      // 2. 가짜 NFT 민팅
      await fakeNft.mint(deployer.address, 999, ethers.utils.parseUnits("1000", 18), "FAKE");
      
      // 3. GoldVault로 전송 시도 -> onERC1155Received에서 막혀야 함 ("Only ArkGoldNFT allowed")
      await expect(
        fakeNft.safeTransferFrom(deployer.address, goldVault.address, 999, 1, "0x")
      ).to.be.revertedWith("Only ArkGoldNFT allowed");
    });
  });

  // ----------------------------------------------------------------
  // 9. Edge Cases (Invalid Inputs)
  // ----------------------------------------------------------------
  describe("Edge Cases", function () {
    it("Should revert when buying with 0 amount", async function () {
        const { exchanger, user1 } = await loadFixture(deployProtocolFixture);
        // 0 USDT로 구매 시도 -> 계산 결과 0 -> Slippage 등에서 걸리거나 0 transfer 등
        // 우리 로직상: goldAmount = 0 -> Slippage Check에서 막힐 가능성 큼
        await expect(
            exchanger.connect(user1).buyGold(0, 0)
        ).to.be.revertedWithCustomError(exchanger, "ZeroAmount");
    });

    it("Should revert if price is zero or negative (Oracle Fail)", async function () {
        // Oracle Mock을 새로 배포해서 가격을 0으로 설정해봄
        const { exchanger, oracle, user1 } = await loadFixture(deployProtocolFixture);
        
        // 오라클 가격을 0으로 변경
        await oracle.updateAnswer(0);

        // 구매 시도 -> Exchanger의 require(pricePerGram > 0)에 걸려야 함
        await expect(
            exchanger.connect(user1).buyGold(1000, 0)
        ).to.be.revertedWithCustomError(exchanger, "InvalidPrice");
    });
  });
});