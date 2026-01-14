"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-black flex justify-center overflow-hidden h-[154px] md:h-auto">
            <div className="w-full max-w-[1440px] h-full relative bg-black flex flex-col items-center">

                {/* --- Mobile View (393px Target) --- */}
                <div className="flex md:hidden flex-col items-center w-[393px] h-full relative">
                    {/* Top Stroke (357*2) */}
                    <div className="w-[357px] h-[2px] bg-[#ffffff] absolute top-0 left-1/2 -translate-x-1/2" />

                    {/* Content Center Container (329*105) */}
                    <div className="mt-[32px] w-[329px] h-[105px] flex flex-col items-start font-pretendard">
                        {/* Logo (133*32) - Left Aligned */}
                        <div className="mb-[16px] flex items-start w-full">
                            <Image
                                src="/images/web-logo.svg"
                                alt="Logo"
                                width={133}
                                height={32}
                                className="w-[133px] h-[32px] object-contain"
                            />
                        </div>

                        {/* Links & Docs (Row 1) */}
                        <div className="w-full h-[32px] flex justify-between items-center text-[#cacace]">
                            <Link href="#" className="font-normal text-[14px] text-[#cacace] visited:text-[#cacace] cursor-default" onClick={(e) => e.preventDefault()}>
                                Privacy Policy.
                            </Link>
                            <span className="font-normal text-[14px]">|</span>
                            <Link href="#" className="font-normal text-[14px] text-[#cacace] visited:text-[#cacace] cursor-default" onClick={(e) => e.preventDefault()}>
                                Cookie Policy.
                            </Link>
                            <span className="font-normal text-[14px]">|</span>
                            <Link href="https://ark-gold.gitbook.io/ark-gold-docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-[4px] text-[#cacace] visited:text-[#cacace] transition-colors hover:text-[#ffffff] group">
                                <div className="w-[32px] h-[32px] relative transition-opacity group-hover:opacity-100">
                                    <Image
                                        src="/images/mobile-section6-docs.svg"
                                        alt="Docs"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-normal text-[14px]">
                                    Docs
                                </span>
                            </Link>
                        </div>

                        {/* Copyright (Row 2, Gap 8) */}
                        <div className="mt-[8px] w-full">
                            <p className="font-light text-[14px] text-[#cacace] text-left whitespace-nowrap">
                                Copyright © 2025 Arkpoint All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Desktop View (Restored to original baseline) --- */}
                <div className="hidden md:flex flex-col items-center w-full max-w-[1240px] px-6 lg:px-0 py-10 lg:py-20 font-pretendard">
                    <div className="w-full h-[1px] md:h-[2px] bg-white opacity-20 md:opacity-100 mb-[56px]" />

                    <div className="w-full flex flex-col items-center lg:items-start text-[#cacace]">
                        <Image
                            src="/images/web-logo.svg"
                            alt="Logo"
                            width={200}
                            height={32}
                            className="h-6 md:h-[32px] w-auto object-contain mb-8 lg:mb-[26px]"
                        />

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 lg:gap-5">
                            <Link href="#" className="text-[12px] md:text-[14px] font-normal text-[#cacace] visited:text-[#cacace] cursor-default" onClick={(e) => e.preventDefault()}>
                                Privacy Policy
                            </Link>
                            <span className="hidden md:inline text-[14px] font-normal text-[#cacace]">|</span>
                            <Link href="#" className="text-[12px] md:text-[14px] font-normal text-[#cacace] visited:text-[#cacace] cursor-default" onClick={(e) => e.preventDefault()}>
                                Cookie Policy.
                            </Link>
                            <span className="hidden md:inline text-[14px] font-normal text-[#cacace]">|</span>
                            <Link href="https://ark-gold.gitbook.io/ark-gold-docs" target="_blank" rel="noopener noreferrer" className="flex items-center h-[32px] gap-1 text-[#cacace] visited:text-[#cacace] hover:text-[#ffffff] transition-colors group">
                                <div className="w-6 md:w-[32px] h-6 md:h-[32px] relative transition-opacity group-hover:opacity-100">
                                    <Image
                                        src="/images/section6-docs.svg"
                                        alt="Docs"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-[12px] md:text-[14px] font-normal text-[#cacace]">
                                    Docs
                                </span>
                            </Link>
                        </div>

                        <div className="mt-6 lg:mt-[16px]">
                            <p className="text-[12px] md:text-[14px] font-light text-center lg:text-left text-[#cacace]">
                                Copyright © 2025 Arkpoint All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
