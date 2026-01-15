"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

const PARTNERS = [
    {
        name: 'ITCEN GROUP',
        logo: '/images/ITCEN.png',
        description: "South Korea's premier IT services powerhouse, ITCEN GROUP is a global leader in Web3 and RWA tokenization. By bridging physical commodities with blockchain, it architectures a massive digital ecosystem through innovative STO frameworks."
    },
    {
        name: 'Korea gold exchange',
        logo: '/images/koreagoldexchange.png',
        description: "As the nation's largest precious metals exchange, Korea gold exchange serves as the physical foundation for the digital gold economy. It enables secure 1:1 asset-backed gold tokenization underpinned by trusted physical reserves."
    },
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
                    <div className="mt-[90px] flex flex-col gap-[32px] w-full overflow-hidden">
                        {/* Row 1 (L->R) */}
                        <div className="relative flex whitespace-nowrap overflow-hidden">
                            <div className="flex gap-[16px] animate-marquee-ltr-fast">
                                {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
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
                                {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
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
                                {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
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
                            <div className="relative w-[198px] h-[52px] flex items-center justify-start mb-[34px] -mt-[10px]">
                                <div key={selectedIdx} className="relative w-full h-full animate-fade-in-up">
                                    <div
                                        className={`relative w-full h-full ${PARTNERS[selectedIdx].name === 'Korea gold exchange'
                                            ? 'scale-[1.22] translate-x-[-2px] translate-y-[5px] origin-left'
                                            : 'translate-x-[-11px] scale-[0.81]'}`}
                                    >
                                        <Image
                                            src={PARTNERS[selectedIdx].logo}
                                            alt={PARTNERS[selectedIdx].name}
                                            fill
                                            className={`object-contain ${PARTNERS[selectedIdx].name === 'Korea gold exchange' ? 'brightness-0 invert' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Partner Info Text */}
                            <div key={`desc-${selectedIdx}`} className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <p className="font-sans font-light text-[18px] text-[#fafafa] leading-[1.3] text-left">
                                    {PARTNERS[selectedIdx].description}
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
                        <div className="flex flex-col items-center lg:items-start w-full mt-24 lg:mt-0 lg:absolute lg:top-[376px]">
                            <div key={selectedIdx % PARTNERS.length} className="w-[245px] h-[64px] animate-fade-in-up">
                                <div
                                    className={`relative w-full h-full ${PARTNERS[selectedIdx % PARTNERS.length]?.name === 'Korea gold exchange'
                                        ? 'translate-x-[35px] translate-y-[5px] scale-[1.35]'
                                        : 'translate-x-[-5px] scale-[0.9]'}`}
                                >
                                    <Image
                                        src={PARTNERS[selectedIdx % PARTNERS.length]?.logo}
                                        alt={PARTNERS[selectedIdx % PARTNERS.length]?.name}
                                        fill
                                        className={`object-contain ${PARTNERS[selectedIdx % PARTNERS.length]?.name === 'Korea gold exchange' ? 'brightness-0 invert' : ''}`}
                                    />
                                </div>
                            </div>
                            <div
                                key={`desc-desk-${selectedIdx % PARTNERS.length}`}
                                className="font-sans text-[20px] font-light text-white leading-[28px] mt-[44px] w-full max-w-[421px] text-center lg:text-left h-auto animate-fade-in-up"
                                style={{ animationDelay: '100ms' }}
                            >
                                {PARTNERS[selectedIdx % PARTNERS.length]?.description}
                            </div>
                        </div>
                    </div>

                    {/* 3. Vertical Picker (Desktop Placeholder / Link) */}
                    <div className="hidden lg:flex absolute z-15 flex-col items-end overflow-hidden right-[766px] top-0 w-[469px] h-full">
                        <div className="flex flex-col items-end w-full gap-[48px] mt-[383px]">
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
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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
                className={`font-serif text-[28px] font-normal leading-[36px] px-[8px] transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#F0B118]' : 'text-white'}`}
            >
                {name}
            </span>
            <div className={`w-full h-[1px] transition-colors duration-300 ${isActive ? 'bg-[#F0B118]' : 'bg-white'}`} />
        </div>
    );
}
