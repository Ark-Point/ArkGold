"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

const PARTNERS = [
    { name: 'Aave', logo: '/images/section3-icon1.svg', description: 'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. depositors provide liquidity to the market to earn a passive income.' },
    { name: 'AGORA', logo: '/images/section3-icon2.svg', description: 'Agora is an institutional-grade stablecoin issuance platform. It provides the necessary infrastructure for reliable, fiat-backed digital dollars that power global commerce and decentralized finance.' },
    { name: 'Hex Trust', logo: '/images/section3-icon3.svg', description: 'Hex Trust is the leading institutional-grade digital asset custodian. Fully licensed and regulated, it provides bank-level security for digital assets across the globe.' },
    { name: 'ITCEN GLOBAL', logo: '/images/section3-icon4.svg', description: 'ITCENGLOBAL is a strategic partner in digital commodity trading, bridging the gap between traditional resources and blockchain-based settlement solutions.' },
    { name: 'MONAD', logo: '/images/section3-icon1.svg', description: 'Monad is a high-performance Ethereum-compatible L1 blockchain, optimized for ultra-high throughput and parallel execution, enabling a new generation of decentralized applications.' },
    { name: 'Solana', logo: '/images/section3-icon2.svg', description: 'Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world. With high throughput and ultra-low fees, it provides the ideal foundation for institutional-grade digital assets.' },
];

export default function PartnersSection() {
    const [selectedIdx, setSelectedIdx] = useState(0);

    return (
        <section className="w-full bg-black flex justify-center overflow-hidden h-[908px] md:h-auto">
            <div className="w-full max-w-[1440px] h-full relative md:min-h-[900px]">

                {/* --- Mobile View (393px Target) --- */}
                <div className="flex md:hidden flex-col items-center w-full h-full pt-[107px]">
                    {/* 1. Headline */}
                    <h2 className="font-serif text-[42px] font-normal text-white text-center">
                        Partners
                    </h2>

                    {/* 2. Marquee Rows */}
                    <div className="mt-[100px] flex flex-col gap-[32px] w-full overflow-hidden">
                        {/* Row 1 (L->R) */}
                        <div className="relative flex whitespace-nowrap overflow-hidden">
                            <div className="flex gap-[16px] animate-marquee-ltr-fast">
                                {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                                    <PartnerItem
                                        key={idx}
                                        name={partner.name}
                                        isActive={PARTNERS[selectedIdx].name === partner.name}
                                        onClick={() => setSelectedIdx(idx % PARTNERS.length)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Row 2 (R->L slow) */}
                        <div className="relative flex whitespace-nowrap overflow-hidden">
                            <div className="flex gap-[16px] animate-marquee-rtl-slow">
                                {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                                    <PartnerItem
                                        key={idx}
                                        name={partner.name}
                                        isActive={PARTNERS[selectedIdx].name === partner.name}
                                        onClick={() => setSelectedIdx(idx % PARTNERS.length)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Row 3 (L->R slow) */}
                        <div className="relative flex whitespace-nowrap overflow-hidden">
                            <div className="flex gap-[16px] animate-marquee-ltr-slow">
                                {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                                    <PartnerItem
                                        key={idx}
                                        name={partner.name}
                                        isActive={PARTNERS[selectedIdx].name === partner.name}
                                        onClick={() => setSelectedIdx(idx % PARTNERS.length)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Info Card */}
                    <div className="mt-[80px] w-full h-[270px] px-[32px] flex flex-col">
                        <div className="w-full h-full flex flex-col items-start">
                            {/* Partner Logo */}
                            <div className="relative w-[198px] h-[52px] flex items-center justify-start mb-6">
                                <div className="w-full h-full bg-white/5 flex items-center justify-center rounded">
                                    <span className="text-white font-serif text-lg">{PARTNERS[selectedIdx].name}</span>
                                </div>
                            </div>

                            {/* Partner Info Text */}
                            <div className="">
                                <p className="font-sans font-light text-[20px] text-[#fafafa] leading-[1.3] text-left">
                                    {PARTNERS[selectedIdx].name} provides innovative DeFi infrastructure, enabling reliable settlement by bridging digital assets with traditional resources across global markets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Desktop View (Original 12-col / Picker) --- */}
                <div className="hidden md:flex flex-col lg:block items-center md:min-h-[900px] w-full">
                    {/* 1. Gradient Overlay */}
                    <div
                        className="absolute z-20 pointer-events-none hidden lg:block"
                        style={{
                            width: '735px',
                            height: '100%',
                            left: '0',
                            top: '0',
                            background: 'linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, #000000 100%)'
                        }}
                    />

                    {/* 2. Content Area */}
                    <div className="flex flex-col items-center lg:items-start lg:absolute lg:z-10 w-full lg:w-[505px] h-auto lg:h-full lg:left-[835px] lg:top-0">
                        <div className="font-serif text-[54px] font-normal text-white leading-tight lg:absolute lg:top-[100px]">
                            Partners
                        </div>
                        <div className="flex flex-col items-center lg:items-start w-full mt-24 lg:mt-0 lg:absolute lg:top-[386px]">
                            <div className="bg-zinc-900 flex items-center justify-center border border-zinc-800 w-[245px] h-[64px]">
                                <span className="text-zinc-600 text-[12px]">Partner Logo ({PARTNERS[selectedIdx % PARTNERS.length]?.name})</span>
                            </div>
                            <div className="font-sans text-[20px] font-normal text-white leading-[28px] mt-6 w-full max-w-[421px] text-center lg:text-left h-auto min-h-[112px]">
                                {PARTNERS[selectedIdx % PARTNERS.length]?.description}
                            </div>
                        </div>
                    </div>

                    {/* 3. Vertical Picker (Desktop Placeholder / Link) */}
                    <div className="hidden lg:flex absolute z-15 flex-col items-end overflow-hidden right-[766px] top-0 w-[469px] h-full">
                        <div className="flex flex-col items-end w-full gap-[48px] mt-[393px]">
                            {PARTNERS.map((partner, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedIdx(index)}
                                    className="cursor-pointer group flex flex-col items-end"
                                >
                                    <span className={`font-serif text-[40px] leading-none text-right font-light transition-colors ${selectedIdx === index ? 'text-[#F0B118]' : 'text-white'}`}>
                                        {partner.name}
                                    </span>
                                    <div className={`mt-2 h-[1px] bg-[#F0B118] transition-all duration-500 ${selectedIdx === index ? 'w-full' : 'w-0'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee-ltr {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-rtl {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-ltr-fast {
                    animation: marquee-ltr 25s linear infinite;
                }
                .animate-marquee-ltr-slow {
                    animation: marquee-ltr 35s linear infinite;
                }
                .animate-marquee-rtl-slow {
                    animation: marquee-rtl 45s linear infinite;
                }
            `}</style>
        </section>
    );
}

function PartnerItem({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center cursor-pointer py-[3px]"
        >
            <span
                className={`font-serif text-[28px] font-normal leading-[36px] px-[8px] transition-colors duration-300 ${isActive ? 'text-[#F0B118]' : 'text-white'}`}
            >
                {name}
            </span>
            <div className={`w-full h-[1px] transition-colors duration-300 ${isActive ? 'bg-[#F0B118]' : 'bg-white'}`} />
        </div>
    );
}
