"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 w-full pt-[20px] md:pt-8">
            <div className="flex items-center justify-between px-[24px] md:px-[100px]">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/logo.svg"
                        alt="Ark Gold"
                        width={104}
                        height={29}
                        priority
                        className="h-[29px] w-[104px] md:h-[32px] md:w-auto object-contain"
                    />
                </Link>

                {/* Desktop Navigation placeholder */}
                <nav className="hidden md:block">
                    {/* Menu items would go here */}
                </nav>
            </div>
        </header>
    );
}
