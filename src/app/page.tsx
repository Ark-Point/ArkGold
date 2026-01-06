import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import VideoSection from "@/components/home/VideoSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import PartnersSection from "@/components/home/PartnersSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <VideoSection />
      <BenefitsSection />
      <PartnersSection />
    </main>
  );
}
