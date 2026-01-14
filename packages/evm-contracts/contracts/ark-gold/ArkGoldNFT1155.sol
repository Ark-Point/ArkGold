// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IArkGoldNFT1155.sol";

contract ArkGoldNFT1155 is ERC1155, AccessControl,IArkGoldNFT1155 {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    mapping(uint256 => uint256) public tokenWeights;

    mapping(uint256 => string) public serialNumbers;

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    
    function mint(
        address to, 
        uint256 id, 
        uint256 weight, 
        string memory serial
    ) external onlyRole(MINTER_ROLE) {
        require(weight > 0, "Weight must be > 0");
        
        require(tokenWeights[id] == 0, "ID already exists");

        _mint(to, id, 1, "");
        
        tokenWeights[id] = weight;
        serialNumbers[id] = serial;
    }

    function burn(address from, uint256 id, uint256 amount) external override onlyRole(BURNER_ROLE) {
        _burn(from, id, amount);
    }

    function getWeight(uint256 id) external view override returns (uint256) {
        return tokenWeights[id];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}