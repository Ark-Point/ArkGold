import { useContract } from "@/providers/contract-provider";
import { useQuery } from "@tanstack/react-query";
import { utils } from "ethers";

export const useAllowance = () => {
  const { contracts, signer } = useContract();

  return useQuery({
    queryKey: ["allowance", signer?.getAddress],
    queryFn: async () => {
      if (!signer || !contracts.usdt || !contracts.exchanger) return "0";

      const address = await signer.getAddress();
      const allowance = await contracts.usdt.allowance(
        address,
        contracts.exchanger.address
      );

      return utils.formatUnits(allowance, 6); // USDT 6 decimals
    },
    enabled: !!signer && !!contracts.usdt,
  });
};
