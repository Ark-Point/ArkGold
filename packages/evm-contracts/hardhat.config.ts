import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-verify";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-truffle5";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-dependency-compiler";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";
dotenv.config();

const config: HardhatUserConfig = {
  // solidity: "0.8.28",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "cancun",
        },
      },
    ],
  },
  dependencyCompiler: {
    paths: [
      "@openzeppelin/contracts/token/ERC20/ERC20.sol",
      // "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol",
      // "@openzeppelin/contracts/access/Ownable.sol",
    ],
    keep: true,
  },
  networks: {
    hardhat: {
      accounts: { count: 1000 },
    },
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/k4LSpPS3k-KRKboeoE4WR`,
      accounts: [process.env.OPERATOR_KEY || ""],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "polygon",
        chainId: 137,
        urls: {
          // V2로 바뀌어도 이 API 주소는 유효합니다.
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  mocha: {
    timeout: 20000, // 20초
    bail: false, // 첫 실패에서 멈추지 않음
    parallel: false, // 병렬 실행 비활성화 (기본은 false)
  },
};

export default config;
