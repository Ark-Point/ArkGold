// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../ark-gold/interfaces/IArkGoldNFT1155.sol";

contract GoldVault is AccessControl, ERC1155Holder {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    IArkGoldNFT1155 public nftContract;
    uint256 public totalNftWeight; 
    uint256 public auditedReserve; 

    uint256[] public availableTokenIds;

    mapping(uint256 => uint256) private _tokenIndexPlusOne;

    event Deposited(address indexed from, uint256 id, uint256 weight);
    event Withdrawn(address indexed to, uint256 id, uint256 weight);

    constructor(address _nft) {
        require(_nft != address(0), "Zero Address: NFT");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        nftContract = IArkGoldNFT1155(_nft);
        auditedReserve = type(uint256).max; 
    }

    function onERC1155Received(
        address, address from, uint256 id, uint256 value, bytes memory
    ) public virtual override returns (bytes4) {
        require(msg.sender == address(nftContract), "Only ArkGoldNFT allowed");
        require(value == 1, "Only 1 bar at a time");

        uint256 weight = nftContract.getWeight(id);
        require(weight > 0, "Invalid Gold Bar");

        totalNftWeight += weight;

        if (_tokenIndexPlusOne[id] == 0) {
            availableTokenIds.push(id);
            _tokenIndexPlusOne[id] = availableTokenIds.length; // 1-based index
        }

        emit Deposited(from, id, weight);

        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address, address, uint256[] memory, uint256[] memory, bytes memory
    ) public virtual override returns (bytes4) {
        revert("Batch transfer not supported");
    }

    function depositCollateral(uint256 id) external {
        nftContract.safeTransferFrom(msg.sender, address(this), id, 1, "");
    }

    function withdrawCollateral(address to, uint256 id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 weight = nftContract.getWeight(id);
        require(totalNftWeight >= weight, "Underflow");

        totalNftWeight -= weight;

        // (Swap & Pop)
        uint256 index = _tokenIndexPlusOne[id];
        if (index > 0) {
            uint256 lastTokenId = availableTokenIds[availableTokenIds.length - 1];
            
            availableTokenIds[index - 1] = lastTokenId;
            _tokenIndexPlusOne[lastTokenId] = index;

            availableTokenIds.pop();
            delete _tokenIndexPlusOne[id];
        }

        nftContract.safeTransferFrom(address(this), to, id, 1, "");
        emit Withdrawn(to, id, weight);
    }

    function updateAuditedReserve(uint256 _newReserve) external onlyRole(ORACLE_ROLE) {
        auditedReserve = _newReserve;
    }

    function getReserve() external view returns (uint256) {
        return totalNftWeight < auditedReserve ? totalNftWeight : auditedReserve;
    }

    function getAvailableTokenIds() external view returns (uint256[] memory) {
        return availableTokenIds;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}