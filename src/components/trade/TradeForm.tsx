import Image from "next/image";

// SVG for the top input background (notch at bottom)
const TopInputBackground = () => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 464 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
    >
        <defs>
            <mask id="cutout-mask-top">
                {/* 
            Path for Rect with 10px corner radius and bottom cutout.
            Clockwise:
            M 10 0 (Top Left start after corner)
            H 454 (Top edge)
            A 10 10 0 0 1 464 10 (Top Right corner)
            V 130 (Right edge)
            A 10 10 0 0 1 454 140 (Bottom Right corner)
            H 264.5 (Bottom edge right side)
            A 34 34 0 0 0 199.5 140 (Cutout arc)
            H 10 (Bottom edge left side)
            A 10 10 0 0 1 0 130 (Bottom Left corner)
            V 10 (Left edge)
            A 10 10 0 0 1 10 0 (Top Left corner)
            Z
         */}
                <path d="M10 0H454A10 10 0 0 1 464 10V130A10 10 0 0 1 454 140H264.5A34 34 0 0 0 199.5 140H10A10 10 0 0 1 0 130V10A10 10 0 0 1 10 0Z" fill="white" />
            </mask>
        </defs>
        <path
            d="M10 0H454A10 10 0 0 1 464 10V130A10 10 0 0 1 454 140H264.5A34 34 0 0 0 199.5 140H10A10 10 0 0 1 0 130V10A10 10 0 0 1 10 0Z"
            fill="#131418"
            stroke="#3B3C40"
            strokeWidth="4"
            mask="url(#cutout-mask-top)"
        />
    </svg>
);

// SVG for the botton input background (flipped Top Input)
const BottomInputBackground = () => (
    <div className="absolute inset-0 w-full h-full pointer-events-none rotate-180">
        <TopInputBackground />
    </div>
);


interface TradeFormProps {
    isSell: boolean;
    onToggle: () => void;
}

export default function TradeForm({ isSell, onToggle }: TradeFormProps) {
    return (
        <div className="relative w-[464px] flex flex-col items-center">

            {/* Top Section */}
            <div className="relative w-full h-[140px] px-[16px] py-[10px]">
                <TopInputBackground />

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-start pb-[8px]">
                    <div className="w-full flex flex-col gap-[8px]">
                        {/* Top Label Row */}
                        <div className="w-full flex items-center justify-between">
                            <span className={`font-inter text-[18px] leading-none ${isSell ? 'text-[#A89E85]' : 'text-[#8C8D91]'}`}>
                                {isSell ? 'You Sell (AGLD)' : 'You Pay (KRW)'}
                            </span>
                            {isSell && (
                                <span className="font-inter text-[18px] text-[#8C8D91] leading-none animate-fade-in">
                                    Balance: 50.0g
                                </span>
                            )}
                        </div>

                        {/* Top Value */}
                        <span
                            key={`top-value-${isSell}`}
                            className={`font-inter font-semibold text-[44px] leading-none animate-fade-in ${isSell ? 'text-[#F0B118]' : 'text-white'}`}
                        >
                            {isSell ? '10.0' : '1,245,000'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-[20px] w-full" />

            {/* Middle Button */}
            <div className="absolute top-[125px] z-20">
                <button
                    onClick={onToggle}
                    className="w-[50px] h-[50px] rounded-full overflow-hidden hover:opacity-90 transition-opacity"
                >
                    <div className={`transition-transform duration-500 ${isSell ? 'rotate-180' : 'rotate-0'}`}>
                        <Image
                            src={isSell ? "/images/trade-button-sell.svg" : "/images/trade-button-buy.svg"}
                            alt="Switch"
                            width={50}
                            height={50}
                        />
                    </div>
                </button>
            </div>

            {/* Bottom Section */}
            <div className="relative w-full h-[140px] px-[16px] py-[10px]">
                <BottomInputBackground />

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-start pt-[8px]">
                    <div className="w-full flex flex-col gap-[8px]">
                        <span className={`font-inter text-[18px] leading-none ${isSell ? 'text-[#8C8D91]' : 'text-[#A89E85]'}`}>
                            {isSell ? 'You Receive (KRW)' : 'You Receive (AGLD)'}
                        </span>
                        <span
                            key={`bottom-value-${isSell}`}
                            className={`font-inter font-semibold text-[44px] leading-none animate-fade-in ${isSell ? 'text-white' : 'text-[#F0B118]'}`}
                        >
                            {isSell ? '1,240,000' : '10.0'}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
