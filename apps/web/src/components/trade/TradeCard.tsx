"use client";

import { useGoldPrice } from "@/hooks/useGoldPrice";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber, utils } from "ethers";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import ConfirmationModal from "./ConfirmationModal";
import TradeForm from "./TradeForm";
import TransactionModal from "./TransactionModal";

interface TradeCardProps {
  isConnected: boolean;
  handleConnect: () => void;
}

export default function TradeCard({
  isConnected,
  handleConnect,
}: TradeCardProps) {
  const [activeTab, setActiveTab] = useState<"Buy" | "Sell">("Buy");
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  const [activePercent, setActivePercent] = useState<number | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{
    amount: string;
    total: string;
    type: "Buy" | "Sell";
  } | null>(null);

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  console.log("isConnected:", isConnected);
  console.log("address:", address);
  const {
    data: goldPriceData,
    isPending: goldPricePending,
    isFetching: goldPriceFetching,
  } = useGoldPrice();

  const {
    data: tokenBalances,
    isPending: tokenBalancePending,
    isFetching: tokenBalanceFetching,
  } = useTokenBalances();

  const usdtDecimals = 6;
  const agldDecimals = 18;
  const oracleDecimals = 18;

  // 1 oz t = $2,814.86 USDT
  const goldPrice = useMemo(
    () => goldPriceData ?? { raw: BigNumber.from(0), amount: "0" },
    [goldPriceData]
  );
  
  // Real balances
  const usdBalance = parseFloat(tokenBalances?.usdt.amount ?? "0");
  const goldBalance = parseFloat(tokenBalances?.agld.amount ?? "0");

  console.log("goldPrice:", goldPrice);
  console.log("tokenBalances:", tokenBalances);

  const handlePayChange = (value: string) => {
    setPayAmount(value);
    setActivePercent(null); // Reset active state on manual input
    if (!value || isNaN(parseFloat(value))) {
      setReceiveAmount("");
      return;
    }

    // Zero check for price to prevent div by zero
    if (goldPrice.raw.eq(0)) {
        return;
    }

    if (activeTab === "Buy") {
      // Pay USDT -> Receive AGLD
      const usdtIn = utils.parseUnits(value || "0", usdtDecimals); // BigNumber

      // 2️⃣ AGLD 수량 계산
      // Calculation: (USDT * 1e30) / PriceWei = AGLD (18 decimals)
      // Scaling: 6 (USDT) + 30 = 36. Price is 18. Result 18.
      const agldOut = usdtIn
        .mul(BigNumber.from(10).pow(30))
        .div(goldPrice.raw);

      // 3️⃣ UI 표시
      setReceiveAmount(utils.formatUnits(agldOut, agldDecimals));
    } else {
      // Pay AGLD -> Receive USDT
      const agldIn = utils.parseUnits(value || "0", agldDecimals);
      
      // Calculation: (AGLD * PriceWei) / 1e30 = USDT (6 decimals)
      // Scaling: 18 (AGLD) + 18 (Price) = 36. Divide by 30 = 6.
      const usdtOut = agldIn
        .mul(goldPrice.raw)
        .div(BigNumber.from(10).pow(30));
        
      setReceiveAmount(utils.formatUnits(usdtOut, usdtDecimals));
    }
  };

  const handlePercentClick = (percent: number) => {
    setActivePercent(percent);
    const balance = activeTab === "Buy" ? usdBalance : goldBalance;
    const amount = (balance * percent).toString();

    // Use a variant of handlePayChange that doesn't reset the percent
    setPayAmount(amount);
    
    // Zero check
    if (goldPrice.raw.eq(0)) {
        return;
    }

    if (activeTab === "Buy") {
      const usdtIn = utils.parseUnits(amount || "0", usdtDecimals); // BigNumber
      
      const agldOut = usdtIn
        .mul(BigNumber.from(10).pow(30))
        .div(goldPrice.raw);
        
      setReceiveAmount(utils.formatUnits(agldOut, agldDecimals));
    } else {
      const agldIn = utils.parseUnits(amount || "0", agldDecimals);
      
      const usdtOut = agldIn
        .mul(goldPrice.raw)
        .div(BigNumber.from(10).pow(30));
        
      setReceiveAmount(utils.formatUnits(usdtOut, usdtDecimals));
    }
  };

  const handleTradeExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsReviewing(false);
      setLastTransaction({
        amount: activeTab === "Buy" ? receiveAmount : payAmount,
        total: activeTab === "Buy" ? payAmount : receiveAmount,
        type: activeTab,
      });
      setShowSuccess(true);
      setPayAmount("");
      setReceiveAmount("");
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-[541px] h-auto rounded-[18px] p-[3px]">
      {/* Outer Gradient (Stroke) */}
      <div
        className="absolute inset-0 rounded-[18px]"
        style={{
          background:
            "linear-gradient(to top left, #1C1B16 0%, #5D5A55 46%, #2E2E2E 67%, #88888A 100%)",
        }}
      />

      {/* Inner Gradient (Background) */}
      <div
        className="absolute inset-[3px] rounded-[15px]"
        style={{
          background:
            "linear-gradient(to top left, #141414 0%, #141414 38%, #474749 100%)",
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center px-[18px] md:px-[38.5px] py-8 md:py-10">
        {/* Tabs */}
        <div className="flex bg-[#1A1A1A] p-1 rounded-xl mb-8 border border-[#2E2E2E]">
          <button
            onClick={() => {
              setActiveTab("Buy");
              setPayAmount("");
              setReceiveAmount("");
              setActivePercent(null);
            }}
            className={`px-8 py-2 rounded-lg font-inter font-medium text-sm transition-all cursor-pointer ${activeTab === "Buy" ? "bg-[#2E2E2E] text-white" : "text-[#8C8D91] hover:text-white"}`}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setActiveTab("Sell");
              setPayAmount("");
              setReceiveAmount("");
              setActivePercent(null);
            }}
            className={`px-8 py-2 rounded-lg font-inter font-medium text-sm transition-all cursor-pointer ${activeTab === "Sell" ? "bg-[#2E2E2E] text-white" : "text-[#8C8D91] hover:text-white"}`}
          >
            Sell
          </button>
        </div>

        {/* Trade Form Refactored */}
        <TradeForm
          activeTab={activeTab}
          payAmount={payAmount}
          receiveAmount={receiveAmount}
          activePercent={activePercent}
          onPayChange={handlePayChange}
          onPercentClick={handlePercentClick}
          usdBalance={usdBalance}
          goldBalance={goldBalance}
          goldPrice={Number(goldPrice?.amount)}
          isConnected={isConnected}
        />

        {/* Action Button */}
        <div className="mt-[42px] w-full flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-3 px-1">
            <span className="text-[15px] text-[#BCBCBC] font-inter font-medium leading-none">
              {`1 AGLD (oz t) = ${Number(goldPrice.amount).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )} USDT`}
            </span>
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-1.5 h-1.5 bg-[#34C86E] rounded-full animate-pulse" />
              <span className="font-inter text-[11px] text-[#34C86E] font-medium tracking-wider uppercase leading-none">
                Live
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!payAmount || parseFloat(payAmount) <= 0) return;
              if (!isConnected) {
                handleConnect();
              }
            }}
            className={`w-full h-[52px] md:h-[60px] rounded-xl font-inter font-semibold text-[16px] transition-all cursor-pointer active:scale-[0.98]
                            ${
                              !payAmount || parseFloat(payAmount) <= 0
                                ? "bg-[#1A1A1A] text-[#3B3C40] cursor-not-allowed border border-[#2E2E2E]"
                                : !isConnected
                                  ? "bg-[#1a1a1a] text-[#F0B118] border-[2px] border-[#F0B118]"
                                  : "bg-[#F0B118] text-black hover:bg-[#E0A008]"
                            }`}
          >
            {!payAmount || parseFloat(payAmount) <= 0
              ? "Enter an amount"
              : isConnected
                ? "Review Order"
                : "Connect Wallet"}
          </button>
        </div>

        {/* Footnote */}
        <p className="mt-[19px] font-inter text-[13px] text-[#5D5D5D]">
          Powered by Korea Gold Exchange
        </p>
      </div>

      {/* Skeletons for Modals */}
      <TransactionModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type={lastTransaction?.type || activeTab}
        amount={lastTransaction?.amount || ""}
        price={goldPrice.amount}
        total={lastTransaction?.total || ""}
        newBalance={{
          usd: usdBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          gold: goldBalance.toLocaleString(undefined, {
            maximumFractionDigits: 6,
          }),
        }}
      />

      <ConfirmationModal
        isOpen={isReviewing}
        onClose={() => setIsReviewing(false)}
        onConfirm={handleTradeExecute}
        isProcessing={isProcessing}
        activeTab={activeTab}
        payAmount={payAmount}
        receiveAmount={receiveAmount}
        goldPrice={Number(goldPrice?.amount)}
      />
    </div>
  );
}
