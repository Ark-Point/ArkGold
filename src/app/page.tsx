"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import VideoSection from "@/components/home/VideoSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import PartnersSection from "@/components/home/PartnersSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
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
      <Footer
        isSubmitting={isSubmitting}
        progress={progress}
      />
    </main>
  );
}
