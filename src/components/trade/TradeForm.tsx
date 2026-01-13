import { useState } from "react";
import Image from "next/image";

// SVG for the top input background (notch at bottom)
const TopInputBackground = () => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 464 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
    >
        <defs>
            <mask id="cutout-mask-top">
                {/* 
            Path for Rect with 10px corner radius and bottom cutout.
            Clockwise:
            M 10 0 (Top Left start after corner)
            H 454 (Top edge)
            A 10 10 0 0 1 464 10 (Top Right corner)
            V 130 (Right edge)
            A 10 10 0 0 1 454 140 (Bottom Right corner)
            H 264.5 (Bottom edge right side)
            A 34 34 0 0 0 199.5 140 (Cutout arc)
            H 10 (Bottom edge left side)
            A 10 10 0 0 1 0 130 (Bottom Left corner)
            V 10 (Left edge)
            A 10 10 0 0 1 10 0 (Top Left corner)
            Z
         */}
                <path d="M10 0H454A10 10 0 0 1 464 10V130A10 10 0 0 1 454 140H264.5A34 34 0 0 0 199.5 140H10A10 10 0 0 1 0 130V10A10 10 0 0 1 10 0Z" fill="white" />
            </mask>
        </defs>
        <path
            d="M10 0H454A10 10 0 0 1 464 10V130A10 10 0 0 1 454 140H264.5A34 34 0 0 0 199.5 140H10A10 10 0 0 1 0 130V10A10 10 0 0 1 10 0Z"
            fill="#131418"
            stroke="#3B3C40"
            strokeWidth="4"
            mask="url(#cutout-mask-top)"
        />
    </svg>
);

// SVG for the botton input background (flipped Top Input)
const BottomInputBackground = () => (
    <div className="absolute inset-0 w-full h-full pointer-events-none rotate-180">
        <TopInputBackground />
    </div>
);


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
        if (decPart && decPart.length > 6) {
            return `${intPart}.${decPart.slice(0, 6)}...`;
        }
        return amount;
    };

    // Calculate USD value for the input amounts
    const payUsdValue = payAmount ? (isBuy ? parseFloat(payAmount) : parseFloat(payAmount) * goldPrice) : 0;
    const receiveUsdValue = receiveAmount ? (isBuy ? parseFloat(receiveAmount) * goldPrice : parseFloat(receiveAmount)) : 0;

    return (
        <div className="w-full relative flex flex-col gap-1">
            {/* Top Field (Pay) */}
            <div className={`w-full bg-[#131418] border ${activePercent !== null ? 'border-[#F0B118]/50' : 'border-[#2E2E2E]'} rounded-2xl p-4 transition-all hover:border-[#3B3C40] focus-within:border-[#F0B118]/50`}>
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
                                        } border flex items-center justify-center`}
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
                        className={`bg-transparent border-none outline-none text-[32px] font-semibold placeholder-[#3B3C40] w-full mr-4 ${isBuy ? 'text-white' : 'text-[#F0B118]'}`}
                    />
                    <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-[6px] rounded-full border border-[#2E2E2E] min-w-[100px]">
                        <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                                src={isBuy ? "/images/USDT.png" : "/images/AGLD.svg"}
                                alt={isBuy ? "USDT" : "AGLD"}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-[15px] text-white font-inter leading-none uppercase">
                            {isBuy ? 'USDT' : 'AGLD'}
                        </span>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px] text-[#8C8D91] font-inter">
                    <span>${payUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                    <span>{isBuy ? `${usdBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} USDT` : `${goldBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} AGLD`}</span>
                </div>
            </div>

            {/* Divider Arrow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-[#141414] border border-[#2E2E2E] p-[10px] rounded-xl shadow-lg transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        className={`bg-transparent border-none outline-none text-[32px] font-semibold placeholder-[#3B3C40] w-full mr-4 ${isBuy ? 'text-[#F0B118]' : 'text-white'}`}
                    />
                    <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-[6px] rounded-full border border-[#2E2E2E] min-w-[100px]">
                        <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                                src={isBuy ? "/images/AGLD.svg" : "/images/USDT.png"}
                                alt={isBuy ? "AGLD" : "USDT"}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-[15px] text-white font-inter leading-none uppercase">
                            {isBuy ? 'AGLD' : 'USDT'}
                        </span>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px] text-[#8C8D91] font-inter">
                    <span>${receiveUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                    <span>{isBuy ? `${goldBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} AGLD` : `${usdBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} USDT`}</span>
                </div>
            </div>
        </div>
    );
}
