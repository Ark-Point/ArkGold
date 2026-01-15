import { Environment } from "../constant/environment";
import dev from "./dev";
import local from "./local";
import prod from "./prod";

const configMap = {
  [Environment.LOCAL]: local,
  [Environment.DEV]: dev,
  [Environment.PROD]: prod,
} as const;

const getEnvironment = (): Environment => {
  const appEnv = process.env.APP_ENV as Environment;
  if (appEnv && Object.values(Environment).includes(appEnv)) {
    return appEnv;
  }

  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "development") {
    return Environment.LOCAL;
  }
  
  if (nodeEnv && Object.values(Environment).includes(nodeEnv as Environment)) {
    return nodeEnv as Environment;
  }

  return Environment.LOCAL;
};

const env = getEnvironment();
const contractConfig = configMap[env];

// [핵심 변경] 함수형 default export 대신, 'config'라는 이름의 상수 객체로 export
export const config = {
  ...contractConfig,
  app: {
    environment: env,
  },
  reown: {
    projectId: process.env.REOWN_PROJECT_ID || process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  },
  mantle: {
    rpcUrl: process.env.MANTLE_RPC_URL || process.env.NEXT_PUBLIC_MANTLE_RPC_URL,
    wssUrl: process.env.MANTLE_WSS_URL || process.env.NEXT_PUBLIC_MANTLE_WSS_URL,
    chainId: Number(process.env.MANTLE_CHAIN_ID || process.env.NEXT_PUBLIC_MANTLE_CHAIN_ID),
  },
  ethereum: {
    rpcUrl: process.env.ETH_RPC_URL || process.env.NEXT_PUBLIC_ETH_RPC_URL,
    wssUrl: process.env.ETH_WSS_URL || process.env.NEXT_PUBLIC_ETH_WSS_URL,
    chainId: Number(process.env.ETH_CHAIN_ID || process.env.NEXT_PUBLIC_ETH_CHAIN_ID),
  },
  admin: {
    key: process.env.ADMIN_WALLET_KEY,
    address: process.env.ADMIN_WALLET_ADDRESS,
  },
};
