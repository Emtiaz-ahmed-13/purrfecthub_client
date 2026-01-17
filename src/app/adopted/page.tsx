"use client";

import { Badge } from "@/components/ui/badge";
import { formatCatAgeShort } from "@/lib/utils";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { motion } from "framer-motion";
import { Calendar, Heart, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";

export default function AdoptedCatsPage() {
    const [cats, setCats] = useState<Cat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdoptedCats();
    }, []);

    const fetchAdoptedCats = async () => {
        try {
            const result = await CatService.getCats({ status: "ADOPTED", limit: 100 });
            setCats(result.data || []);
        } catch (error) {
            console.error("Failed to fetch adopted cats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recently";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-600 text-sm font-semibold mb-4">
                            <Sparkles className="h-4 w-4 fill-current" />
                            <span>Success Stories</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-4">
                            Our Forever{" "}
                            <span className="bg-gradient-to-r from-pink-500 to-primary bg-clip-text text-transparent">
                                Families
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Celebrating every successful adoption and the beautiful bonds formed between cats and their new companions.
                        </p>
                    </motion.div>
                </div>

                {/* Cats Grid */}
                {cats.length === 0 ? (
                    <div className="text-center py-20">
                        <FaCat className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-xl text-muted-foreground">No adopted cats to show yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cats.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-700">
                                    {cat.imageUrl || (cat.images && cat.images.length > 0) ? (
                                        <Image
                                            src={cat.imageUrl || cat.images![0]}
                                            alt={cat.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 bg-muted/50">
                                            <FaCat className="w-16 h-16" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <Badge className="absolute top-4 right-4 bg-pink-600/90 backdrop-blur-sm text-white border-0 shadow-lg px-3 py-1">
                                        Adopted
                                    </Badge>

                                    {/* Heart Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Heart className="h-16 w-16 text-pink-500 fill-pink-500 drop-shadow-2xl" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative bg-gradient-to-b from-card to-muted/20">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {cat.breed} • {formatCatAgeShort(cat.age)}
                                        </p>
                                    </div>

                                    <div className="space-y-2 border-t border-border/50 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="truncate">{cat.shelter?.name || "Independent Shelter"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 text-pink-500" />
                                            <span>Adopted: {formatDate(cat.adoptions?.[0]?.completedAt)}</span>
                                        </div>
                                    </div>

                                    {/* Decorative Sparkle */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Sparkles className="h-5 w-5 text-amber-400" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
