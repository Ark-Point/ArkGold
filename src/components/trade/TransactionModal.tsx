"use client";

import { useState } from "react";
import Image from "next/image";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'Buy' | 'Sell';
    amount: string;
    price: string;
    total: string;
    newBalance: {
        usd: string;
        gold: string;
    };
}

export default function TransactionModal({
    isOpen,
    onClose,
    type,
    amount,
    price,
    total,
    newBalance
}: TransactionModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Animation duration
    };

    const transactionId = `#AG-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formatWithEllipsis = (val: string, decimals: number = 2) => {
        if (!val) return val;
        const parts = val.split('.');
        if (parts[1] && parts[1].length > 6) {
            return parseFloat(val).toLocaleString(undefined, {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6
            }) + '...';
        }
        return parseFloat(val).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: 6
        });
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}>
            <div className={`relative w-[500px] bg-[#141414] border border-[#3B3C40] rounded-[24px] p-[40px] shadow-2xl overflow-hidden transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100'}`}>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#F0B118]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Success Icon Recommendation: Circle Checkmark */}
                    <div className="mb-[24px]">
                        {type === 'Buy' ? (
                            /* Gold Circle + Black Check for Buy */
                            <div className="w-[80px] h-[80px] bg-[#F0B118] rounded-full flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.6 6L9 15.6L5.4 12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ) : (
                            /* White Circle + Black Check for Sell */
                            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.6 6L9 15.6L5.4 12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <h3 className="font-inter font-semibold text-[28px] text-white mb-[8px]">
                        Transaction Successful
                    </h3>
                    <p className="font-inter text-[16px] text-[#8C8D91] mb-[32px]">
                        Your order has been executed successfully.
                    </p>

                    {/* Receipt Details */}
                    <div className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-[16px] p-[24px] mb-[32px]">
                        <div className="flex flex-col gap-[16px]">
                            <DetailRow label="Transaction ID" value={transactionId} />
                            <DetailRow label="Time" value={timestamp} />
                            <DetailRow label="Type" value={`${type} Gold`} valueColor={type === 'Buy' ? '#34C86E' : '#FF4D4D'} />
                            <DetailRow label="Quantity" value={`${formatWithEllipsis(amount, type === 'Buy' ? 6 : 2)}g`} />
                            <DetailRow label="Price" value={`$${parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}/g`} />
                            <div className="h-[1px] bg-[#2E2E2E] my-[4px]" />
                            <DetailRow label="Total Amount" value={`$${formatWithEllipsis(total, type === 'Buy' ? 2 : 6)} USD`} isTotal />
                        </div>
                    </div>

                    {/* Updated Balances */}
                    <div className="w-full mb-[40px]">
                        <p className="font-inter text-[14px] text-[#5D5D5D] mb-[12px] uppercase tracking-wider">Updated Balances</p>
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div className="bg-[#1A1A1A] p-[16px] rounded-[12px] border border-[#2E2E2E]">
                                <p className="text-[#8C8D91] text-[12px] mb-[4px]">USD Balance</p>
                                <p className="text-white font-medium text-[16px]">${newBalance.usd}</p>
                            </div>
                            <div className="bg-[#1A1A1A] p-[16px] rounded-[12px] border border-[#2E2E2E]">
                                <p className="text-[#8C8D91] text-[12px] mb-[4px]">AGLD Balance</p>
                                <p className="text-[#F0B118] font-medium text-[16px]">{newBalance.gold}g</p>
                            </div>
                        </div>
                    </div>

                    {/* Done Button */}
                    <button
                        onClick={handleClose}
                        className={`w-full h-[60px] font-inter font-semibold text-[18px] rounded-[12px] transition-colors ${type === 'Sell' ? 'bg-white text-black hover:bg-[#EAEAEA]' : 'bg-[#F0B118] text-black hover:bg-[#E0A008]'}`}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, valueColor = '#FFFFFF', isTotal = false }: { label: string; value: string; valueColor?: string; isTotal?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="font-inter text-[15px] text-[#8C8D91]">{label}</span>
            <span
                className={`font-inter ${isTotal ? 'text-[18px] font-semibold' : 'text-[15px]'} transition-colors`}
                style={{ color: valueColor }}
            >
                {value}
            </span>
        </div>
    );
}
