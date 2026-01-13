"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function BenefitsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollPosition = scrollRef.current.scrollLeft;
        const cardWidth = 295 + 18; // Card width + gap
        const newIndex = Math.round(scrollPosition / cardWidth);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <section className="w-full bg-black flex justify-center overflow-hidden h-[852px] md:h-auto">
            <div className="w-full max-w-[1440px] h-full relative md:py-20 md:min-h-[920px]">
                {/* Mobile Background */}
                <div className="absolute inset-0 md:hidden z-0">
                    <Image
                        src="/images/mobile-section3-bg.png"
                        alt="Benefits Background"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Desktop Background Image - Hidden on mobile */}
                <div
                    className="absolute hidden md:block"
                    style={{
                        top: '75px',
                        left: '142px',
                        width: 'auto',
                        height: 'auto'
                    }}
                >
                    <Image
                        src="/images/section3-bg.png"
                        alt="Benefits Background"
                        width={422}
                        height={770}
                        priority
                        unoptimized
                        className="opacity-100"
                    />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full flex flex-col pt-[113px] md:pt-0 md:px-[100px]">
                    {/* Heading Text */}
                    <div className="w-full md:w-auto md:ml-[525px] md:pt-[64px] px-0 flex flex-col items-center md:items-start">
                        <h2 className="font-serif text-[28px] md:text-[40px] font-normal text-white leading-[40px] md:leading-tight text-center md:text-left">
                            How does <span className="text-[#F0B118]">AGLD</span> <br className="md:hidden" />
                            differentiate itself <br className="hidden md:block" /> with exclusive benefits?
                        </h2>

                        {/* Start Trading Gold Button */}
                        <Link
                            href="/trade"
                            className="flex items-center mt-[10px] group trading-button-container"
                            style={{ columnGap: '5px' }}
                        >
                            <span className="font-inter font-normal text-[16px] md:text-[20px] text-[#F0B118]">
                                Start Trading Gold
                            </span>
                            <Image
                                src="/images/arrow-section.svg"
                                alt="Arrow"
                                width={16}
                                height={12}
                                className="md:w-5 md:h-4 transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                    {/* Mobile Carousel - Horizontal Scroll */}
                    <div className="md:hidden mt-[52px] ml-[20px]">
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto scrollbar-hide gap-[18px]"
                            style={{
                                scrollSnapType: 'x mandatory',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                paddingRight: 'max(20px, calc(100vw - 315px))' // Ensure last item can snap to start
                            }}
                        >
                            {BENEFITS.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 flex flex-col w-[295px] min-h-[431px] bg-[#8d8d8d]/50 p-[30px_20px]"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <div className="w-[40px] h-[40px] relative mb-[39px]">
                                        <Image
                                            src={benefit.icon}
                                            alt={benefit.title.replace('<br />', ' ')}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3
                                        className="font-serif text-[32px] font-normal text-white leading-[35px] flex items-end"
                                        style={{
                                            minHeight: '70px',
                                            marginBottom: '30px'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: benefit.title }}
                                    />
                                    <p
                                        className="text-[16px] text-[#e6e6e6] leading-[1.4]"
                                        style={{
                                            fontFamily: 'var(--font-pretendard)',
                                            fontWeight: 220,
                                            wordBreak: 'keep-all'
                                        }}
                                    >
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Page Indicator */}
                        <div className="mt-[24px] flex justify-center mr-[20px]">
                            <div className="inline-flex items-center gap-[6px] px-[6px] py-[4px]">
                                {BENEFITS.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-[2px] rounded-[30px] transition-all duration-300 ${activeIndex === index ? 'w-[50px] bg-white' : 'w-[18px] bg-[#a1a1a1]'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Benefit Cards Grid */}
                    <div
                        className="hidden md:grid grid-cols-4 gap-[20px] mt-[155px]"
                    >
                        {BENEFITS.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex flex-col w-full min-h-[431px] bg-[#8d8d8d]/50 p-[30px_20px]"
                            >
                                <div className="w-[40px] h-[40px] relative mb-[39px]">
                                    <Image
                                        src={benefit.icon}
                                        alt={benefit.title.replace('<br />', ' ')}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3
                                    className="font-serif text-[32px] font-normal text-white leading-[35px] flex items-end"
                                    style={{
                                        minHeight: '70px',
                                        marginBottom: '30px'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: benefit.title }}
                                />
                                <p
                                    className="text-[16px] text-[#e6e6e6] leading-[1.4]"
                                    style={{
                                        fontFamily: 'var(--font-pretendard)',
                                        fontWeight: 220,
                                        wordBreak: 'keep-all'
                                    }}
                                >
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}

const BENEFITS = [
    {
        icon: '/images/section3-icon1.svg',
        title: 'Cost-efficient',
        description: 'Ark Gold gives you direct exposure to investment-grade bullion without full-bar minimums or vault headaches. Start with wallet-size positions, scale up over time, and avoid the high storage and handling costs of traditional gold products.'
    },
    {
        icon: '/images/section3-icon2.svg',
        title: 'Secure and<br />regulated',
        description: 'Each Ark Gold unit is backed by LBMA-grade gold held with Korea Gold Exchange, one of Asia’s leading retail bullion providers. On-chain supply and off-chain holdings are regularly reconciled so that every token maps to real, auditable metal.'
    },
    {
        icon: '/images/section3-icon3.svg',
        title: 'instant, on-<br />chain settlement',
        description: 'Transfers of Ark Gold settle on-chain in seconds, not in T+2 days. There’s no custody hop or settlement drag between you and your gold – just final, programmable ownership that works with the rest of crypto.'
    },
    {
        icon: '/images/section3-icon4.svg',
        title: 'Redeemable<br />by the gram',
        description: 'Most gold products only let you redeem once you own enough for a full institutional bar. Ark Gold is designed around gram-level redemption, plugging into Korea Gold Exchange’s small-bar ecosystem so you can move between on-chain gold and physical grams in sizes that actually fit real life.'
    }
];
