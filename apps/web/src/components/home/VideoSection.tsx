import Image from "next/image";
import Link from "next/link";

export default function VideoSection() {
    return (
        <section className="w-full bg-[#1a1a1a] flex justify-center overflow-hidden">
            <div className="w-full max-w-[1440px] h-[783px] relative">
                {/* 12-column Grid Container with specific margin and gutter */}
                <div
                    className="grid grid-cols-12 h-full w-full"
                    style={{
                        paddingLeft: '100px',
                        paddingRight: '100px',
                        columnGap: '20px'
                    }}
                >
                    {/* Left Content Area */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col items-start" style={{ marginTop: '183px' }}>
                        <span className="font-serif text-[20px] font-normal text-white">
                            Dec 19, 2025 · Seoul
                        </span>

                        <h2 className="font-serif text-[54px] font-normal text-white leading-tight" style={{ marginTop: '23px' }}>
                            Get the insights
                        </h2>

                        <p
                            className="font-sans text-[18px] font-medium text-[#989898]"
                            style={{
                                marginTop: '23px',
                                lineHeight: '20px'
                            }}
                        >
                            Hold investment-grade gold with the speed of <br />
                            crypto - without leaving the metal behind.
                        </p>

                        {/* Start Trading Gold Button */}
                        <Link
                            href="/trade"
                            className="flex items-center mt-[23px] group trading-button-container video-section-fix"
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

                    {/* Right Video Area */}
                    <div
                        className="col-span-12 lg:col-span-8 flex justify-end"
                        style={{ marginTop: '183px' }}
                    >
                        <div
                            className="bg-black/40 relative overflow-hidden"
                            style={{
                                width: '741px',
                                height: '417px',
                                borderRadius: '30px'
                            }}
                        >
                            {/* Video item/placeholder would go here */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#444] font-sans">Video Placeholder (741 x 417)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
