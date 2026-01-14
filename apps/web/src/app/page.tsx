"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import MobileHero from "@/components/home/mobile/Hero";
import MobileVideoSection from "@/components/home/mobile/VideoSection";
import MobileBenefitsSection from "@/components/home/mobile/BenefitsSection";
import MobilePartnersSection from "@/components/home/mobile/PartnersSection";
import MobileContactSection from "@/components/home/mobile/ContactSection";
import MobileFooter from "@/components/home/mobile/Footer";
import Hero from "@/components/home/mobile/Hero";
import VideoSection from "@/components/home/VideoSection";
import BenefitsSection from "@/components/home/mobile/BenefitsSection";
import PartnersSection from "@/components/home/PartnersSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* PC vs Mobile Check */
  useEffect(() => {
    const handleResize = () => {
      // 768px 미만이면 모바일로 간주 (Tailwind md breakpoint 기준)
      setIsMobile(window.innerWidth < 768);
    };

    // 초기값 설정
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden page-fade-in">
      {isMobile ? (
        /* Mobile View */
        <>
          <Header />
          <MobileHero />
          <MobileVideoSection />
          <MobileBenefitsSection />
          <MobilePartnersSection />
          <MobileContactSection />
          <MobileFooter />
        </>
      ) : (
        /* PC View */
        <>
          <Header />
          <Hero />
          <VideoSection />
          <BenefitsSection />
          <PartnersSection />
          <ContactSection
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            progress={progress}
            setProgress={setProgress}
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <Footer isSubmitting={isSubmitting} progress={progress} />
        </>
      )}
    </main>
  );
}
