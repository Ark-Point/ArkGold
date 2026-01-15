import { useContract } from "@/providers/contract-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "ethers";

export const useSellGold = () => {
  const { contracts } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agldAmount: string) => {
      if (!contracts.exchanger) throw new Error("Contract not ready");

      const parsedAgld = utils.parseUnits(agldAmount, 18);
      const tx = await contracts.exchanger.sellGold(parsedAgld, 0);
      return await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      //   alert("Sell successful! 💰");
    },
    onError: (e: any) => {
      console.error(e);
      //   alert(`Sell failed: ${e.reason || e.message}`);
    },
  });
};
