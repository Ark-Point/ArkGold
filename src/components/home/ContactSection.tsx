"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface ContactInputProps {
    label: string;
    isLarge?: boolean;
}

function ContactInput({ label, isLarge }: ContactInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const active = isFocused || value.length > 0;

    return (
        <div
            className={`w-full bg-[#222222] border-b-2 transition-all duration-300 relative flex flex-col items-start overflow-hidden
                ${active ? 'border-[#F0B118]' : 'border-white'}`}
            style={{
                height: isLarge ? '169px' : '80px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: active ? '8px' : '25px',
                paddingBottom: '25px',
                cursor: 'text'
            }}
            onClick={() => inputRef.current?.focus()}
        >
            <span
                className={`font-sans font-light text-white transition-all duration-300 pointer-events-none
                    ${active ? 'text-[17px] mb-[8px]' : 'text-[24px]'}`}
                style={{ fontFamily: 'var(--font-pretendard)' }}
            >
                {label}
            </span>

            {isLarge ? (
                <textarea
                    ref={inputRef as any}
                    className={`w-full bg-transparent border-none outline-none text-white font-sans text-[23px] font-light p-0 m-0 resize-none h-[100px] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            ) : (
                <input
                    ref={inputRef as any}
                    type="text"
                    className={`w-full bg-transparent border-none outline-none text-white font-sans text-[23px] font-light p-0 m-0 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            )}
        </div>
    );
}

export default function ContactSection() {
    const [submitHover, setSubmitHover] = useState(false);
    return (
        <section className="w-full bg-black flex justify-center overflow-hidden">
            <div className="w-full max-w-[1440px] min-h-[900px] relative bg-black flex flex-col lg:block items-center py-20 lg:py-0">

                {/* Left Side Content */}
                <div
                    className="flex flex-col items-start px-6 lg:px-0 lg:absolute lg:z-10 lg:left-[205px] lg:top-[160px] w-full lg:w-[505px]"
                >
                    {/* "Contact Us" Title */}
                    <h2
                        className="w-full font-serif text-[32px] md:text-[54px] font-normal text-white leading-tight"
                    >
                        Contact Us
                    </h2>

                    {/* Contact Info Group */}
                    <div
                        className="w-full flex flex-col items-start mt-10 lg:mt-[60px] gap-8 lg:gap-[40px]"
                    >
                        {/* Address */}
                        <div className="w-full flex flex-col items-start gap-2 lg:h-[86px]">
                            <span
                                className="w-full font-sans text-[18px] md:text-[20px] font-normal text-[#f2f2f2]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Address
                            </span>
                            <p
                                className="w-full font-sans text-[16px] md:text-[18px] font-light text-[#f2f2f2] leading-[1.5]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                5, Yeongdong-daero 106-gil,<br />
                                Gangnam-gu, Seoul, Republic of Korea
                            </p>
                        </div>

                        {/* Tel. */}
                        <div className="w-full flex flex-col items-start gap-2 lg:h-[59px]">
                            <span
                                className="w-full font-sans text-[18px] md:text-[20px] font-normal text-[#f2f2f2]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Tel.
                            </span>
                            <p
                                className="w-full font-sans text-[16px] md:text-[18px] font-light text-[#f2f2f2] leading-[1.5]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                010-9876-1515
                            </p>
                        </div>

                        {/* E-mail */}
                        <div className="w-full flex flex-col items-start gap-2 lg:h-[59px]">
                            <span
                                className="w-full font-sans text-[18px] md:text-[20px] font-normal text-[#f2f2f2]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                E-mail
                            </span>
                            <p
                                className="w-full font-sans text-[16px] md:text-[18px] font-light text-[#f2f2f2] leading-[1.5]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                rae@arkpoint.kr
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Container */}
                <div
                    className="flex flex-col items-end w-full lg:w-[420px] px-6 lg:px-0 mt-20 lg:mt-0 lg:absolute lg:z-20 lg:left-[815px] lg:top-[175px]"
                >
                    {/* Inputs Group */}
                    <div className="w-full flex flex-col items-start gap-[33px]">
                        <ContactInput label="Email Address *" />
                        <ContactInput label="Name *" />
                        <ContactInput label="Message" isLarge />
                    </div>

                    {/* Submit Button */}
                    <div
                        className="flex items-center cursor-pointer relative z-30 mt-20 lg:mt-[120px] gap-5"
                        onMouseEnter={() => setSubmitHover(true)}
                        onMouseLeave={() => setSubmitHover(false)}
                    >
                        <div className="relative">
                            <span
                                className="font-sans text-[20px] md:text-[24px] font-light text-white block"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Submit
                            </span>
                            <div
                                className={`absolute bottom-0 left-0 h-[1.5px] bg-[#F0B118] transition-all duration-300 ease-in-out ${submitHover ? 'w-full' : 'w-0'}`}
                            />
                        </div>
                        {/* Arrow Icon */}
                        <div className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] relative">
                            <Image
                                src="/images/section5-arrow.svg"
                                alt="Arrow"
                                fill
                                className={`object-contain transition-opacity duration-300 ease-in-out ${submitHover ? 'opacity-0' : 'opacity-100'}`}
                            />
                            <Image
                                src="/images/section5-submit.svg"
                                alt="Submit"
                                fill
                                className={`object-contain transition-opacity duration-300 ease-in-out ${submitHover ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
