import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-pink-500/10 to-purple-600/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.15),transparent_70%)]"></div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-primary/20 animate-pulse">
        <Sparkles className="h-16 w-16" />
      </div>
      <div className="absolute bottom-10 right-10 text-pink-500/20 animate-pulse delay-1000">
        <Heart className="h-20 w-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <div className="animate-in fade-in zoom-in duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 text-primary text-sm font-semibold mb-6 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>Join 10,000+ Happy Cat Parents</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Ready to Make a{" "}
            <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Difference
            </span>
            ?
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you adopt, foster, or donate, your contribution changes lives. 
            <span className="font-semibold text-foreground"> Join our community of cat lovers today</span> and be part of something beautiful.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-pink-600 hover:scale-105"
              >
                Create an Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-muted/50 transition-all duration-300"
              >
                <Heart className="mr-2 h-5 w-5" />
                Make a Donation
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Verified Shelters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
