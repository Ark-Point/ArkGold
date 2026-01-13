import TradeHeader from "@/components/trade/TradeHeader";
import TradeCard from "@/components/trade/TradeCard";
import Image from "next/image";

export default function TradePage() {
    return (
        <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center page-fade-in">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/trade-bg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* 
        Overlay Gradients 
        1. Vertical: Middle Top -> Middle Bottom. Black -> Transparent -> Black.
        0% #000000 100%
        20% #000000 0%
        80% #000000 0%
        100% #000000 100%
      */}
            <div
                className="absolute inset-0 z-1 pointer-events-none"
                style={{
                    background: `
                linear-gradient(to bottom, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0) 20%, 
                    rgba(0,0,0,0) 80%, 
                    rgba(0,0,0,1) 100%
                ),
                linear-gradient(to right, 
                    rgba(0,0,0,1) 0%, 
                    rgba(0,0,0,0) 20%, 
                    rgba(0,0,0,0) 80%, 
                    rgba(0,0,0,1) 100%
                )
            `
                }}
            />

            <TradeHeader />

            {/* Main Content Centered */}
            <div className="relative z-10 flex-1 flex items-center justify-center w-full min-h-[800px]">
                <TradeCard />
            </div>
        </main>
    );
}
