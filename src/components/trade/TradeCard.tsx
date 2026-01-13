"use client";

import { useState } from "react";
import TradeForm from "./TradeForm";
import TransactionModal from "./TransactionModal";
import ConfirmationModal from "./ConfirmationModal";

export default function TradeCard() {
    const [activeTab, setActiveTab] = useState<'Buy' | 'Sell'>('Buy');
    const [usdBalance, setUsdBalance] = useState(5324.50);
    const [goldBalance, setGoldBalance] = useState(42.8);
    const [payAmount, setPayAmount] = useState('');
    const [receiveAmount, setReceiveAmount] = useState('');

    const [activePercent, setActivePercent] = useState<number | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<{ amount: string; total: string; type: 'Buy' | 'Sell' } | null>(null);

    const goldPrice = 90.50; // 1g = $90.50 USDT

    const handlePayChange = (value: string) => {
        setPayAmount(value);
        setActivePercent(null); // Reset active state on manual input
        if (!value || isNaN(parseFloat(value))) {
            setReceiveAmount('');
            return;
        }

        const numValue = parseFloat(value);
        if (activeTab === 'Buy') {
            // Pay USDT -> Receive AGLD
            setReceiveAmount((numValue / goldPrice).toFixed(8));
        } else {
            // Pay AGLD -> Receive USDT
            setReceiveAmount((numValue * goldPrice).toFixed(8));
        }
    };

    const handlePercentClick = (percent: number) => {
        setActivePercent(percent);
        const balance = activeTab === 'Buy' ? usdBalance : goldBalance;
        const amount = (balance * percent).toString();

        // Use a variant of handlePayChange that doesn't reset the percent
        setPayAmount(amount);
        if (activeTab === 'Buy') {
            setReceiveAmount((parseFloat(amount) / goldPrice).toFixed(8));
        } else {
            setReceiveAmount((parseFloat(amount) * goldPrice).toFixed(8));
        }
    };

    const handleTradeExecute = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const payNum = parseFloat(payAmount);
            const receiveNum = parseFloat(receiveAmount);

            if (activeTab === 'Buy') {
                setUsdBalance(prev => prev - payNum);
                setGoldBalance(prev => prev + receiveNum);
            } else {
                setGoldBalance(prev => prev - payNum);
                setUsdBalance(prev => prev + receiveNum);
            }

            setIsProcessing(false);
            setIsReviewing(false);
            setLastTransaction({
                amount: activeTab === 'Buy' ? receiveAmount : payAmount,
                total: activeTab === 'Buy' ? payAmount : receiveAmount,
                type: activeTab
            });
            setShowSuccess(true);
            setPayAmount('');
            setReceiveAmount('');
        }, 1200);
    };

    return (
        <div className="relative w-full max-w-[541px] h-auto rounded-[18px] p-[3px]">
            {/* Outer Gradient (Stroke) */}
            <div
                className="absolute inset-0 rounded-[18px]"
                style={{
                    background: 'linear-gradient(to top left, #1C1B16 0%, #5D5A55 46%, #2E2E2E 67%, #88888A 100%)'
                }}
            />

            {/* Inner Gradient (Background) */}
            <div
                className="absolute inset-[3px] rounded-[15px]"
                style={{
                    background: 'linear-gradient(to top left, #141414 0%, #141414 38%, #474749 100%)'
                }}
            />

            <div className="relative z-10 w-full flex flex-col items-center px-[18px] md:px-[38.5px] py-8 md:py-10">
                {/* Tabs */}
                <div className="flex bg-[#1A1A1A] p-1 rounded-xl mb-8 border border-[#2E2E2E]">
                    <button
                        onClick={() => { setActiveTab('Buy'); setPayAmount(''); setReceiveAmount(''); setActivePercent(null); }}
                        className={`px-8 py-2 rounded-lg font-inter font-medium text-sm transition-all cursor-pointer ${activeTab === 'Buy' ? 'bg-[#2E2E2E] text-white' : 'text-[#8C8D91] hover:text-white'}`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => { setActiveTab('Sell'); setPayAmount(''); setReceiveAmount(''); setActivePercent(null); }}
                        className={`px-8 py-2 rounded-lg font-inter font-medium text-sm transition-all cursor-pointer ${activeTab === 'Sell' ? 'bg-[#2E2E2E] text-white' : 'text-[#8C8D91] hover:text-white'}`}
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
                    goldPrice={goldPrice}
                />

                {/* Action Button */}
                <div className="mt-[42px] w-full flex flex-col items-center">
                    <div className="w-full flex items-center gap-2 mb-3 px-1">
                        <span className="text-[15px] text-[#BCBCBC] font-inter font-medium leading-none">1 AGLD = 90.50 USDT</span>
                        <div className="flex items-center gap-1.5 ml-1">
                            <div className="w-1.5 h-1.5 bg-[#34C86E] rounded-full animate-pulse" />
                            <span className="font-inter text-[11px] text-[#34C86E] font-medium tracking-wider uppercase leading-none">Live</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsReviewing(true)}
                        disabled={!payAmount || parseFloat(payAmount) <= 0}
                        className={`w-full h-[52px] md:h-[60px] rounded-xl font-inter font-semibold text-[16px] transition-all cursor-pointer ${!payAmount || parseFloat(payAmount) <= 0
                            ? 'bg-[#1A1A1A] text-[#3B3C40] cursor-not-allowed border border-[#2E2E2E]'
                            : 'bg-[#F0B118] text-black hover:bg-[#E0A008] active:scale-[0.98]'
                            }`}
                    >
                        Review Order
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
                amount={lastTransaction?.amount || ''}
                price={goldPrice.toFixed(2)}
                total={lastTransaction?.total || ''}
                newBalance={{
                    usd: usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    gold: goldBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })
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
                goldPrice={goldPrice}
            />
        </div>
    );
}
