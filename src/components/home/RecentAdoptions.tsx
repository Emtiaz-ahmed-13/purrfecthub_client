"use client";

import { Badge } from "@/components/ui/badge";
import { formatCatAgeShort } from "@/lib/utils";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";

export function RecentAdoptions() {
    const [cats, setCats] = useState<Cat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecentAdoptions();
    }, []);

    const fetchRecentAdoptions = async () => {
        try {
            const result = await CatService.getCats({ status: "ADOPTED", limit: 4 });
            setCats(result.data || []);
        } catch (error) {
            console.error("Failed to fetch recent adoptions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || cats.length === 0) return null;

    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-24 -left-24 text-pink-500/5">
                <Heart className="h-64 w-64 rotate-12" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-600 text-sm font-semibold mb-4">
                            <Sparkles className="h-4 w-4 fill-current" />
                            <span>Found Forever Homes</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
                            Recent{" "}
                            <span className="bg-gradient-to-r from-pink-500 to-primary bg-clip-text text-transparent">
                                Adoptions
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            These lucky companions have recently found their perfect families. We're so happy for them!
                        </p>
                    </motion.div>
                </div>

                {/* Cats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cats.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-md"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square grayscale group-hover:grayscale-0 transition-all duration-700">
                                {cat.imageUrl ? (
                                    <Image
                                        src={cat.imageUrl}
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
                                <Badge className="absolute top-3 right-3 bg-pink-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                                    Adopted
                                </Badge>

                                {/* Overlay with Heart */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Heart className="h-12 w-12 text-pink-500 fill-pink-500 drop-shadow-lg" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 text-center bg-gradient-to-b from-card to-muted/20">
                                <h3 className="font-bold text-lg text-foreground mb-1">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {cat.breed} • {formatCatAgeShort(cat.age)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
