// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 1. Mock USDT 
contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "USDT") {
        _mint(msg.sender, 1000000 * 10**6);
    }
    
    // decimal override 
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }


    function faucet() external {
        _mint(msg.sender, 1000 * 10**6);
    }
}

