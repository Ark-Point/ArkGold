export default function VideoSection() {
    return (
        <section className="w-full bg-[#1a1a1a] flex justify-center overflow-hidden h-[670px] md:h-auto md:min-h-[783px]">
            <div className="w-full max-w-[1440px] relative flex flex-col md:block">
                {/* Mobile View (393px) */}
                <div className="flex md:hidden flex-col w-full pt-[120px] px-[32px]">
                    {/* Text Group - Auto Layout 20px gap */}
                    <div className="flex flex-col gap-[20px] items-start text-left">
                        <span className="font-serif text-[16px] font-normal text-[#fafafa]">
                            Dec 19, 2025 · Seoul
                        </span>

                        <h2 className="font-serif text-[40px] font-normal text-white leading-tight">
                            Get the insights
                        </h2>

                        <p
                            className="font-sans text-[14px] font-light text-[#949494]"
                            style={{
                                lineHeight: 'normal'
                            }}
                        >
                            Hold investment-grade gold with the speed of crypto - without leaving the metal behind.
                        </p>
                    </div>

                    {/* Video Frame - mt 80px, 361x204, radius 14px */}
                    <div className="mt-[80px] flex justify-center">
                        <div
                            className="bg-black/40 relative overflow-hidden w-[361px] h-[204px] rounded-[14px]"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#444] font-sans text-xs text-center px-4">Video Placeholder (361 x 204)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop View (Traditional 12-col grid) */}
                <div
                    className="hidden md:grid grid-cols-12 h-full w-full px-[50px]"
                    style={{
                        columnGap: '20px'
                    }}
                >
                    {/* Left Content Area */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col items-start mt-[160px]">
                        <span className="font-serif text-[20px] font-normal text-white">
                            Dec 19, 2025 · Seoul
                        </span>

                        <h2 className="font-serif text-[54px] font-normal text-white leading-tight mt-[23px]">
                            Get the insights
                        </h2>

                        <p
                            className="font-sans text-[18px] font-medium text-[#989898] mt-[23px]"
                            style={{
                                lineHeight: '20px'
                            }}
                        >
                            Hold investment-grade gold with the speed of <br />
                            crypto - without leaving the metal behind.
                        </p>
                    </div>

                    {/* Right Video Area */}
                    <div
                        className="col-span-12 lg:col-span-7 flex justify-end mt-[160px]"
                    >
                        <div
                            className="bg-black/40 relative overflow-hidden w-full aspect-video max-w-[823px] md:h-[463px] rounded-[30px]"
                        >
                            {/* Video item/placeholder would go here */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#444] font-sans text-base text-center px-4">Video Placeholder (823 x 463)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
