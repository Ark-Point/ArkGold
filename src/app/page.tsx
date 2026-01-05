import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
    </main>
  );
}
