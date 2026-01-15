import { useContract } from "@/providers/contract-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "ethers";

export const useBuyGold = () => {
  const { contracts } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (usdtAmount: string) => {
      if (!contracts.exchanger) throw new Error("Contract not ready");

      const parsedUsdt = utils.parseUnits(usdtAmount, 6);
      // Set minOut to 0 (Slippage protection to be added later)
      const tx = await contracts.exchanger.buyGold(parsedUsdt, 0);
      return await tx.wait();
    },
    onSuccess: () => {
      // Update balances
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["allowance"] }); // Update allowance as it decreased
      //   alert("Buy successful! 🦁");
    },
    onError: (e: any) => {
      console.error(e);
      // Parse error message (Revert reason, etc.)
      //   alert(`Buy failed: ${e.reason || e.message}`);
    },
  });
};
