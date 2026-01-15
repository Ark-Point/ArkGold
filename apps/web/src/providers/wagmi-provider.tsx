"use client";

import config from "@/config";
import {
  Chain,
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { http, WagmiProvider } from "wagmi";

export const ethereum: Chain = {
  id: Number(config.NEXT_PUBLIC_ETH_CHAIN_ID!),
  name: "ethereum",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [config.NEXT_PUBLIC_ETH_RPC_URL ?? ""],
    },
    public: {
      http: [config.NEXT_PUBLIC_ETH_RPC_URL ?? ""],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
};

export const mantle: Chain = {
  id: Number(config.NEXT_PUBLIC_MANTLE_CHAIN_ID),
  name: "mantle",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [config.NEXT_PUBLIC_MANTLE_RPC_URL ?? ""],
    },
    public: {
      http: [config.NEXT_PUBLIC_MANTLE_RPC_URL ?? ""],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantlescan",
      url: "https://sepolia.mantlescan.xyz/",
    },
  },
};

// MARK: Initialize Wagmi
const projectId = config.NEXT_PUBLIC_REOWN_PROJECT_ID || "project-id";

const queryClient = new QueryClient();

const wagmiConfig = getDefaultConfig({
  appName: "ArkGold",
  projectId,
  chains: [mantle],
  transports: {
    [mantle.id]: http(config.NEXT_PUBLIC_MANTLE_RPC_URL),
    // [ethereum.id]: http(config.ethereum.rpcUrl),
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet],
    },
  ],
});

const WagmiAppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="wide" theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiAppProvider;
