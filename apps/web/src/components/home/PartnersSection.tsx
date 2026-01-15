"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";

export default function PartnersSection() {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Internal state refs to avoid closure staleness and re-render triggers
    const targetScrollRef = useRef(0);
    const currentScrollRef = useRef(0);
    const selectedIdxRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const isClickScrollingRef = useRef(false); // New lock for click-scroll
    const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const PARTNERS = useMemo(() => [
        {
            name: 'ITCEN GROUP',
            logo: '/images/ITCEN.png',
            description: "South Korea's premier IT services powerhouse, ITCEN GROUP is a global leader in Web3 and RWA tokenization. By bridging physical commodities with blockchain, it architectures a massive digital ecosystem through innovative STO frameworks that redefine modern finance."
        },
        {
            name: 'Korea gold exchange',
            logo: '/images/koreagoldexchange.png',
            description: "As the nation's largest precious metals exchange, Korea gold exchange serves as the physical foundation for the digital gold economy. It enables secure 1:1 asset-backed gold tokenization through transparent custody and verification, underpinning every digital unit with trusted physical reserves."
        }
    ], []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const animate = () => {
            if (!container) return;

            // LERP for smooth scroll
            const diff = targetScrollRef.current - currentScrollRef.current;
            currentScrollRef.current += diff * 0.1; // Balanced speed (previously 0.15)
            container.scrollTop = currentScrollRef.current;

            // Update selection state ONLY if not doing an intentional click-scroll
            if (!isClickScrollingRef.current) {
                const targetSelectionY = 393;
                const containerRect = container.getBoundingClientRect();

                let closestIdx = 0;
                let minDistance = Infinity;

                itemRefs.current.forEach((ref, index) => {
                    if (!ref) return;
                    const rect = ref.getBoundingClientRect();
                    const itemTopRelativeToContainer = rect.top - containerRect.top;

                    const distance = Math.abs(itemTopRelativeToContainer - targetSelectionY);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIdx = index;
                    }
                });

                if (closestIdx !== selectedIdxRef.current) {
                    selectedIdxRef.current = closestIdx;
                    setSelectedIdx(closestIdx);
                }
            }

            // Stop condition
            if (Math.abs(diff) < 0.1) {
                currentScrollRef.current = targetScrollRef.current;
                container.scrollTop = currentScrollRef.current;
                isAnimatingRef.current = false;
                isClickScrollingRef.current = false; // Reset lock
                return;
            }

            requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (!isAnimatingRef.current) {
                isAnimatingRef.current = true;
                requestAnimationFrame(animate);
            }
        };

        const startSnap = () => {
            isClickScrollingRef.current = false; // Snapping is part of wheel-flow, so don't lock
            const itemHeightWithGap = 57 + 48;
            const nearestIdx = Math.round(targetScrollRef.current / itemHeightWithGap);
            const clampedIdx = Math.max(0, Math.min(nearestIdx, PARTNERS.length - 1));
            targetScrollRef.current = clampedIdx * itemHeightWithGap;
            startAnimation();
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            isClickScrollingRef.current = false; // Wheel breaks click-lock
            const damping = 0.4; // Reduced sensitivity
            const maxScroll = container.scrollHeight - container.clientHeight;
            targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current + e.deltaY * damping, maxScroll));

            startAnimation();

            // Auto-snap logic after scroll stop
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
            wheelTimeoutRef.current = setTimeout(startSnap, 150);
        };

        // Click handler inside effect to keep it stable
        const handleItemClickInternal = (index: number) => {
            isClickScrollingRef.current = true; // Lock selection for this movement
            setSelectedIdx(index); // Immediate feedback
            selectedIdxRef.current = index;

            targetScrollRef.current = index * (57 + 48);
            startAnimation();
        };

        // Expose to window for the onClick handler to call
        (container as any)._handleClick = handleItemClickInternal;

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []); // Empty dependency array is critical

    return (
        <section className="w-full bg-black flex justify-center overflow-hidden">
            <div className="w-full max-w-[1440px] h-[900px] relative bg-black">

                {/* 1. Gradient Overlay (735x900) */}
                <div
                    className="absolute z-20 pointer-events-none"
                    style={{
                        width: '735px',
                        height: '100%',
                        left: '0',
                        top: '0',
                        background: 'linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, #000000 100%)'
                    }}
                />

                {/* 12-column Grid Container */}
                <div
                    className="grid grid-cols-12 w-full h-full relative z-10"
                    style={{
                        paddingLeft: '100px',
                        paddingRight: '100px',
                        columnGap: '20px'
                    }}
                >
                    {/* Picker Container - Columns 2-5 */}
                    <div
                        className="col-start-2 col-end-6 relative h-full z-30 pointer-events-auto"
                    >
                        {/* Scrollable Area */}
                        <div
                            ref={scrollContainerRef}
                            className="absolute inset-0 flex flex-col items-end overflow-hidden scrollbar-hide"
                            style={{
                                scrollbarWidth: 'none',
                            }}
                        >
                            {/* Spacer for top - Center alignment approx */}
                            <div style={{ height: '383px', flexShrink: 0 }} />

                            <div className="flex flex-col items-end w-full gap-[48px]">
                                {PARTNERS.map((partner, index) => {
                                    const isSelected = selectedIdx === index;
                                    return (
                                        <div
                                            key={index}
                                            ref={el => { itemRefs.current[index] = el; }}
                                            className="flex flex-col items-end group"
                                            style={{
                                                width: 'fit-content',
                                                height: '57px',
                                                cursor: 'pointer',
                                                position: 'relative',
                                            }}
                                            onClick={() => (scrollContainerRef.current as any)?._handleClick?.(index)}
                                        >
                                            <div
                                                className="flex items-center justify-end px-2 py-2"
                                                style={{ height: '57px', position: 'relative' }}
                                            >
                                                <span
                                                    className={`font-serif text-[40px] leading-none text-right font-light transition-colors duration-500 whitespace-nowrap ${isSelected ? 'text-[#F0B118]' : 'text-white'}`}
                                                >
                                                    {partner.name}
                                                </span>

                                                {/* Drawing Stroke Animation */}
                                                <div
                                                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F0B118]"
                                                    style={{
                                                        width: isSelected ? 'calc(100% - 16px)' : '0%',
                                                        opacity: isSelected ? 1 : 0,
                                                        transformOrigin: 'left',
                                                        transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Spacer for bottom */}
                            <div style={{ height: 'calc(900px - 393px - 57px)', flexShrink: 0 }} />
                        </div>
                    </div>

                    {/* Right Side Content - Columns 8-11 */}
                    <div
                        className="col-start-8 col-end-12 flex flex-col items-start relative h-full"
                    >
                        {/* "Partners" Title */}
                        <div
                            className="font-serif text-[54px] font-normal text-white leading-tight"
                            style={{ position: 'absolute', top: '100px' }}
                        >
                            Partners
                        </div>

                        {/* Partner Logo */}
                        <div
                            className="flex items-center justify-center"
                            style={{
                                position: 'absolute',
                                top: '386px',
                                width: '245px',
                                height: '64px'
                            }}
                        >
                            <div key={selectedIdx} className="relative w-full h-full animate-fade-in-up">
                                <div
                                    className={`relative w-full h-full ${PARTNERS[selectedIdx].name === 'Korea gold exchange'
                                        ? 'translate-x-[35px] translate-y-[5px] scale-[1.35]'
                                        : 'translate-x-[-5px] scale-[0.9]'}`}
                                >
                                    <Image
                                        src={PARTNERS[selectedIdx].logo || ""}
                                        alt={PARTNERS[selectedIdx].name}
                                        fill
                                        className={`object-contain ${PARTNERS[selectedIdx].name === 'Korea gold exchange' ? 'brightness-0 invert' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Partner Description */}
                        <div
                            key={`desc-${selectedIdx}`}
                            className="font-sans text-[20px] font-light text-white leading-[28px] animate-fade-in-up"
                            style={{
                                position: 'absolute',
                                top: '492px',
                                width: '100%',
                                height: 'auto',
                                animationDelay: '100ms'
                            }}
                        >
                            {PARTNERS[selectedIdx]?.description}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
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
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
        </section >
    );
}
