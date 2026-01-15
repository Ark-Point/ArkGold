"use client";

import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";
import {
    default as BenefitsSection,
    default as MobileBenefitsSection,
} from "@/components/home/mobile/BenefitsSection";
import MobileContactSection from "@/components/home/mobile/ContactSection";
import MobileFooter from "@/components/home/mobile/Footer";
import {
    default as Hero,
    default as MobileHero,
} from "@/components/home/mobile/Hero";
import MobilePartnersSection from "@/components/home/mobile/PartnersSection";
import MobileVideoSection from "@/components/home/mobile/VideoSection";
import PartnersSection from "@/components/home/PartnersSection";
import VideoSection from "@/components/home/VideoSection";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";

export default function Home() {
  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* PC vs Mobile Check */
  useEffect(() => {
    const handleResize = () => {
      // Consider mobile if less than 768px (Based on Tailwind md breakpoint)
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Resize event listener
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
