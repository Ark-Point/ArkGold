import { useState } from "react";
import Image from "next/image";

interface TradeFormProps {
    activeTab: 'Buy' | 'Sell';
    payAmount: string;
    receiveAmount: string;
    activePercent: number | null;
    onPayChange: (value: string) => void;
    onPercentClick: (percent: number) => void;
    usdBalance: number;
    goldBalance: number;
    goldPrice: number;
}

export default function TradeForm({
    activeTab,
    payAmount,
    receiveAmount,
    activePercent,
    onPayChange,
    onPercentClick,
    usdBalance,
    goldBalance,
    goldPrice
}: TradeFormProps) {
    const [isPayFocused, setIsPayFocused] = useState(false);
    const isBuy = activeTab === 'Buy';

    const formatAmountWithEllipsis = (amount: string) => {
        if (!amount) return amount;
        const [intPart, decPart] = amount.split('.');
        if (decPart && decPart.length > 4) {
            return `${intPart}.${decPart.slice(0, 4)}...`;
        }
        return amount;
    };

    // Calculate USD value for the input amounts
    const payUsdValue = payAmount ? (isBuy ? parseFloat(payAmount) : parseFloat(payAmount) * goldPrice) : 0;
    const receiveUsdValue = receiveAmount ? (isBuy ? parseFloat(receiveAmount) * goldPrice : parseFloat(receiveAmount)) : 0;

    return (
        <div className="w-full relative flex flex-col gap-1">
            {/* Top Field (Pay) */}
            <div className={`w-full bg-[#131418] border rounded-2xl p-4 transition-all focus-within:border-[#F0B118]/50 ${activePercent !== null ? 'border-[#F0B118]/50' : 'border-[#2E2E2E] hover:border-[#3B3C40]'}`}>
                <div className="flex justify-between mb-2">
                    <span className="text-[13px] text-[#8C8D91] font-inter">You Pay</span>
                    <div className="flex items-center gap-2">
                        {[0.25, 0.5, 1].map((p) => {
                            const isMax = p === 1;
                            const isActive = activePercent === p;
                            return (
                                <button
                                    key={p}
                                    onClick={() => onPercentClick(p)}
                                    className={`text-[14px] min-w-[46px] h-[22px] px-1 rounded transition-all font-bold leading-none ${isActive
                                        ? 'bg-[#F0B118] text-black border-[#F0B118]'
                                        : 'bg-[#1A1A1A] text-[#5D5D5D] hover:text-white border-transparent'
                                        } border flex items-center justify-center cursor-pointer`}
                                >
                                    {isMax ? 'MAX' : `${p * 100}%`}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        value={isPayFocused ? payAmount : formatAmountWithEllipsis(payAmount)}
                        onChange={(e) => onPayChange(e.target.value)}
                        onFocus={() => setIsPayFocused(true)}
                        onBlur={() => setIsPayFocused(false)}
                        placeholder="0"
                        className={`bg-transparent border-none outline-none text-[24px] md:text-[32px] font-semibold placeholder-[#3B3C40] w-full mr-4 ${isBuy ? 'text-white' : 'text-[#F0B118]'}`}
                    />
                    <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-[6px] rounded-full border border-[#2E2E2E] min-w-[90px] md:min-w-[100px]">
                        <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                                src={isBuy ? "/images/USDT.png" : "/images/AGLD.svg"}
                                alt={isBuy ? "USDT" : "AGLD"}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-[14px] md:text-[15px] text-white font-inter leading-none uppercase">
                            {isBuy ? 'USDT' : 'AGLD'}
                        </span>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[12px] md:text-[13px] text-[#8C8D91] font-inter">
                    <span>${payUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                    <span>{isBuy ? `${usdBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} USDT` : `${goldBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} AGLD`}</span>
                </div>
            </div>

            {/* Divider Arrow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 scale-90 md:scale-100">
                <div className="bg-[#141414] border border-[#2E2E2E] p-[8px] md:p-[10px] rounded-xl shadow-lg transition-all">
                    <svg width="18" height="18" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#8C8D91" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Bottom Field (Receive) */}
            <div className="w-full bg-[#131418] border border-[#2E2E2E] rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                    <span className="text-[13px] text-[#8C8D91] font-inter">You Receive</span>
                </div>
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        value={formatAmountWithEllipsis(receiveAmount)}
                        readOnly
                        placeholder="0"
                        className={`bg-transparent border-none outline-none text-[24px] md:text-[32px] font-semibold placeholder-[#3B3C40] w-full mr-4 ${isBuy ? 'text-[#F0B118]' : 'text-white'}`}
                    />
                    <div className="flex items-center gap-2 bg-[#1A1A1A] px-1 md:px-3 py-[6px] rounded-full border border-[#2E2E2E] min-w-[90px] md:min-w-[100px] justify-center">
                        <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                                src={isBuy ? "/images/AGLD.svg" : "/images/USDT.png"}
                                alt={isBuy ? "AGLD" : "USDT"}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-[14px] md:text-[15px] text-white font-inter leading-none uppercase">
                            {isBuy ? 'AGLD' : 'USDT'}
                        </span>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[12px] md:text-[13px] text-[#8C8D91] font-inter">
                    <span>${receiveUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                    <span>{isBuy ? `${goldBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} AGLD` : `${usdBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} USDT`}</span>
                </div>
            </div>
        </div>
    );
}
