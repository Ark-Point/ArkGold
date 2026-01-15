"use client";

import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
    const [shouldRender, setShouldRender] = useState(isVisible);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setAnimationClass('animate-toast-enter');
        } else if (shouldRender) {
            setAnimationClass('animate-toast-exit');
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300); // Match globals.css toast-exit duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, shouldRender]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed top-6 left-1/2 z-[200] ${animationClass}`}>
            <div className="flex items-center gap-3 px-6 py-3 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full shadow-2xl min-w-[280px]">
                {/* Check Icon */}
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#34C86E]/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C86E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                <span className="flex-1 font-inter text-[14px] text-white font-medium whitespace-nowrap">
                    {message}
                </span>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-[#8C8D91] hover:text-white"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
}
