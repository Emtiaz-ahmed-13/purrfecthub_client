import { CTA } from "@/components/home/CTA";
import { FeaturedCats } from "@/components/home/FeaturedCats";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <FeaturedCats />
      <Testimonials />
      <CTA />
    </>
  );
}
