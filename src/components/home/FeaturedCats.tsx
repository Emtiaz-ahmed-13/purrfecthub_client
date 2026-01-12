"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cat } from "@/models/types";
import { Heart, Info, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaCat } from "react-icons/fa";

import { formatCatAgeShort } from "@/lib/utils";
import { CatService } from "@/services/cat-service";
import { useEffect, useState } from "react";
import { CatCardSkeleton } from "../cat/CatCardSkeleton";

export function FeaturedCats() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFeaturedCats();
  }, []);

  const fetchFeaturedCats = async () => {
    try {
      const result = await CatService.getCats({ status: "AVAILABLE" });
      // Take only the first 4 for featured section
      setCats((result.data || []).slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch featured cats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (catId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(catId)) {
        newSet.delete(catId);
      } else {
        newSet.add(catId);
      }
      return newSet;
    });
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 text-primary/10">
        <Sparkles className="h-32 w-32" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-600 text-sm font-semibold mb-4">
              <Heart className="h-4 w-4 fill-current" />
              <span>Featured This Week</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-2">
              Meet Your Future{" "}
              <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                Best Friend
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              These adorable cats are waiting for a loving home like yours. Each one has a unique personality ready to bring joy to your life.
            </p>
          </div>
          <Link href="/cats" className="hidden lg:block animate-in fade-in slide-in-from-right-4 duration-700">
            <Button variant="outline" size="lg" className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              View All Cats →
            </Button>
          </Link>
        </div>

        {/* Cats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <CatCardSkeleton key={i} />
            ))
          ) : cats.map((cat, index) => (
            <div
              key={cat.id}
              className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 animate-in fade-in zoom-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 bg-muted/50">
                    <FaCat className="w-16 h-16" />
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Status Badge */}
                <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 shadow-lg">
                  Available
                </Badge>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(cat.id)}
                  className="absolute top-3 left-3 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${favorites.has(cat.id)
                      ? "fill-pink-500 text-pink-500"
                      : "text-muted-foreground"
                      }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-card to-card/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{cat.breed}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {formatCatAgeShort(cat.age)}
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                  <span>{cat.location}</span>
                </div>

                <Link href={`/cats/${cat.id}`} className="mt-auto w-full">
                  <Button className="w-full rounded-full bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    View Details <Info className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <Link href="/cats">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-2">
              View All Cats
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
