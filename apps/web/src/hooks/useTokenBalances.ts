import { useContract } from "@/providers/contract-provider";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, utils } from "ethers";

export const useTokenBalances = () => {
  const { contracts, signer } = useContract();

  return useQuery({
    queryKey: ["balances", signer?.getAddress], // 주소가 바뀌면 다시 조회
    queryFn: async () => {
      if (!signer || !contracts.usdt || !contracts.arkGoldToken) {
        return {
          usdt: { raw: BigNumber.from(0), amount: "0" },
          agld: { raw: BigNumber.from(0), amount: "0" },
        };
      }
      const address = await signer.getAddress();

      const [usdtBal, agldBal] = await Promise.all([
        contracts.usdt.balanceOf(address),
        contracts.arkGoldToken.balanceOf(address),
      ]);

      return {
        usdt: {
          raw: usdtBal ?? BigNumber.from(0),
          amount: utils.formatUnits(usdtBal, 6) ?? "0",
        },
        agld: {
          raw: agldBal ?? BigNumber.from(0),
          amount: utils.formatUnits(agldBal, 18) ?? "0",
        },
      };
    },
    enabled: !!signer && !!contracts.usdt,
  });
};
