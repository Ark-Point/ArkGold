import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 w-full pt-8">
            <div className="container-main flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <Image
                        src="/images/logo.svg"
                        alt="Ark Gold"
                        width={200}
                        height={32}
                        priority
                        className="h-[32px] w-auto group-hover:opacity-80 transition-opacity"
                    />
                </Link>

                {/* Navigation placeholder if needed */}
                <nav className="hidden md:block">
                    {/* Menu items would go here */}
                </nav>
            </div>
        </header>
    );
}
