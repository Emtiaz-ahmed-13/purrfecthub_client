import { CTA } from "@/components/home/CTA";
import { FeaturedCats } from "@/components/home/FeaturedCats";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <FeaturedCats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
