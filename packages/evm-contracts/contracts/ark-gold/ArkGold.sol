// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IMintableBurnable.sol"; 

contract ArkGold is ERC20, AccessControl, IMintableBurnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor() ERC20("Ark Gold", "AGLD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // --- IMintableBurnable Implementation ---

    function mint(address to, uint256 amount) external override onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external override onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
}