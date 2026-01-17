"use client";

import { Badge } from "@/components/ui/badge";
import { formatCatAgeShort } from "@/lib/utils";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Heart, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recently";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
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
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 dark:text-pink-400 text-sm font-semibold mb-4">
                                <Sparkles className="h-4 w-4 fill-current" />
                                <span>Found Forever Homes</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
                                Recent{" "}
                                <span className="bg-gradient-to-r from-pink-500 to-primary bg-clip-text text-transparent">
                                    Adoptions
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                These lucky companions have recently found their perfect families.
                            </p>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link href="/adopted">
                            <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-background dark:bg-muted/50 text-foreground border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all font-medium text-sm">
                                View All Stories
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Cats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {cats.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-500"
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
                                <Badge className="absolute top-3 right-3 bg-pink-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                                    Adopted
                                </Badge>

                                {/* Overlay with Heart */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Heart className="h-12 w-12 text-pink-500 fill-pink-500 drop-shadow-lg" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 bg-gradient-to-b from-card to-muted/20">
                                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium mb-3">
                                    {cat.breed} • {formatCatAgeShort(cat.age)}
                                </p>
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-3">
                                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                                        <MapPin className="h-3 w-3 text-primary" />
                                        <span className="truncate">{cat.shelter?.name || "Shelter"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-pink-500" />
                                        <span>{formatDate(cat.adoptions?.[0]?.completedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="md:hidden flex justify-center">
                    <Link href="/adopted" className="w-full">
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-background text-foreground border border-border shadow-sm font-medium">
                            View All Stories
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
