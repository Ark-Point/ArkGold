import Image from "next/image";
import { useEffect } from "react";

interface MobileToastProps {
    message: string;
    success: boolean;
    onClose: () => void;      // Manual close (immediate)
    onAutoClose: () => void;  // Auto close trigger (starts exit animation)
}

export default function MobileToast({ message, success, onClose, onAutoClose }: MobileToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onAutoClose(); // Trigger exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onAutoClose]);

    return (
        <div className="w-[357px] h-[64px] bg-white rounded-none flex items-center relative"
            style={{ padding: '12px 16px 12px 6px' }}>
            {/* Indicator */}
            <div className="w-[4px] h-[52px] rounded-full"
                style={{ backgroundColor: success ? '#00DF80' : '#F54C52' }} />

            {/* Spacer */}
            <div className="w-[2px] h-[52px]" />

            {/* Icon */}
            <div className="w-[40px] h-[40px] relative flex-shrink-0">
                <Image
                    src={success ? "/images/mobile-toast-check.svg" : "/images/mobile-toast-error.svg"}
                    alt="Status"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Spacer */}
            <div className="w-[10px] h-[52px]" />

            {/* Text */}
            <span className="font-inter font-light text-[16px] leading-[140%] text-black">
                {message}
            </span>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-[20px] right-[16px] w-[24px] h-[24px] cursor-pointer"
            >
                <Image
                    src="/images/mobile-toast-close.svg"
                    alt="Close"
                    fill
                    className="object-contain"
                />
            </button>
        </div>
    );
}
