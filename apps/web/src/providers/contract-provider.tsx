"use client";

import { Signer } from "ethers";
import React, { createContext, useContext, useMemo } from "react";
// [중요] 아까 만든 Ethers Adapter 훅
import { useEthersSigner } from "@/hooks/useEthers";
// [중요] TypeChain Factory (경로는 실제 빌드된 경로로 맞춰주세요)
import { config } from "@ark-gold/config";
import {
  ArkGold,
  ArkGoldExchanger,
  ArkGoldExchanger__factory,
  ArkGold__factory,
  MockUSDT__factory,
} from "@ark-gold/evm-contracts/typechain-types";

// 사용할 컨트랙트 타입 정의
interface ContractMap {
  exchanger: ArkGoldExchanger | null;
  arkGoldToken: ArkGold | null;
}

interface ContractContextType {
  contracts: ContractMap;
  isLoading: boolean;
  signer: Signer | undefined; // Provider 대신 Signer 노출
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

  const contracts = useMemo(() => {
    // 지갑이 연결되지 않았으면 컨트랙트 인스턴스를 만들 수 없음 (Read-Only면 Provider로 가능하지만, 여기선 거래가 목적)
    if (!signer) {
      return { exchanger: null, arkGoldToken: null };
    }

    try {
      // [TypeChain] Signer를 주입하여 연결된 인스턴스 생성
      // 이제 이 인스턴스로 .buyGold() 호출 시 지갑 서명창이 뜹니다.
      const exchanger = ArkGoldExchanger__factory.connect(
        config.contract.Exchanger,
        signer
      );

      const arkGoldToken = ArkGold__factory.connect(
        config.contract.ArkGold,
        signer
      );

      const usdt = MockUSDT__factory.connect(config.contract.MockUSDT, signer);

      return { exchanger, arkGoldToken, usdt };
    } catch (e) {
      console.error("Contract init failed:", e);
      return { exchanger: null, arkGoldToken: null };
    }
  }, [signer]);

  const isLoading = !signer || !contracts.exchanger;

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
