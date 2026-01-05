import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full py-6">
            <div className="container-main flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1 group">
                    {/* Logo Icon Placeholder - can be replaced with SVG later */}
                    <span className="text-xl font-serif text-white group-hover:opacity-80 transition-opacity">
                        Logo
                    </span>
                    <span className="text-xl font-serif text-white font-medium group-hover:opacity-80 transition-opacity flex items-baseline gap-1">
                        Ark Gold<span className="w-1 h-1 bg-gold inline-block mb-1"></span>
                    </span>
                </Link>

                {/* Navigation placeholder if needed */}
                <nav className="hidden md:block">
                    {/* Menu items would go here */}
                </nav>
            </div>
        </header>
    );
}
