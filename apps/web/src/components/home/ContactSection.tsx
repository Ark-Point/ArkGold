"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface ContactInputProps {
    label: string;
    isLarge?: boolean;
    type?: 'email' | 'text';
    required?: boolean;
    errorMessage?: string;
    value: string;
    onChange: (val: string) => void;
    error: boolean;
    onBlur: () => void;
}

function ContactInput({ label, isLarge, type, required, errorMessage, value, onChange, error, onBlur }: ContactInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const active = isFocused || value.length > 0 || error;

    const handleBlur = () => {
        setIsFocused(false);
        onBlur();
    };

    return (
        <div
            className={`w-full bg-[#222222] border-b-2 transition-all duration-300 relative flex items-start overflow-hidden
                ${error ? 'border-red-500' : active ? 'border-[#F0B118]' : 'border-white'}`}
            style={{
                height: isLarge ? '169px' : '80px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '0px',
                paddingBottom: '0px',
                cursor: 'text'
            }}
            onClick={() => inputRef.current?.focus()}
        >
            <div
                className="flex flex-col flex-1 items-start h-full"
                style={{
                    paddingTop: active ? '8px' : '25px',
                    paddingBottom: active ? '16px' : '0px',
                    gap: '8px'
                }}
            >
                <span
                    className={`font-sans font-light transition-all duration-300 pointer-events-none leading-tight
                        ${error ? 'text-red-500' : 'text-white'}
                        ${active ? 'text-[17px]' : 'text-[24px]'}`}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                >
                    {error ? errorMessage : label}
                </span>

                {isLarge ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className={`w-full bg-transparent border-none outline-none text-white font-sans text-[23px] font-light p-0 m-0 resize-none flex-1 transition-opacity duration-300 leading-tight ${active ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}
                        style={{ fontFamily: 'var(--font-pretendard)' }}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        className={`w-full bg-transparent border-none outline-none text-white font-sans text-[23px] font-light p-0 m-0 flex-1 transition-opacity duration-300 leading-tight ${active ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}
                        style={{ fontFamily: 'var(--font-pretendard)' }}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                    />
                )}
            </div>

            {error && (
                <div className="flex items-center self-center ml-auto">
                    <Image
                        src="/images/section5-error.svg"
                        alt="Error"
                        width={24}
                        height={24}
                    />
                </div>
            )}
        </div>
    );
}

interface ContactSectionProps {
    isSubmitting: boolean;
    setIsSubmitting: (val: boolean) => void;
    progress: number;
    setProgress: (val: number) => void;
    showModal: boolean;
    setShowModal: (val: boolean) => void;
}

