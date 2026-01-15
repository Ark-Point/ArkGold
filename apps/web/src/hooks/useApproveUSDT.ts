import { useContract } from "@/providers/contract-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { utils } from "ethers";

export const useApproveUSDT = () => {
  const { contracts } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: string) => {
      if (!contracts.usdt || !contracts.exchanger)
        throw new Error("Contract not ready");

      // Approve exact amount or unlimited
      const parsedAmount = utils.parseUnits(amount, 6);
      const tx = await contracts.usdt.approve(
        contracts.exchanger.address,
        parsedAmount
      );
      return await tx.wait(); // Wait for transaction mining
    },
    onSuccess: () => {
      // Invalidate 'allowance' query after approval -> Auto update UI
      queryClient.invalidateQueries({ queryKey: ["allowance"] });
      //   alert("Approval complete!");
    },
    onError: (e) => {
      console.error(e);
      //   alert("승인 실패");
    },
  });
};
