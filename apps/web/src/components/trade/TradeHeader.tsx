import React from "react";
import Image from "next/image";
import Link from "next/link";

interface TradeHeaderProps {
    isConnected: boolean;
    address?: string;
    onConnect: () => void;
    onDisconnectClick: () => void;
    onCopy?: () => void;
}

export default function TradeHeader({ isConnected, address, onConnect, onDisconnectClick, onCopy }: TradeHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const abbreviateAddress = (addr: string) => {
        return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (address) {
            navigator.clipboard.writeText(address);
            onCopy?.();
        }
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-50 w-full pt-[20px] md:pt-[24px]">
            <div className="flex items-center justify-between px-[24px] md:px-[100px]">
                <Link href="/" className="flex items-center">
                    {/* Mobile Logo */}
                    <Image
                        src="/images/mobile-logo.svg"
                        alt="Ark Gold"
                        width={104}
                        height={29}
                        priority
                        className="md:hidden h-[29px] w-[104px] object-contain"
                    />
                    {/* Desktop Logo */}
                    <Image
                        src="/images/web-logo.svg"
                        alt="Ark Gold"
                        width={200}
                        height={32}
                        priority
                        className="hidden md:block h-[32px] w-auto object-contain"
                    />
                </Link>

                <div className="relative w-[124px] md:w-[154px] h-[32px] md:h-[38px]">
                    {!isConnected ? (
                        <button
                            onClick={onConnect}
                            className="w-full h-full flex items-center justify-center rounded-[10px] bg-[#F0B118] text-[#000000] font-inter font-semibold text-[12px] md:text-[14px] hover:bg-[#E0A008] transition-all cursor-pointer whitespace-nowrap px-1 md:px-1.5 leading-none"
                        >
                            Connect Wallet
                        </button>
                    ) : (
                        <div
                            className={`absolute top-0 right-0 w-full overflow-hidden transition-all duration-300 ease-in-out bg-[#1A1A1A] border border-[#2E2E2E] rounded-[10px] ${isMenuOpen ? 'h-[82px] md:h-[106px]' : 'h-[32px] md:h-[38px] hover:border-[#F0B118]'}`}
                        >
                            {/* Address Row (Top) */}
                            <div
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-between gap-0 h-[32px] md:h-[38px] pl-3 md:pl-4 pr-2 md:pr-2.5 text-white font-inter font-medium text-[12px] md:text-[14px] transition-all cursor-pointer"
                            >
                                <span className="flex-1 text-left leading-none">{address ? abbreviateAddress(address) : "0x000...0000"}</span>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center justify-center w-[20px] h-[20px] md:w-[24px] md:h-[24px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8C8D91] hover:text-[#F0B118]">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Disconnect Row (Bottom) */}
                            <div className="px-2.5 pb-2.5 h-[50px] md:h-[68px] flex items-end">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onDisconnectClick();
                                    }}
                                    className="w-full h-[30px] md:h-[34px] flex items-center justify-center text-[12px] md:text-[13px] text-[#F0B118] font-semibold border border-[#F0B118] rounded-[6px] hover:bg-[#F0B118]/10 transition-colors cursor-pointer"
                                >
                                    Disconnect
                                </button>
                            </div>

                            {/* Click-away backdrop */}
                            {isMenuOpen && (
                                <div
                                    className="fixed inset-0 z-[-1]"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
