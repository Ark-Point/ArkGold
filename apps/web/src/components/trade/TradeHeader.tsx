import Image from "next/image";
import Link from "next/link";

interface TradeHeaderProps {
    isConnected: boolean;
    onConnect: () => void;
}

export default function TradeHeader({ isConnected, onConnect }: TradeHeaderProps) {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 w-full pt-[20px] md:pt-[24px]">
            <div className="flex items-center justify-between px-[24px] md:px-[100px]">
                <Link href="/" className="flex items-center">
                    {/* Mobile Logo */}
                    <Image
                        src="/images/mobile-logo.svg"
                        alt="Ark Gold"
                        width={104}
                        height={29}
                        priority
                        className="md:hidden h-[29px] w-[104px] object-contain"
                    />
                    {/* Desktop Logo */}
                    <Image
                        src="/images/web-logo.svg"
                        alt="Ark Gold"
                        width={200}
                        height={32}
                        priority
                        className="hidden md:block h-[32px] w-auto object-contain"
                    />
                </Link>

                {!isConnected && (
                    <button
                        onClick={onConnect}
                        className="h-[28px] md:h-[32px] px-[12px] md:px-[14px] rounded-[10px] bg-[#F0B118] text-[#000000] font-inter font-semibold text-[12px] md:text-[13px] hover:bg-[#E0A008] transition-all cursor-pointer"
                    >
                        Connect
                    </button>
                )}
            </div>
        </header>
    );
}
