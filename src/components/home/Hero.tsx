import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
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

            <div className="relative z-10 w-full">
                {/* Left Content (Text) */}
                <div
                    className="flex flex-col"
                    style={{
                        marginTop: '248px',
                        marginLeft: '205px'
                    }}
                >
                    <h1 className="font-serif text-[72px] leading-tight font-normal text-white whitespace-nowrap">
                        Gold Now Liquid
                    </h1>
                    <p
                        className="font-sans text-[18px] text-[#7c7c7c] font-medium"
                        style={{
                            lineHeight: '20px',
                            letterSpacing: '-0.01em'
                        }}
                    >
                        Hold investment-grade gold with the speed of crypto -<br />
                        without leaving the metal behind.
                    </p>
                </div>
            </div>
        </section>
    );
}
