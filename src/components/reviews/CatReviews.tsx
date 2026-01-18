"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review, reviewService } from "@/services/review-service";
import { MessageSquare, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface CatReviewsProps {
    catId: string;
    catName: string;
}

export function CatReviews({ catId, catName }: CatReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewService.getReviews({
                    catName: catName,
                    isApproved: true,
                    isVisible: true,
                    limit: 10,
                });
                setReviews(response.data || []);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [catId, catName]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400" />
                        Reviews & Success Stories
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Loading reviews...</p>
                </CardContent>
            </Card>
        );
    }

    if (reviews.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400" />
                        Reviews & Success Stories
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No reviews yet. Be the first to adopt {catName} and share your story!
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    Reviews & Success Stories
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="relative bg-muted/30 rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors"
                    >
                        {/* Quote Icon */}
                        <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

                        {/* Rating */}
                        <div className="flex gap-1 mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-sm text-foreground/90 leading-relaxed mb-4 relative z-10">
                            "{review.text}"
                        </p>

                        {/* Reviewer Info */}
                        <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                {review.reviewer.avatar ? (
                                    <img
                                        src={review.reviewer.avatar}
                                        alt={review.reviewer.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="text-lg font-bold text-primary">
                                        {review.reviewer.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-foreground truncate">
                                    {review.reviewer.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
