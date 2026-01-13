"use client";

import { useState } from "react";
import Image from "next/image";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isProcessing: boolean;
    activeTab: 'Buy' | 'Sell';
    payAmount: string;
    receiveAmount: string;
    goldPrice: number;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    activeTab,
    payAmount,
    receiveAmount,
    goldPrice
}: ConfirmationModalProps) {
    const [showDetails, setShowDetails] = useState(true);
    if (!isOpen) return null;

    const isBuy = activeTab === 'Buy';

    const formatWithEllipsis = (amount: string, minDecimals: number = 2) => {
        if (!amount) return amount;
        const parts = amount.split('.');
        if (parts[1] && parts[1].length > 6) {
            return parseFloat(amount).toLocaleString(undefined, {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6
            }) + '...';
        }
        return parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: 6
        });
    };

    // Values for details
    const networkCost = "0.00";
    const fee = "Free";
    const priceImpact = "< 0.01 %";

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-[420px] bg-[#141414] border border-[#2E2E2E] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-slide-up">

                {/* 1. Header */}
                <div className="flex items-center justify-between px-6 py-5">
                    <h3 className="text-[18px] font-semibold text-white font-inter">You&apos;re order</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[#1A1A1A] rounded-lg transition-colors group"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#8C8D91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors" />
                        </svg>
                    </button>
                </div>

                {/* 2. Swap Summary */}
                <div className="px-6 pb-2">
                    <div className="flex flex-col">
                        {/* Asset Row 1 */}
                        <div className="flex justify-between pt-5 pb-3">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2 leading-none">
                                        <span className="text-[28px] font-semibold text-white font-inter">
                                            {formatWithEllipsis(payAmount)}
                                        </span>
                                        <span className="text-[20px] font-semibold text-white font-inter uppercase">
                                            {isBuy ? 'USDT' : 'AGLD'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[14px] text-[#8C8D91] font-inter mt-1.5 leading-none">
                                    {isBuy ? `$${parseFloat(payAmount).toLocaleString(undefined, { maximumFractionDigits: 4 })}` : `$${(parseFloat(payAmount) * goldPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}`}
                                </span>
                            </div>
                            <div className="w-10 h-10 relative flex-shrink-0 mt-[-2px]">
                                <Image
                                    src={isBuy ? "/images/USDT.png" : "/images/AGLD.svg"}
                                    alt="Pay token"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Shortened Left-aligned Arrow */}
                        <div className="py-1 pl-[11px]">
                            <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 0V22M6 22L1 17M6 22L11 17" stroke="#8C8D91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Asset Row 2 */}
                        <div className="flex justify-between py-3">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2 leading-none">
                                        <span className={`text-[28px] font-semibold font-inter ${isBuy ? 'text-[#F0B118]' : 'text-white'}`}>
                                            {formatWithEllipsis(receiveAmount, 4)}
                                        </span>
                                        <span className={`text-[20px] font-semibold font-inter uppercase ${isBuy ? 'text-[#F0B118]' : 'text-white'}`}>
                                            {isBuy ? 'AGLD' : 'USDT'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[14px] text-[#8C8D91] font-inter mt-1.5 leading-none">
                                    {isBuy ? `$${(parseFloat(receiveAmount) * goldPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}` : `$${parseFloat(receiveAmount).toLocaleString(undefined, { maximumFractionDigits: 4 })}`}
                                </span>
                            </div>
                            <div className="w-10 h-10 relative flex-shrink-0 mt-[-2px]">
                                <Image
                                    src={isBuy ? "/images/AGLD.svg" : "/images/USDT.png"}
                                    alt="Receive token"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Transaction Details */}
                <div className="px-6 py-6 border-t border-[#2E2E2E] mt-4">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex items-center justify-between group grayscale hover:grayscale-0 transition-all"
                    >
                        <span className="text-[13px] text-[#8C8D91] group-hover:text-white transition-colors">Transaction Details</span>
                        <svg
                            width="20" height="20" viewBox="0 0 24 24" fill="none"
                            className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                        >
                            <path d="M6 9L12 15L18 9" stroke="#8C8D91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${showDetails ? 'mt-5 max-h-[400px]' : 'max-h-0'}`}>
                        <div className="flex flex-col gap-3.5">
                            <div className="flex justify-between items-center text-[13px]">
                                <span className="text-[#8C8D91]">Fee</span>
                                <span className="text-[#34C86E] font-medium">Free</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px]">
                                <span className="text-[#8C8D91]">Rate</span>
                                <span className="text-white font-medium">1 AGLD = {goldPrice.toFixed(2)} USDT</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px]">
                                <span className="text-[#8C8D91]">Max Slippage</span>
                                <span className="text-white font-medium">0.50 %</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px]">
                                <span className="text-[#8C8D91]">Price Impact</span>
                                <span className="text-white font-medium">- 0.05 %</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Footer Action */}
                <div className="px-6 pb-6 pt-2">
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="w-full h-[56px] bg-[#F0B118] hover:bg-[#E0A008] disabled:bg-[#1A1A1A] disabled:text-[#3B3C40] active:scale-[0.98] rounded-xl text-black font-semibold text-[16px] transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            'Confirm Order'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
