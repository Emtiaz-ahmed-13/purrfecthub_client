"use client";

import { Button } from "@/components/ui/button";
import { Review, reviewService } from "@/services/review-service";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewService.getReviews({
                    limit: 4,
                    isApproved: true
                });
                setReviews(response.data || []);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading reviews...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return (
            <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Be the First to Share Your Story!</h2>
                        <p className="text-muted-foreground">
                            Adopt a cat and share your experience with our community.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-sm font-semibold mb-4">
                            <Star className="h-4 w-4 fill-current" />
                            <span>Success Stories</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
                            Community{" "}
                            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                                Reviews
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Real stories from real families who found their purrfect companions through our platform.
                        </p>
                    </motion.div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/50 hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Quote className="h-16 w-16" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 text-base">
                                "{review.text}"
                            </p>

                            {/* User Info & Cat Info */}
                            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                <div className="flex -space-x-3">
                                    {/* Reviewer Avatar */}
                                    <div className="relative h-12 w-12 rounded-full border-2 border-card overflow-hidden bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center z-10">
                                        {review.reviewer.avatar ? (
                                            <img
                                                src={review.reviewer.avatar}
                                                alt={review.reviewer.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-xl font-bold text-primary">
                                                {review.reviewer.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    {/* Cat Avatar (if available) */}
                                    {review.adoption?.cat?.images?.[0] && (
                                        <div className="relative h-12 w-12 rounded-full border-2 border-card overflow-hidden bg-muted flex items-center justify-center">
                                            <img
                                                src={review.adoption.cat.images[0]}
                                                alt={review.adoption.cat.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-foreground truncate">{review.reviewer.name}</div>
                                    <div className="text-sm text-muted-foreground truncate italic">
                                        {review.catName && `Adopted ${review.catName}`}
                                        {review.shelter && ` • ${review.shelter.name}`}
                                    </div>
                                </div>
                                <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Reviews Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link href="/reviews">
                        <Button className="bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 text-white font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            View All Reviews
                        </Button>
                    </Link>
                    <p className="text-muted-foreground text-lg mt-4">
                        Join{" "}
                        <span className="font-bold text-primary">thousands of happy families</span>{" "}
                        who found their perfect companion
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
