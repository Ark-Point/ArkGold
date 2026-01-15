"use client";

import DisconnectModal from "@/components/trade/DisconnectModal";
import Toast from "@/components/trade/Toast";
import TradeCard from "@/components/trade/TradeCard";
import TradeHeader from "@/components/trade/TradeHeader";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState } from "react";

import { useAccount, useDisconnect } from "wagmi";
export default function TradePage() {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { openConnectModal } = useConnectModal();

  const handleConnect = () => {
    if (!isConnected) {
      if (!!openConnectModal) {
        openConnectModal();
      }
    }
  };
  const handleDisConnect = () => {
    disconnect();
    setIsDisconnectModalOpen(false);
  };
  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center page-fade-in">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/trade-bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Background Gradients Overlay */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: `
                        linear-gradient(to bottom, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,0) 20%, 
                            rgba(0,0,0,0) 80%, 
                            rgba(0,0,0,1) 100%
                        ),
                        linear-gradient(to right, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,0) 20%, 
                            rgba(0,0,0,0) 80%, 
                            rgba(0,0,0,1) 100%
                        )
                    `,
        }}
      />

      <TradeHeader
        isConnected={isConnected}
        address={walletAddress}
        onConnect={handleConnect}
        onDisconnectClick={() => setIsDisconnectModalOpen(true)}
        onCopy={() => showToast("Wallet address copied")}
      />

      {/* Main Content Centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full min-h-[800px] px-[18px] md:px-0">
        <TradeCard isConnected={isConnected} handleConnect={handleConnect} />
      </div>

      <DisconnectModal
        isOpen={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        onConfirm={handleDisConnect}
      />

      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </main>
  );
}