export default function ContactSection({
    isSubmitting,
    setIsSubmitting,
    progress,
    setProgress,
    showModal,
    setShowModal
}: ContactSectionProps) {
    const [submitHover, setSubmitHover] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        message: ""
    });
    const [errors, setErrors] = useState({
        email: false,
        name: false
    });

    const validateField = (name: string, value: string) => {
        if (name === 'email') {
            if (value.trim() === "") return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(value);
        }
        if (name === 'name') {
            return value.trim() === "";
        }
        return false;
    };

    const handleBlur = (name: string) => {
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, formData[name as keyof typeof formData])
        }));
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSubmit = () => {
        const emailError = validateField('email', formData.email);
        const nameError = validateField('name', formData.name);

        if (emailError || nameError) {
            setErrors({ email: emailError, name: nameError });
            return;
        }

        setIsSubmitting(true);
        setProgress(0);

        const startTime = Date.now();
        const duration = 1500;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(currentProgress);

            if (currentProgress < 100) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    setIsSubmitting(false);
                    setShowModal(true);
                }, 200);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <section className="w-full bg-black flex justify-center overflow-hidden relative">
            <div className="w-full max-w-[1440px] h-[900px] relative bg-black">

                {/* Left Side Content - Aligned to 2nd column (205px from left) */}
                <div
                    className="absolute z-10 flex flex-col items-start"
                    style={{
                        left: '205px',
                        top: '160px',
                        width: '505px'
                    }}
                >
                    {/* "Contact Us" Title */}
                    <h2
                        className="w-full font-serif text-[54px] font-normal text-white leading-tight"
                    >
                        Contact Us
                    </h2>

                    {/* Contact Info Group - 60px gap from title */}
                    <div
                        className="w-full flex flex-col items-start"
                        style={{ marginTop: '60px', gap: '40px' }}
                    >
                        {/* Address */}
                        <div className="w-full flex flex-col items-start" style={{ gap: '8px', height: '86px' }}>
                            <span
                                className="w-full font-sans text-[20px] font-normal text-[#f2f2f2]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Address
                            </span>
                            <p
                                className="w-full font-sans text-[18px] font-light text-[#f2f2f2] leading-[1.5]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                5, Yeongdong-daero 106-gil,<br />
                                Gangnam-gu, Seoul, Republic of Korea
                            </p>
                        </div>

                        {/* Tel. */}
                        <div className="w-full flex flex-col items-start" style={{ gap: '8px', height: '59px' }}>
                            <span
                                className="w-full font-sans text-[20px] font-normal text-[#f2f2f2]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Tel.
                            </span>
                            <p
                                className="w-full font-sans text-[18px] font-light text-[#f2f2f2] leading-[1.5]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                010-9876-1515
                            </p>
                        </div>

                        {/* E-mail */}
                        <div className="w-full flex flex-col items-start" style={{ gap: '8px', height: '59px' }}>
                            <span
                                className="w-full font-sans text-[20px] font-normal text-[#f2f2f2]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                E-mail
                            </span>
                            <p
                                className="w-full font-sans text-[18px] font-light text-[#f2f2f2] leading-[1.5]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                rae@arkpoint.kr
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Container - Increased z-index to 20 */}
                <div
                    className="absolute z-20 flex flex-col items-end"
                    style={{
                        left: '815px',
                        top: '175px',
                        width: '420px',
                    }}
                >
                    {/* Inputs Group */}
                    <div className="w-full flex flex-col items-start" style={{ gap: '33px' }}>
                        <ContactInput
                            label="Email Address *"
                            type="email"
                            required
                            errorMessage="Please enter your email"
                            value={formData.email}
                            onChange={(val) => handleChange('email', val)}
                            error={errors.email}
                            onBlur={() => handleBlur('email')}
                        />
                        <ContactInput
                            label="Name *"
                            required
                            errorMessage="Please enter your name"
                            value={formData.name}
                            onChange={(val) => handleChange('name', val)}
                            error={errors.name}
                            onBlur={() => handleBlur('name')}
                        />
                        <ContactInput
                            label="Message"
                            isLarge
                            value={formData.message}
                            onChange={(val) => handleChange('message', val)}
                            error={false}
                            onBlur={() => { }}
                        />
                    </div>

                    {/* Submit Button - 120px gap from message - Increased z-index to 30 */}
                    <div
                        className="flex items-center cursor-pointer relative z-30"
                        style={{
                            marginTop: '120px',
                            gap: '20px'
                        }}
                        onMouseEnter={() => setSubmitHover(true)}
                        onMouseLeave={() => setSubmitHover(false)}
                        onPointerEnter={() => setSubmitHover(true)}
                        onPointerLeave={() => setSubmitHover(false)}
                        onClick={handleSubmit}
                    >
                        <div className="relative">
                            <span
                                className="font-sans text-[24px] font-light text-white block"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Submit
                            </span>
                            <div
                                className={`absolute bottom-0 left-0 h-[1.5px] bg-[#F0B118] transition-all duration-300 ease-in-out ${submitHover ? 'w-full' : 'w-0'}`}
                            />
                        </div>
                        {/* 50*50 Arrow Icon */}
                        <div className="w-[50px] h-[50px] relative">
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

            {/* Success Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                    <div
                        className="w-[697px] h-[492px] bg-white relative flex flex-col items-start"
                        style={{ padding: '64px' }}
                    >
                        {/* Cancel Icon */}
                        <div
                            className="absolute top-[24px] right-[24px] cursor-pointer w-[24px] h-[24px]"
                            onClick={() => setShowModal(false)}
                        >
                            <Image src="/images/section5-cancel.svg" alt="Cancel" fill />
                        </div>

                        {/* Modal Content - Gap 32px */}
                        <div className="flex flex-col items-start" style={{ gap: '32px' }}>
                            {/* Content 1: Check Icon + Thanks you. */}
                            <div className="flex items-center" style={{ gap: '20px' }}>
                                <Image src="/images/section5-check.svg" alt="Check" width={54} height={54} />
                                <span className="font-serif text-[54px] font-normal text-black leading-tight">
                                    Thanks you.
                                </span>
                            </div>

                            {/* Content 2: Main Message */}
                            <p
                                className="font-sans text-[24px] font-light text-black leading-tight"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Thank you for contacting us!<br />
                                We will be in touch as soon as possible.
                            </p>

                            {/* Content 3: Email Info */}
                            <p
                                className="font-sans text-[24px] font-light text-black leading-tight"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                For further assistance, please email<br />
                                ArkGold@arkpoint.kr
                            </p>
                        </div>

                        {/* Got It Button */}
                        <div
                            className="absolute bottom-[38px] left-1/2 -translate-x-1/2 w-[248px] h-[48px] bg-black flex items-center justify-center cursor-pointer"
                            onClick={() => setShowModal(false)}
                        >
                            <span
                                className="font-sans text-[16px] font-normal text-[#f5f5f5] leading-[20px]"
                                style={{ fontFamily: 'var(--font-pretendard)' }}
                            >
                                Got it
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
