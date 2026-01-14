// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IArkGoldNFT1155 is IERC1155 {
    function mint(address to, uint256 id, uint256 weight,string memory serial) external;

    function burn(address from, uint256 id, uint256 amount) external;

    function getWeight(uint256 id) external view returns (uint256);
}