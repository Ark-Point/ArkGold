// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract USDTVault is AccessControl {
    bytes32 public constant EXCHANGER_ROLE = keccak256("EXCHANGER_ROLE");
    IERC20 public usdt;

    constructor(address _usdt) {
        require(_usdt != address(0), "Zero Address: USDT");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        usdt = IERC20(_usdt);
    }

    function withdraw(address to, uint256 amount) external onlyRole(EXCHANGER_ROLE) {
        require(usdt.transfer(to, amount), "Transfer failed");
    }

    function deposit(uint256 amount) external {
        usdt.transferFrom(msg.sender, address(this), amount);
    }
}