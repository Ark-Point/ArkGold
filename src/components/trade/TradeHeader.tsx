import Image from "next/image";
import Link from "next/link";

export default function TradeHeader() {
    return (
        <header className="fixed top-0 left-0 w-full h-[80px] z-50 flex items-center px-[100px]">
            <Link href="/" className="relative w-[140px] h-[32px] cursor-pointer"> {/* Aspect ratio estimate based on logo context, user said 'web-logo.svg' */}
                <Image
                    src="/images/web-logo.svg"
                    alt="Ark Gold Logo"
                    width={180} // Estimated width, will be constrained by container or height
                    height={32}
                    className="h-full w-auto object-contain object-left"
                    priority
                />
            </Link>
        </header>
    );
}
