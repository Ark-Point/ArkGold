import Header from "@/components/layout/Header";
import MobileHero from "@/components/home/mobile/Hero";
import MobileVideoSection from "@/components/home/mobile/VideoSection";
import MobileBenefitsSection from "@/components/home/mobile/BenefitsSection";
import MobilePartnersSection from "@/components/home/mobile/PartnersSection";
import MobileContactSection from "@/components/home/mobile/ContactSection";
import MobileFooter from "@/components/home/mobile/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <MobileHero />
      <MobileVideoSection />
      <MobileBenefitsSection />
      <MobilePartnersSection />
      <MobileContactSection />
      <MobileFooter />
    </main>
  );
}
