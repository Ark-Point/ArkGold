// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IMintableBurnable.sol";
import "../oracle/interfaces/AggregatorV3Interface.sol";
import "../vault/USDTVault.sol";
import "../vault/GoldVault.sol";
import "../ark-gold/interfaces/IArkGoldNFT1155.sol";
import "../stable-coin/MockUSDT.sol";

contract ArkGoldExchanger is Ownable, ReentrancyGuard, Pausable {
    IMintableBurnable public rwaToken; 
    IERC20 public usdtToken;
    USDTVault public usdtVault;
    GoldVault public goldVault;
    AggregatorV3Interface public priceFeed;

    event GoldBought(address indexed user, uint256 usdtAmount, uint256 goldAmount);
    event GoldSold(address indexed user, uint256 goldAmount, uint256 usdtAmount);
    event GoldRedeemed(address indexed user, uint256 tokenId);

    error ZeroAddress();
    error ZeroAmount();
    error InvalidPrice();
    error SlippageExceeded();

    constructor(
        address _rwa, 
        address _usdt, 
        address _usdtVault, 
        address _goldVault, 
        address _priceFeed
    ) Ownable(msg.sender) {
        if(_rwa == address(0)) revert ZeroAddress();
        if(_usdt == address(0)) revert ZeroAddress();
        if(_usdtVault == address(0)) revert ZeroAddress();
        if(_goldVault == address(0)) revert ZeroAddress();
        if(_priceFeed == address(0)) revert ZeroAddress();

        rwaToken = IMintableBurnable(_rwa); // 형변환
        usdtToken = IERC20(_usdt);
        usdtVault = USDTVault(_usdtVault);
        goldVault = GoldVault(_goldVault);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // 가격 조회 (18 decimals 변환)
    function getGoldPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        return uint256(price) * (10 ** (18 - decimals));
    }

    // [BUY] USDT -> Gold Token
    function buyGold(uint256 usdtAmount, uint256 minGoldOut) external nonReentrant whenNotPaused {
        if (usdtAmount == 0) revert ZeroAmount();

        uint256 pricePerGram = getGoldPrice();
        if(pricePerGram == 0) revert InvalidPrice();

        uint256 usdtAmount18 = usdtAmount * 1e12; 
        
        uint256 goldAmount = (usdtAmount18 * 1e18) / pricePerGram;
        
        if(goldAmount < minGoldOut) revert SlippageExceeded();

        require(rwaToken.totalSupply() + goldAmount <= goldVault.getReserve(), "PoR Failed: Reserve Low");

        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "USDT Transfer Failed");
        usdtToken.approve(address(usdtVault), usdtAmount);
        usdtVault.deposit(usdtAmount);

        rwaToken.mint(msg.sender, goldAmount);

        emit GoldBought(msg.sender, usdtAmount, goldAmount);
    }

    // [SELL] Gold Token -> USDT
    function sellGold(uint256 goldAmount, uint256 minUsdtOut) external nonReentrant whenNotPaused {
        if (goldAmount == 0) revert ZeroAmount();

        uint256 pricePerGram = getGoldPrice();
        uint256 usdtValue18 = (goldAmount * pricePerGram) / 1e18;
        
        uint256 usdtAmount = usdtValue18 / 1e12;

        if(usdtAmount < minUsdtOut) revert SlippageExceeded();

        // 토큰 소각 (인터페이스 호출)
        rwaToken.burn(msg.sender, goldAmount);
        
        // 자금 인출
        usdtVault.withdraw(msg.sender, usdtAmount);
        emit GoldSold(msg.sender, goldAmount, usdtAmount);

    }

    // [REDEEM] Gold Token -> Physical NFT
    function redeemGold(uint256 tokenId) external nonReentrant whenNotPaused {
        // 1. NFT 무게 조회 (Vault 통해 확인)
        IArkGoldNFT1155 nft = goldVault.nftContract();
        uint256 weight = nft.getWeight(tokenId);
        require(weight > 0, "Invalid Token ID");

        // 2. 무게만큼 토큰 소각 (잔고 부족 시 자동 Revert)
        rwaToken.burn(msg.sender, weight);

        // 3. NFT 실물 인출 (Exchanger가 Vault 권한 필요)
        goldVault.withdrawCollateral(msg.sender, tokenId);

        emit GoldRedeemed(msg.sender, tokenId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}