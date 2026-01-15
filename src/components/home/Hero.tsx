"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mx-auto lg:mx-0">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 500+ Shelters</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-purple-600 bg-clip-text text-transparent animate-gradient">
                Purrfect
              </span>
              <br />
              Companion
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with verified shelters, track medical records, and give a rescue cat the loving home they deserve.
              <span className="font-semibold text-foreground"> Your journey starts here.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/cats">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-pink-600 hover:scale-105"
                >
                  Adopt a Cat <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shelters">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 h-14 rounded-full border-2 hover:bg-muted/50 transition-all duration-300"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  View Shelters
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-foreground">2,500+</div>
                <div className="text-sm text-muted-foreground">Cats Adopted</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Partner Shelters</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Happy Families</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-none animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-pink-500/20 backdrop-blur-sm aspect-square sm:aspect-[4/3] lg:aspect-square border border-white/20">
              <Image
                src="/images/hero-cat.png"
                alt="Futuristic AI-generated kitten"
                fill
                className="object-cover"
                priority
              />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-background/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-border/50 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Luna adopted!</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-cyan-500/30 via-primary/30 to-purple-600/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
