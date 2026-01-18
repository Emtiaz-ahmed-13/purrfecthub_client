"use client";

import { Button } from "@/components/ui/button";
import { Review, reviewService } from "@/services/review-service";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await reviewService.getReviews({
                    page,
                    limit,
                    isApproved: true
                });
                setReviews(response.data || []);
                if (response.meta) {
                    setTotalPages(Math.ceil(response.meta.total / limit));
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [page]);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-muted/30 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading reviews...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (reviews.length === 0) {
        return (
            <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-muted/30 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Be the First to Share Your Story!</h1>
                        <p className="text-muted-foreground text-lg">
                            Adopt a cat and share your experience with our community.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-sm font-semibold mb-4">
                            <Star className="h-4 w-4 fill-current" />
                            <span>Community Reviews</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-4">
                            Happy Tails from{" "}
                            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                                Our Community
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Real stories from real families who found their purrfect companions through our platform.
                        </p>
                    </motion.div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="group relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/50 hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Quote className="h-12 w-12" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 text-base line-clamp-6">
                                "{review.text}"
                            </p>

                            {/* User Info */}
                            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
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
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-foreground truncate">{review.reviewer.name}</div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {review.catName && `Adopted ${review.catName}`}
                                        {review.shelter && ` • ${review.shelter.name}`}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <Button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            variant="outline"
                            className="gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    onClick={() => {
                                        setPage(pageNum);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    variant={pageNum === page ? "default" : "outline"}
                                    className={`w-10 h-10 p-0 ${pageNum === page
                                        ? "bg-gradient-to-r from-primary to-pink-600 text-white"
                                        : ""
                                        }`}
                                >
                                    {pageNum}
                                </Button>
                            ))}
                        </div>

                        <Button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            variant="outline"
                            className="gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}

                {/* Bottom Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground text-lg">
                        Join{" "}
                        <span className="font-bold text-primary">thousands of happy families</span>{" "}
                        who found their perfect companion
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
