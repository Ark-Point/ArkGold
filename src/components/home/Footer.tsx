"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-black flex justify-center overflow-hidden">
            <div className="w-full max-w-[1440px] min-h-[244px] relative bg-black flex flex-col items-center py-10 lg:py-0">

                {/* Top White Line */}
                <div
                    className="w-full max-w-[1240px] px-6 lg:px-0"
                >
                    <div className="w-full h-[1px] md:h-[2px] bg-white opacity-20 md:opacity-100" />
                </div>

                {/* Main Content Container */}
                <div
                    className="w-full max-w-[1240px] flex flex-col items-center lg:items-start px-6 lg:px-0 mt-10 lg:mt-[56px]"
                >
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={200}
                            height={32}
                            className="h-6 md:h-[32px] w-auto object-contain"
                        />
                    </div>

                    {/* Second Row - Links */}
                    <div
                        className="flex flex-wrap items-center justify-center lg:justify-start mt-8 lg:mt-[26px] gap-x-4 gap-y-2 lg:gap-5"
                    >
                        <Link href="#" className="font-sans text-[12px] md:text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            Privacy Policy
                        </Link>
                        <span className="hidden md:inline font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            |
                        </span>
                        <Link href="#" className="font-sans text-[12px] md:text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            Cookie Policy.
                        </Link>
                        <span className="hidden md:inline font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            |
                        </span>
                        {/* Docs Item */}
                        <Link href="#" className="flex items-center h-[32px] gap-1">
                            <div className="w-6 md:w-[32px] h-6 md:h-[32px] relative">
                                <Image
                                    src="/images/section6-docs.svg"
                                    alt="Docs"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-sans text-[12px] md:text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                                Docs
                            </span>
                        </Link>
                    </div>

                    {/* Third Row - Copyright */}
                    <div
                        className="flex items-center mt-6 lg:mt-[16px]"
                    >
                        <p
                            className="font-sans text-[12px] md:text-[14px] font-light text-[#cacaca] text-center lg:text-left"
                            style={{ fontFamily: 'var(--font-pretendard)' }}
                        >
                            Copyright © 2025 Arkpoint All Rights Reserved.
                        </p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
