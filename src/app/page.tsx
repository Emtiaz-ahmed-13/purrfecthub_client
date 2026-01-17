import { CTA } from "@/components/home/CTA";
import { FeaturedCats } from "@/components/home/FeaturedCats";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentAdoptions } from "@/components/home/RecentAdoptions";
import { Reviews } from "@/components/home/Reviews";

export default function Home() {
  return (
    <>
      <div className="bg-background">
        <Hero />
        <Features />
        <HowItWorks />
        <FeaturedCats />
        <RecentAdoptions />
        <Reviews />
        <CTA />
      </div>
    </>
  );
}
