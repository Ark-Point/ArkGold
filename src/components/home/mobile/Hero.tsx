import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:flex justify-center items-center pointer-events-none">
                <div className="relative w-full max-w-[1440px] h-full">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Hero Background"
                        fill
                        priority
                        quality={75}
                        className="object-cover object-center"
                    />
                </div>
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 flex md:hidden justify-center items-center pointer-events-none">
                <div className="relative w-full h-full">
                    <Image
                        src="/images/mobile-hero-bg.png"
                        alt="Hero Background Mobile"
                        fill
                        priority
                        quality={75}
                        className="object-cover object-center"
                    />
                </div>
            </div>

            <div className="relative z-10 w-full px-6 md:px-0">
                {/* Content (Text) */}
                <div
                    className="flex flex-col items-center text-center mt-[204px] md:mt-[248px] md:items-start md:text-left md:ml-[205px]"
                >
                    <h1 className="font-serif text-[40px] md:text-[72px] leading-tight font-normal text-white md:whitespace-nowrap">
                        Gold Now Liquid
                    </h1>
                    <p
                        className="font-sans text-[14px] md:text-[18px] text-[#7c7c7c] font-normal mt-2 md:mt-0 md:font-medium tracking-[-0.02em] md:tracking-[-0.01em]"
                        style={{
                            lineHeight: '16px',
                        }}
                    >
                        <span className="md:hidden">
                            Hold investment-grade gold with the speed <br />
                            of crypto - without leaving the metal <br />
                            behind.
                        </span>
                        <span className="hidden md:block" style={{ lineHeight: '20px' }}>
                            Hold investment-grade gold with the speed of crypto -<br />
                            without leaving the metal behind.
                        </span>
                    </p>

                    {/* Start Trading Gold Button */}
                    <Link
                        href="/trade"
                        className="flex items-center mt-[10px] group"
                        style={{ columnGap: '-4px' }}
                    >
                        <span className="font-inter font-normal text-[24px] text-[#F0B118]">
                            Start Trading Gold
                        </span>
                        <Image
                            src="/images/arrow-big.svg"
                            alt="Arrow"
                            width={50}
                            height={50}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
}
