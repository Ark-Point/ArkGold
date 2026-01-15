import React from 'react';

interface DisconnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DisconnectModal({ isOpen, onClose, onConfirm }: DisconnectModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[400px] bg-[#141414] border border-[#2E2E2E] rounded-[18px] overflow-hidden shadow-2xl animate-scale-up">
                <div className="px-10 pt-8 pb-5 flex flex-col items-center text-center">
                    <h3 className="font-inter text-[24px] text-white font-semibold mb-4">
                        Wallet Connect
                    </h3>

                    <p className="font-sans text-[16px] text-[#BCBCBC] leading-[1.5] mt-4 mb-9">
                        Do you want to disconnect your Wallet?
                    </p>

                    <div className="flex w-full gap-3 mt-3">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[41px] rounded-[10px] font-inter font-semibold text-[15px] text-white bg-[#2E2E2E] hover:bg-[#3E3E3E] transition-all cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 h-[41px] rounded-[10px] font-inter font-semibold text-[15px] text-black bg-[#F0B118] hover:bg-[#E0A008] transition-all cursor-pointer"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
