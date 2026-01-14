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

    // 1 Troy Ounce = 31.1034768 Grams (18 decimals Precision)
    uint256 public constant GRAMS_PER_OUNCE = 31103476800000000000; 

    event GoldBought(address indexed user, uint256 usdtAmount, uint256 goldAmount);
    event GoldSold(address indexed user, uint256 goldAmount, uint256 usdtAmount);
    event GoldRedeemed(address indexed user, uint256 tokenId, uint256 burnAmount);

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

        rwaToken = IMintableBurnable(_rwa);
        usdtToken = IERC20(_usdt);
        usdtVault = USDTVault(_usdtVault);
        goldVault = GoldVault(_goldVault);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    
    // Chainlink: XAU/USD (Per Ounce)
    function getGoldPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        
        if(price <= 0) revert InvalidPrice();

        uint8 decimals = priceFeed.decimals();
        
        return uint256(price) * (10 ** (18 - decimals));
    }

    // [BUY] USDT -> Gold Token (Ounce Base)
    function buyGold(uint256 usdtAmount, uint256 minGoldOut) external nonReentrant whenNotPaused {
        if (usdtAmount == 0) revert ZeroAmount();

        uint256 pricePerOunce = getGoldPrice(); 

        // USDT convert to 18 decimals value (MockUSDT=6, 18-6=12)
        uint256 usdtAmount18 = usdtAmount * 1e12; 
        
        uint256 goldAmount = (usdtAmount18 * 1e18) / pricePerOunce;
        
        
        if(goldAmount < minGoldOut) revert SlippageExceeded();

        // PoR : (Current Supply + mint amount) <= (total oz, converted by total reserve(g))
        // Reserve(Oz) = (Reserve(g) * 1e18) / GRAMS_PER_OUNCE
        uint256 reserveInOunces = (goldVault.getReserve() * 1e18) / GRAMS_PER_OUNCE;
        
        require(rwaToken.totalSupply() + goldAmount <= reserveInOunces, "PoR Failed: Reserve Low");

        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "USDT Transfer Failed");
        usdtToken.approve(address(usdtVault), usdtAmount);
        usdtVault.deposit(usdtAmount);

        rwaToken.mint(msg.sender, goldAmount);

        emit GoldBought(msg.sender, usdtAmount, goldAmount);
    }

    // [SELL] Gold Token -> USDT
    function sellGold(uint256 goldAmount, uint256 minUsdtOut) external nonReentrant whenNotPaused {
        if (goldAmount == 0) revert ZeroAmount();

        uint256 pricePerOunce = getGoldPrice();
        
        uint256 usdtValue18 = (goldAmount * pricePerOunce) / 1e18;
        
        uint256 usdtAmount = usdtValue18 / 1e12;

        if(usdtAmount < minUsdtOut) revert SlippageExceeded();

        rwaToken.burn(msg.sender, goldAmount);
        usdtVault.withdraw(msg.sender, usdtAmount);
        
        emit GoldSold(msg.sender, goldAmount, usdtAmount);
    }

    function previewRedeem(uint256 tokenId) public view returns (uint256) {
        // ERC1155 balanceOf(owner, id)
        IArkGoldNFT1155 nft = goldVault.nftContract();

        require(nft.balanceOf(address(goldVault), tokenId) > 0, "NFT not in Vault");

        uint256 weightInGrams = nft.getWeight(tokenId);
        require(weightInGrams > 0, "Invalid Token ID");

        // (g * 1e18) / 31.1035...
        return (weightInGrams * 1e18) / GRAMS_PER_OUNCE;
    }

    // [REDEEM] Physical NFT 
    function redeemGold(uint256 tokenId) external nonReentrant whenNotPaused {
        uint256 burnAmountInOunces = previewRedeem(tokenId);
        
        rwaToken.burn(msg.sender, burnAmountInOunces);

        goldVault.withdrawCollateral(msg.sender, tokenId);

        emit GoldRedeemed(msg.sender, tokenId, burnAmountInOunces);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}