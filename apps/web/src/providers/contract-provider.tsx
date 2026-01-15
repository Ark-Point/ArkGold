"use client";

import { useEthersSigner } from "@/hooks/useEthers";
import { config } from "@ark-gold/config";
import {
  ArkGold,
  ArkGoldExchanger,
  ArkGoldExchanger__factory,
  ArkGold__factory,
  MockUSDT,
  MockUSDT__factory,
} from "@ark-gold/evm-contracts/typechain-types";
import { Signer, providers } from "ethers";
import React, { createContext, useContext, useMemo } from "react";

// Define Contract types
interface ContractMap {
  exchanger: ArkGoldExchanger | null;
  arkGoldToken: ArkGold | null;
  usdt: MockUSDT | null;
}

interface ContractContextType {
  contracts: ContractMap;
  isLoading: boolean;
  signer: Signer | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // [Core] Get Ethers Signer converted from Wagmi
  // Signer is available when wallet is connected, otherwise undefined
  const signer = useEthersSigner({ chainId: config.mantle.chainId });

  // Wrap provider with useMemo (to avoid recreation on every render)
  const provider = useMemo(() => {
    return new providers.JsonRpcProvider(config.mantle.rpcUrl);
  }, []);

  const contracts = useMemo(() => {
    try {
      // [TypeChain] Create connected instance by injecting Signer
      // Now invoking .buyGold() with this instance will prompt wallet signature

      const exchanger = ArkGoldExchanger__factory.connect(
        config.contract.Exchanger,
        signer ?? provider
      );

      const arkGoldToken = ArkGold__factory.connect(
        config.contract.ArkGold,
        signer ?? provider
      );

      const usdt = MockUSDT__factory.connect(
        config.contract.MockUSDT,
        signer ?? provider
      );

      return { exchanger, arkGoldToken, usdt };
    } catch (e) {
      console.error("Contract init failed:", e);
      return { exchanger: null, arkGoldToken: null, usdt: null };
    }
  }, [signer, provider]);

  const isLoading = !signer || !contracts.exchanger;

  // Memoize value object
  const value = useMemo(
    () => ({ contracts, isLoading, signer }),
    [contracts, isLoading, signer]
  );

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

// Hook
export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
