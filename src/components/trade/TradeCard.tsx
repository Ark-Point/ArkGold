"use client";

import Image from "next/image";
import { useState } from "react";
import TradeForm from "./TradeForm";

const StatusIcon = () => (
    <div className="w-[22px] h-[22px] relative">
        {/* @ts-ignore */}
        <div className="absolute inset-0 bg-[#146935] opacity-60 rounded-[5px]" style={{ borderRadius: '5px', borderRadiusSmoothing: '100%' }} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[10px] h-[10px] bg-[#34C86E] rounded-full" />
        </div>
    </div>
);

export default function TradeCard() {
    const [isSell, setIsSell] = useState(false);

    const handleToggle = () => {
        setIsSell(!isSell);
    };

    return (
        <div className="relative w-[541px] h-[631px] rounded-[18px] p-[3px]">
            {/* 
        Border Gradient Layer 
        Linear gradient from Top-Left (0% #1C1B16) to (100% #88888A).
        0% stops: #1C1B16 (TL)
        46% stops: #5D5A55
        67% stops: #2E2E2E
        100% stops: #88888A (TL?) 
        Wait, user said: "0%스탑이 오른쪽 아래 모서리에 맞고, 100%스탑이 왼쪽위 모서리에 맞아."
        So 0% is Bottom-Right, 100% is Top-Left.
        Gradient direction: To Top Left.
      */}
            <div
                className="absolute inset-0 rounded-[18px]"
                style={{
                    background: 'linear-gradient(to top left, #1C1B16 0%, #5D5A55 46%, #2E2E2E 67%, #88888A 100%)'
                }}
            />

            {/* 
        Main Background Layer 
        Inset by 3px (weight 3).
        Radius 15px (18 - 3).
        Gradient: 
        100% stop at Top-Left (#474749)
        0% stop at Bottom-Right
        38% stop (#141414)
        So: Linear Gradient to Top Left?
        User said: "0%스탑쪽이 container의 오른쪽 아래 모서리에 있고, 100% 스탑이 왼쪽위 모서리에 있어."
        Stop 100% : #474749
        Stop 38% : #141414
        Stop 0% : ( IMPLIED? User said "0%스탑쪽이 ... 모서리에 있고", but didn't give color for 0%?
        Ah, "100% 스탑의 색은 #474749고, 38%스탑의 색이 #141414야."
        Maybe 0% is also #141414 or extended?
        Or maybe the user implies the gradient starts from 38%?
        I will assume 0% is the same as 38% (#141414) or pure dark, given the dark theme. 
        Actually, let's look at the background:
        "100% 스탑의 색은 #474749고, 38%스탑의 색이 #141414야."
        Typically this means it goes from #141414 (at 0-38%) to #474749 (at 100%).
      */}
            <div
                className="absolute inset-[3px] rounded-[15px] flex flex-col items-center justify-center px-[38.5px]"
                style={{
                    background: 'linear-gradient(to top left, #141414 0%, #141414 38%, #474749 100%)'
                }}
            >
                {/* Content Container - Relative to sit on top of background */}
                <div className="relative z-10 w-full flex flex-col items-center">

                    {/* Title */}
                    <h2 className="w-full text-center font-inter font-light text-[24px] tracking-[-0.03em] text-[#8C8D91]">
                        Trade Gold (Demo)
                    </h2>

                    {/* Spacer */}
                    <div className="h-[6px]" />

                    {/* Market Price Row */}
                    <div className="flex items-center">
                        <span className="font-inter font-semibold text-[40px] text-white leading-none">1g</span>
                        <div className="w-[10px]" /> {/* Spacer 10*20 */}
                        <span className="font-inter font-semibold text-[40px] text-white leading-none">=</span>
                        <div className="w-[8px]" /> {/* Spacer 8*20 */}
                        <span className="font-inter font-semibold text-[40px] text-white leading-none">₩120,000</span>
                        <div className="w-[7px]" /> {/* Spacer 7*20 */}
                        <StatusIcon />
                    </div>

                    {/* Spacer */}
                    <div className="h-[38px]" />

                    {/* Trade Form */}
                    <TradeForm isSell={isSell} onToggle={handleToggle} />

                    {/* Spacer */}
                    <div className="h-[26px]" />

                    {/* Powered By */}
                    <p className="w-full text-center font-inter font-regular text-[16px] tracking-[-0.03em] text-[#8C8D91]">
                        Powered by Korea Gold Exchange
                    </p>

                    {/* Spacer */}
                    <div className="h-[27px]" />

                    {/* Buy Button */}
                    <button
                        className={`w-[464px] h-[66px] rounded-[12px] flex items-center justify-center hover:opacity-90 transition-colors ${isSell ? 'bg-white' : 'bg-[#F0B118] hover:bg-[#E0A008]'
                            }`}
                    >
                        <span className="font-inter font-semibold text-[20px] tracking-[-0.01em] text-[#000000]">
                            {isSell ? 'SELL GOLD NOW' : 'BUY GOLD NOW'}
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
}
