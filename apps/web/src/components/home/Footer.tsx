"use client";

import Image from "next/image";
import Link from "next/link";

interface FooterProps {
    isSubmitting?: boolean;
    progress?: number;
}

export default function Footer({ isSubmitting, progress = 0 }: FooterProps) {
    return (
        <footer className="w-full bg-black flex justify-center overflow-hidden">
            <div className="w-full max-w-[1440px] h-[244px] relative bg-black flex flex-col items-center">

                {/* Top Line - 1240*2 (Progress Bar baseline) */}
                <div
                    className="w-[1240px] h-[2px] transition-all duration-100 ease-linear"
                    style={{
                        background: isSubmitting
                            ? `linear-gradient(to right, #F0B118 ${progress}%, white ${progress}%)`
                            : 'white'
                    }}
                />

                {/* Main Content Container - 56px gap from top line, 1240*123 */}
                <div
                    className="w-[1240px] flex flex-col items-start"
                    style={{ marginTop: '56px' }}
                >
                    {/* Logo - src/images/logo.svg */}
                    <div className="flex items-center">
                        <Image
                            src="/images/web-logo.svg"
                            alt="Logo"
                            width={200}
                            height={32}
                            className="h-[32px] w-auto object-contain"
                        />
                    </div>

                    {/* Second Row - 26px gap from logo */}
                    <div
                        className="flex items-center"
                        style={{ marginTop: '26px', gap: '20px' }}
                    >
                        <Link href="#" className="font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            Privacy Policy
                        </Link>
                        <span className="font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            |
                        </span>
                        <Link href="#" className="font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            Cookie Policy.
                        </Link>
                        <span className="font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                            |
                        </span>
                        {/* Docs Item - height 32 */}
                        <Link href="#" className="flex items-center h-[32px] gap-0">
                            <div className="w-[32px] h-[32px] relative">
                                <Image
                                    src="/images/section6-docs.svg"
                                    alt="Docs"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-sans text-[14px] font-normal text-[#f2f2f2]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                                Docs
                            </span>
                        </Link>
                    </div>

                    {/* Third Row - Copyright - 16px gap from second row */}
                    <div
                        className="flex items-center"
                        style={{ marginTop: '16px' }}
                    >
                        <p
                            className="font-sans text-[14px] font-light text-[#cacaca]"
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
