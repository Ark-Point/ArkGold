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

// 사용할 컨트랙트 타입 정의
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
  // [핵심] Wagmi에서 변환된 Ethers Signer를 가져옴
  // 지갑이 연결되면 signer가 생기고, 연결 끊기면 undefined가 됨
  const signer = useEthersSigner({ chainId: config.mantle.chainId });

  // provider는 useMemo로 감싸는 것이 좋습니다. (매 렌더링마다 생성되지 않도록)
  const provider = useMemo(() => {
    return new providers.JsonRpcProvider(config.mantle.rpcUrl);
  }, []);

  const contracts = useMemo(() => {
    try {
      // [TypeChain] Signer를 주입하여 연결된 인스턴스 생성
      // 이제 이 인스턴스로 .buyGold() 호출 시 지갑 서명창이 뜹니다.

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

  // value 객체도 메모이제이션
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
