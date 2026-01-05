import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative min-h-screen w-full flex items-center overflow-hidden pt-20 bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
                <div className="relative w-full max-w-[1440px] h-full">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Hero Background"
                        fill
                        priority
                        quality={100}
                        className="object-cover object-center"
                    />
                </div>
            </div>

            <div className="container-main grid grid-cols-12 gap-5 h-full items-center relative z-10">
                {/* Left Content (Text) - Spanning 6 columns */}
                <div className="col-span-12 lg:col-span-6 flex flex-col justify-center space-y-6">
                    <h1 className="font-serif text-[72px] leading-tight font-medium text-white whitespace-nowrap">
                        Gold Now Liquid
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-[#7c7c7c] max-w-md font-light leading-relaxed">
                        Hold investment-grade gold with the speed of crypto - without leaving the metal behind.
                    </p>
                </div>
            </div>
        </section>
    );
}
