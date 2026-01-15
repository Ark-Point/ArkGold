import { Environment } from "../constant/environment";
import dev from "./dev";
import local from "./local";
import prod from "./prod";

const configMap = {
  [Environment.LOCAL]: local,
  [Environment.DEV]: dev,
  [Environment.PROD]: prod,
} as const;

const env =
  (process.env.NODE_ENV as keyof typeof configMap) || Environment.LOCAL;
const contractConfig = configMap[env];

// [핵심 변경] 함수형 default export 대신, 'config'라는 이름의 상수 객체로 export
export const config = {
  ...contractConfig,
  app: {
    environment: env,
  },
  reown: {
    projectId: process.env.REOWN_PROJECT_ID,
  },
  mantle: {
    rpcUrl: process.env.MANTLE_RPC_URL,
    wssUrl: process.env.MANTLE_WSS_URL,
    chainId: Number(process.env.MANTLE_CHAIN_ID),
  },
  ethereum: {
    rpcUrl: process.env.ETH_RPC_URL,
    wssUrl: process.env.ETH_WSS_URL,
    chainId: Number(process.env.ETH_CHAIN_ID),
  },
  admin: {
    key: process.env.ADMIN_WALLET_KEY,
    address: process.env.ADMIN_WALLET_ADDRESS,
  },
};
