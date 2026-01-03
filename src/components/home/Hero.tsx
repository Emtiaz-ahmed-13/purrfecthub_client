import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Find Your <span className="text-primary">Purrfect</span> Companion
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              PurrfectHub connects you with shelters to make adoption seamless. Track medical records, manage care, and give a cat a forever home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/cats">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 rounded-full h-12 shadow-md hover:shadow-lg transition-all">
                  Adopt a Cat <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shelters">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 rounded-full h-12">
                  View Shelters
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-none">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-muted/20 aspect-square sm:aspect-[4/3] lg:aspect-square">
                <Image 
                  src="/images/hero-cat.png" 
                  alt="Happy person with a cat"
                  fill
                  className="object-cover"
                  priority
                />
             </div>
             {/* Decorative elements */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
