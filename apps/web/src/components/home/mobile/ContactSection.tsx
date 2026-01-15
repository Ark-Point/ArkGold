"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MobileToast from "./MobileToast";

interface ContactInputProps {
    id: string;
    label: string;
    isLarge?: boolean;
    required?: boolean;
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
    errorMessage?: string;
    onBlur?: () => void;
    onFocus?: () => void;
}

function ContactInput({ id, label, isLarge, value, onChange, error, errorMessage, onBlur, onFocus }: ContactInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const active = isFocused || value.length > 0 || hasBeenFocused;

    const handleFocus = () => {
        setIsFocused(true);
        setHasBeenFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    return (
        <div className="relative w-full">
            <div
                className={`relative flex flex-col items-start overflow-hidden transition-all duration-300 w-full
                    ${isLarge ? 'h-[169px]' : 'h-[64px] md:h-[80px]'}
                    ${isLarge ? '' : 'max-w-[358px] md:max-w-full'}
                    bg-[#222222]
                    px-[16px] md:px-[20px] cursor-text`}
                onClick={() => {
                    const input = document.getElementById(`mobile-${id}`) as HTMLInputElement;
                    if (input) {
                        input.focus();
                    }
                }}
            >
                {/* Mobile View Layout (md:hidden) */}
                <div className={`md:hidden w-full h-full flex flex-col relative transition-all duration-300 ${active ? 'justify-start pt-[6.5px]' : 'justify-center'}`}>
                    <div className={`relative w-full flex flex-col`}>
                        {/* Two-line Text Container */}
                        <div className="flex flex-col relative">
                            {/* Label or Error Message (16px when active, 21px when inactive) */}
                            <span
                                className={`font-pretendard transition-all duration-300 font-light leading-none pointer-events-none
                                    ${error ? 'text-[#FF0000]' : 'text-[#e0e0e0]'}
                                    ${active ? 'text-[16px]' : 'text-[21px]'}`}
                            >
                                {error && errorMessage ? errorMessage : label}
                            </span>

                            {/* Input/Value (21px) */}
                            <div
                                className={`mt-[4px] transition-opacity duration-300 ${active || isLarge ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}
                            >
                                {isLarge ? (
                                    <textarea
                                        ref={inputRef as any}
                                        id={`mobile-${id}`}
                                        className="w-full bg-transparent border-none outline-none text-white font-pretendard text-[21px] font-light p-0 m-0 resize-none h-[110px]"
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                ) : (
                                    <input
                                        ref={inputRef as any}
                                        id={`mobile-${id}`}
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-white font-pretendard text-[21px] font-light p-0 m-0 h-[21px] leading-none"
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right Icon (Mobile) - 24x24 size */}
                        <div className={`absolute right-0 flex items-center pointer-events-auto ${isLarge ? 'top-0' : 'top-1/2 -translate-y-1/2'}`}>
                            {error ? (
                                <div className="w-[24px] h-[24px] relative">
                                    <Image src="/images/mobile-section5-error.svg" alt="Error" fill className="object-contain" />
                                </div>
                            ) : (
                                value.length > 0 && (
                                    <div
                                        className="w-[24px] h-[24px] relative cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange("");
                                            const input = document.getElementById(`mobile-${id}`) as HTMLInputElement;
                                            if (input) input.focus();
                                        }}
                                    >
                                        <Image src="/images/mobile-section5-cancel.svg" alt="Cancel" fill className="object-contain" />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop View Layout (hidden md:flex) */}
                <div className="hidden md:flex flex-col w-full h-full justify-center">
                    <span
                        className={`transition-all duration-300 pointer-events-none font-pretendard font-light text-white
                        ${active ? 'text-[17px] mb-[8px]' : 'text-[24px]'}`}
                    >
                        {error && errorMessage ? errorMessage : label}
                    </span>

                    {isLarge ? (
                        <textarea
                            ref={inputRef as any}
                            id={`desktop-${id}`}
                            className={`w-full bg-transparent border-none outline-none text-white font-pretendard text-[23px] font-light p-0 m-0 resize-none h-[100px] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    ) : (
                        <input
                            ref={inputRef as any}
                            id={`desktop-${id}`}
                            type="text"
                            className={`w-full bg-transparent border-none outline-none text-white font-pretendard text-[23px] font-light p-0 m-0 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'}`}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    )}
                </div>

                {/* Default Understroke (White or Red based on error state, 1px) */}
                <div className={`absolute bottom-0 left-0 w-full h-[1px] ${error ? 'bg-[#FF0000]' : 'bg-white'}`} />

                {/* Animated Focus Understroke (Main Color, Weight 2) */}
                <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#F0B118] transition-all duration-500 ease-in-out ${isFocused ? 'w-full' : 'w-0'}`}
                />
            </div>
        </div>
    );
}

