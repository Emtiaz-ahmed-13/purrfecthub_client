import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CatCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col h-full border-border bg-card/50 backdrop-blur-sm">
            {/* Image Skeleton */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content Skeleton */}
            <CardContent className="flex-1 p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" /> {/* Name */}
                        <Skeleton className="h-4 w-24" /> {/* Breed */}
                    </div>
                    <Skeleton className="h-7 w-16 rounded-full" /> {/* Age Badge */}
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
                    <Skeleton className="h-4 w-3/4" /> {/* Description line 2 */}
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" /> {/* Map Pin Icon */}
                    <Skeleton className="h-4 w-24" /> {/* Location text */}
                </div>
            </CardContent>

            {/* Footer Skeleton */}
            <CardFooter className="grid grid-cols-2 gap-3 p-4 pt-0">
                <Skeleton className="h-10 w-full rounded-full" /> {/* Adopt Button */}
                <Skeleton className="h-10 w-full rounded-full" /> {/* Donate Button */}
            </CardFooter>
        </Card>
    );
}
