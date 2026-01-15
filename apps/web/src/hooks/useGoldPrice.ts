import { useContract } from "@/providers/contract-provider";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, utils } from "ethers";

export const useGoldPrice = () => {
  const { contracts } = useContract();

  return useQuery({
    queryKey: ["goldPrice"],
    queryFn: async () => {
      if (!contracts.exchanger) return { raw: BigNumber.from(0), amount: "0" };

      const price = await contracts.exchanger.getGoldPrice();
      console.log("price: ", price);
      return {
        raw: price ?? BigNumber.from(0),
        amount: utils.formatUnits(price, 18) ?? "0",
      };
    },
    enabled: !!contracts.exchanger,
    refetchInterval: 5000, // 5s
  });
};