export default function ContactSection() {
    const [submitHover, setSubmitHover] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        message: ""
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [touched, setTouched] = useState({
        email: false,
        name: false
    });
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [toastSuccess, setToastSuccess] = useState(true);
    const containerRef = useRef<HTMLElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isEmailValid = formData.email.trim().length > 0 && formData.email.includes("@") && formData.email.includes(".");
    const isNameValid = formData.name.trim().length > 0;
    const isFormValid = isEmailValid && isNameValid;

    const showEmailError = touched.email && !isEmailValid;
    const showNameError = touched.name && !isNameValid;

    // Group-based scroll: Position bottom of [current input + next element] 24px above keyboard
    const scrollToInputGroup = (fieldId: string) => {
        if (!window.visualViewport) return;

        const viewport = window.visualViewport;
        const viewportHeight = viewport.height;

        // Find wrapper of currently focused input
        const currentInput = document.getElementById(`mobile-${fieldId}`);
        if (!currentInput) return;

        const currentWrapper = currentInput.closest('.relative.w-full') as HTMLElement;
        if (!currentWrapper) return;

        // Find next element
        let nextElement: HTMLElement | null = null;

        if (fieldId === 'email') {
            // Email -> Name input wrapper
            const nameInput = document.getElementById('mobile-name');
            nextElement = nameInput?.closest('.relative.w-full') as HTMLElement;
        } else if (fieldId === 'name') {
            // Name -> Message input wrapper
            const messageInput = document.getElementById('mobile-message');
            nextElement = messageInput?.closest('.relative.w-full') as HTMLElement;
        } else if (fieldId === 'message') {
            // Message -> Submit button
            nextElement = document.querySelector('.mobile-submit-button') as HTMLElement;
        }

        if (!nextElement) return;

        // Bottom position of next element (viewport based)
        const nextElementRect = nextElement.getBoundingClientRect();
        const nextElementBottom = nextElementRect.bottom;

        // Goal: Position next element bottom 24px above viewport bottom
        const targetPosition = viewportHeight - 24;
        const scrollAmount = nextElementBottom - targetPosition;

        // Execute scroll
        if (scrollAmount > 0) {
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Visual Viewport API - Keyboard detection and auto scroll
    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) return;

        const handleViewportChange = () => {
            const viewport = window.visualViewport;
            if (!viewport) return;

            const viewportHeight = viewport.height;
            const windowHeight = window.innerHeight;
            const calculatedKeyboardHeight = windowHeight - viewportHeight;

            // Update keyboard height (Consider keyboard if > 100px)
            if (calculatedKeyboardHeight > 100) {
                setKeyboardHeight(calculatedKeyboardHeight);

                // Scroll after keyboard is fully up (debounce)
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                scrollTimeoutRef.current = setTimeout(() => {
                    // Execute group scroll if field is focused
                    if (focusedField) {
                        scrollToInputGroup(focusedField);
                    }
                }, 100);
            } else {
                setKeyboardHeight(0);
            }
        };

        // Detect both resize and scroll events
        window.visualViewport.addEventListener('resize', handleViewportChange);
        window.visualViewport.addEventListener('scroll', handleViewportChange);

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleViewportChange);
                window.visualViewport.removeEventListener('scroll', handleViewportChange);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [focusedField]);

    // Group scroll on input focus
    const handleFocus = (fieldId: string) => {
        setFocusedField(fieldId);

        // Group scroll after waiting for keyboard animation
        setTimeout(() => {
            scrollToInputGroup(fieldId);
        }, 400);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const handleSubmit = () => {
        // Dismiss keyboard
        (document.activeElement as HTMLElement)?.blur();
        setFocusedField(null);

        // Form validation
        if (isFormValid) {
            // Success: Reset form and restore button default state
            setFormData({ email: "", name: "", message: "" });
            setTouched({ email: false, name: false });
            setToastSuccess(true);
            setShowToast(true);
        } else {
            // Failure: Keep button active (Retry available)
            setToastSuccess(false);
            setShowToast(true);
        }
    };

    return (
        <section
            ref={containerRef}
            className="w-full bg-black flex justify-center overflow-hidden md:h-auto transition-all duration-300"
            style={{
                height: keyboardHeight > 0 ? 'auto' : '949px',
                paddingBottom: keyboardHeight > 0 ? `${keyboardHeight + 100}px` : '0px'
            }}
        >
            <div className="w-full max-w-[1440px] h-full relative bg-black flex flex-col lg:block items-center">

                {/* --- Mobile View Content (393px Target) --- */}
                <div className="flex md:hidden flex-col items-center w-full h-full">

                    {/* Top Text Content Container (357*367) */}
                    <div className="mt-[60px] w-[357px] h-[367px] px-[16px] py-[36px] flex flex-col items-center gap-[40px]">
                        {/* 1. Headline */}
                        <h2 className="font-serif text-[42px] font-normal text-white text-center leading-none">
                            Contact Us
                        </h2>

                        {/* 2. Contact Info Group (gap 20) */}
                        <div className="flex flex-col items-center gap-[20px] w-full">
                            <div className="flex flex-col items-center gap-[4px] w-full">
                                <span className="font-pretendard font-medium text-[18px] text-[#e8e8e8] text-center">Address</span>
                                <p className="font-pretendard font-light text-[16px] leading-[1.2] text-[#e0e0e0] text-center">
                                    5, Yeongdong-daero 106-gil,<br />Gangnam-gu, Seoul, Republic of Korea
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-[4px] w-full">
                                <span className="font-pretendard font-medium text-[18px] text-[#e8e8e8] text-center">Tel.</span>
                                <p className="font-pretendard font-light text-[16px] leading-[1.2] text-[#e0e0e0] text-center">010-9876-1515</p>
                            </div>
                            <div className="flex flex-col items-center gap-[4px] w-full">
                                <span className="font-pretendard font-medium text-[18px] text-[#e8e8e8] text-center">E-mail</span>
                                <p className="font-pretendard font-light text-[16px] leading-[1.2] text-[#e0e0e0] text-center">rae@arkpoint.kr</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form Container */}
                    <div className="flex flex-col items-center w-full px-[18px] mt-[0px] gap-[24px]">
                        <div className="w-[358px] flex flex-col items-center gap-[24px]">
                            <ContactInput
                                id="email"
                                label="Email Address *"
                                value={formData.email}
                                onChange={(v) => setFormData(prev => ({ ...prev, email: v }))}
                                error={showEmailError}
                                errorMessage="Please enter your email"
                                onFocus={() => handleFocus("email")}
                                onBlur={() => {
                                    setTouched(prev => ({ ...prev, email: true }));
                                    handleBlur();
                                }}
                            />
                            <ContactInput
                                id="name"
                                label="Name *"
                                value={formData.name}
                                onChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
                                error={showNameError}
                                errorMessage="Please enter your name"
                                onFocus={() => handleFocus("name")}
                                onBlur={() => {
                                    setTouched(prev => ({ ...prev, name: true }));
                                    handleBlur();
                                }}
                            />
                            <ContactInput
                                id="message"
                                label="Message"
                                isLarge
                                value={formData.message}
                                onChange={(v) => setFormData(prev => ({ ...prev, message: v }))}
                                onFocus={() => handleFocus("message")}
                                onBlur={handleBlur}
                            />
                        </div>

                        {/* Submit Button (Mobile Spec) */}
                        <div
                            className={`mobile-submit-button w-[358px] h-[64px] relative flex items-center justify-center cursor-pointer transition-all duration-300
                                ${isFormValid ? 'bg-[#F0B118] border-none' : 'bg-black border-[1px] border-white'}`}
                            onClick={handleSubmit}
                        >
                            <span className={`font-pretendard transition-colors duration-300 ${isFormValid ? 'text-black font-normal' : 'text-white font-light'} text-[21px]`}>
                                Submit
                            </span>
                            <div className="absolute right-0 flex items-center h-full">
                                <div className="flex items-center">
                                    <div className="relative w-[32px] h-[32px]">
                                        <Image
                                            src={isFormValid ? "/images/mobile-section5-submit.svg" : "/images/mobile-section5-arrow.svg"}
                                            alt="Action"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="w-[8px] h-full" />
                                </div>
                            </div>
                        </div>

                        {/* Toast Message */}
                        {showToast && (
                            <div
                                className={`fixed bottom-[70px] left-1/2 z-[9999] ${isClosing ? 'animate-toast-exit' : 'animate-toast-enter'}`}
                                onAnimationEnd={() => {
                                    if (isClosing) {
                                        setShowToast(false);
                                        setIsClosing(false);
                                    }
                                }}
                            >
                                <MobileToast
                                    message={toastSuccess ? 'submitted successfully.' : 'Submission failed.'}
                                    success={toastSuccess}
                                    onClose={() => {
                                        // Manual close: immediate removal
                                        setShowToast(false);
                                        setIsClosing(false);
                                    }}
                                    onAutoClose={() => {
                                        // Auto close: start exit animation
                                        setIsClosing(true);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Desktop View (Original 12-col / Absolute) --- */}
                <div className="hidden md:flex flex-col lg:block items-center md:min-h-[900px] w-full">
                    <div className="flex flex-col items-start px-6 lg:px-0 lg:absolute lg:z-10 lg:left-[205px] lg:top-[160px] w-full lg:w-[505px]">
                        <h2 className="w-full font-serif text-[32px] md:text-[54px] font-normal text-white leading-tight">Contact Us</h2>
                        <div className="w-full flex flex-col items-start mt-10 lg:mt-[60px] gap-8 lg:gap-[40px]">
                            <div className="w-full flex flex-col items-start gap-2">
                                <span className="font-pretendard text-[18px] md:text-[20px] font-normal text-[#f2f2f2]">Address</span>
                                <p className="font-pretendard text-[16px] md:text-[18px] font-light text-[#f2f2f2] leading-[1.5]">
                                    5, Yeongdong-daero 106-gil,<br />Gangnam-gu, Seoul, Republic of Korea
                                </p>
                            </div>
                            <div className="w-full flex flex-col items-start gap-2">
                                <span className="font-pretendard text-[18px] md:text-[20px] font-normal text-[#f2f2f2]">Tel.</span>
                                <p className="font-pretendard text-[16px] md:text-[18px] font-light text-[#f2f2f2] leading-[1.5]">010-9876-1515</p>
                            </div>
                            <div className="w-full flex flex-col items-start gap-2">
                                <span className="font-pretendard text-[18px] md:text-[20px] font-normal text-[#f2f2f2]">E-mail</span>
                                <p className="font-pretendard text-[16px] md:text-[18px] font-light text-[#f2f2f2] leading-[1.5]">rae@arkpoint.kr</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end w-full lg:w-[420px] px-6 lg:px-0 mt-20 lg:mt-0 lg:absolute lg:z-20 lg:left-[815px] lg:top-[175px]">
                        <div className="w-full flex flex-col items-start gap-[33px]">
                            <ContactInput
                                id="desktop-email"
                                label="Email Address *"
                                value={formData.email}
                                onChange={(v) => setFormData(prev => ({ ...prev, email: v }))}
                            />
                            <ContactInput
                                id="desktop-name"
                                label="Name *"
                                value={formData.name}
                                onChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
                            />
                            <ContactInput
                                id="desktop-message"
                                label="Message"
                                isLarge
                                value={formData.message}
                                onChange={(v) => setFormData(prev => ({ ...prev, message: v }))}
                            />
                        </div>

                        <div
                            className="flex items-center cursor-pointer relative z-30 mt-20 lg:mt-[120px] gap-5"
                            onMouseEnter={() => setSubmitHover(true)}
                            onMouseLeave={() => setSubmitHover(false)}
                        >
                            <div className="relative">
                                <span className="font-pretendard text-[20px] md:text-[24px] font-light text-white block">Submit</span>
                                <div className={`absolute bottom-0 left-0 h-[1.5px] bg-[#F0B118] transition-all duration-300 ease-in-out ${submitHover ? 'w-full' : 'w-0'}`} />
                            </div>
                            <div className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] relative">
                                <Image src="/images/section5-arrow.svg" alt="Arrow" fill className={`object-contain transition-opacity duration-300 ease-in-out ${submitHover ? 'opacity-0' : 'opacity-100'}`} />
                                <Image src="/images/section5-submit.svg" alt="Submit" fill className={`object-contain transition-opacity duration-300 ease-in-out ${submitHover ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
