"use client";

import { DonationHistory } from "@/components/donation/DonationHistory";
import { DonationModal } from "@/components/donation/DonationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { AdoptionApplication, Cat, UserRole } from "@/models/types";
import { AdoptionService } from "@/services/adoption-service";
import { CatService } from "@/services/cat-service";
import { DonationService } from "@/services/donation-service";
import { reviewService } from "@/services/review-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCat } from "react-icons/fa";
import { toast } from "sonner";
import * as z from "zod";

const applicationSchema = z.object({
    message: z.string().min(10, "Please provide a bit more detail (min 10 chars)"),
    homeType: z.string().optional(),
    hasOtherPets: z.boolean().default(false).optional(),
    otherPetsInfo: z.string().optional(),
    experience: z.string().optional(),
});

export default function AdopterDashboard() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <AdopterDashboardContent />
        </Suspense>
    );
}

function AdopterDashboardContent() {
    const { user, isLoading, logout } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [availableCats, setAvailableCats] = useState<Cat[]>([]);
    const [myApplications, setMyApplications] = useState<AdoptionApplication[]>([]);
    const [isCatsLoading, setIsCatsLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<AdoptionApplication | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

    const form = useForm<z.infer<typeof applicationSchema>>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            message: "",
            homeType: "",
            hasOtherPets: false,
            otherPetsInfo: "",
            experience: "",
        }
    });

    useEffect(() => {
        if (!isLoading && user && user.role !== UserRole.ADOPTER) {
            router.push("/");
        }

        // Pre-fill form from user profile
        if (user) {
            form.reset({
                message: "",
                homeType: user.homeType || "",
                hasOtherPets: !!user.hasOtherPets,
                otherPetsInfo: user.otherPetsInfo || "",
                experience: user.experience || "",
            });
        }
    }, [user, isLoading, router, form]);

    useEffect(() => {
        if (user?.role === UserRole.ADOPTER) {
            fetchCats();
            fetchApplications();
        }
    }, [user]);

    useEffect(() => {
        const paymentStatus = searchParams.get("payment_status");
        const sessionId = searchParams.get("session_id");

        if (paymentStatus === "success" && sessionId) {
            const verifyPayment = async () => {
                try {
                    await DonationService.verifyPayment(sessionId);
                    toast.success("Payment verified! Thank you for your donation.");
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                } catch (error) {
                    console.error("Payment verification failed:", error);
                    toast.error("Could not verify payment. Please contact support.");
                }
            };
            verifyPayment();
        }
    }, [searchParams]);

    const fetchCats = async () => {
        try {
            // Fetch all cats to ensure applied ones stay in the list
            const result = await CatService.getCats({});
            setAvailableCats(result.data || []);
        } catch (error) {
            console.error("Failed to fetch cats:", error);
        } finally {
            setIsCatsLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const result = await AdoptionService.getMyApplications();
            setMyApplications(result.data || []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        }
    };

    const handleCancelApplication = async (applicationId: string) => {
        try {
            await AdoptionService.cancelApplication(applicationId);
            toast.success("Application cancelled successfully");
            fetchApplications();
            fetchCats();
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel application");
        }
    };

    const canCancelApplication = (createdAt: string) => {
        const created = new Date(createdAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return hoursDiff < 5;
    };

    const getRemainingTime = (createdAt: string) => {
        const created = new Date(createdAt);
        const deadline = new Date(created.getTime() + 5 * 60 * 60 * 1000);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();

        if (diff <= 0) return "Expired";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m remaining`;
    };

    const getApplicationForCat = (catId: string) => {
        return myApplications.find(app => app.catId === catId);
    };

    const onSubmitApplication = async (values: z.infer<typeof applicationSchema>) => {
        if (!selectedCat) return;
        try {
            await AdoptionService.submitApplication({
                catId: selectedCat.id,
                ...values
            });
            toast.success(`Application for ${selectedCat.name} submitted!`);
            setIsApplicationOpen(false);
            fetchApplications(); // Refresh list
            form.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit application");
        }
    };

    const handleSubmitReview = async () => {
        if (!selectedApplication) return;

        console.log('Submitting review for application:', selectedApplication);
        console.log('Application status:', selectedApplication.status);

        try {
            const payload = {
                rating: reviewRating,
                text: reviewText,
                adoptionId: selectedApplication.id,
                catName: selectedApplication.cat.name,
            };
            console.log('Review payload:', payload);

            await reviewService.createReview(payload);
            toast.success("Review submitted! It will be visible after admin approval.");
            setIsReviewOpen(false);
            setReviewRating(5);
            setReviewText("");
            setSelectedApplication(null);
            fetchApplications();
        } catch (error: any) {
            console.error('Review submission error:', error);
            toast.error(error.message || "Failed to submit review");
        }
    };

    if (isLoading || !user || user.role !== UserRole.ADOPTER) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Find Your Companion</h1>
            </div>

            {/* Profile Completion Prompt */}
            {user && (!user.homeType || !user.experience) && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
                            Show shelters you're the perfect parent!
                        </CardTitle>
                        <CardDescription>
                            Completing your home profile will automatically fill your adoption applications and help shelters trust you more.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                        <Link href="/profile">
                            <Button size="sm" className="rounded-full">Complete Your Profile</Button>
                        </Link>
                    </CardFooter>
                </Card>
            )}

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/chat">
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">💬</span>
                                Chat with Shelters
                            </CardTitle>
                            <CardDescription>
                                Message shelters about adoptions
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/cats">
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">🐱</span>
                                Browse All Cats
                            </CardTitle>
                            <CardDescription>
                                Explore all available cats
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/profile">
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">👤</span>
                                My Profile
                            </CardTitle>
                            <CardDescription>
                                Update your information
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            {/* My Adopted Cats Section */}
            {myApplications.filter(app => app.status === 'COMPLETED').length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <span>🎉</span>
                            My Adopted Cats
                            <Badge variant="secondary" className="ml-2">
                                {myApplications.filter(app => app.status === 'COMPLETED').length}
                            </Badge>
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        Your successful adoptions! Click to view their story and share your experience.
                    </p>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {myApplications
                            .filter(app => app.status === 'COMPLETED')
                            .map((app) => (
                                <Card key={app.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                                    {/* Cat Image */}
                                    <div className="aspect-square relative bg-muted">
                                        {(app.cat.imageUrl || (app.cat.images && app.cat.images.length > 0)) ? (
                                            <img
                                                src={app.cat.imageUrl || app.cat.images?.[0] || ''}
                                                alt={app.cat.name}
                                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                                <FaCat className="w-16 h-16" />
                                            </div>
                                        )}
                                        <Badge className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm">
                                            Adopted ✓
                                        </Badge>
                                    </div>
                                    <CardHeader className="p-4 pb-3">
                                        <CardTitle className="flex items-center justify-between">
                                            {app.cat.name}
                                            <Badge variant="outline">{app.cat.gender}</Badge>
                                        </CardTitle>
                                        <CardDescription>{app.cat.breed}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 px-4 pb-4">
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Adopted: {new Date(app.completedAt || app.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <Link href={`/cats/${app.cat.id}`} className="w-full">
                                            <Button variant="default" size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-pink-600">
                                                <Star className="h-4 w-4" />
                                                View Story & Reviews
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            )}

            {/* Shelter Registration Nudge */}
            <Card className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/10">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span>🏠</span>
                        Own a shelter or rescue group?
                    </CardTitle>
                    <CardDescription>
                        Register a dedicated shelter account to list cats, manage adoptions, and receive donations directly.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => {
                        logout();
                        router.push("/register?role=SHELTER");
                    }}>
                        Register Shelter Account
                    </Button>
                </CardFooter>
            </Card>
            {myApplications.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">My Applications</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {myApplications.map((app) => (
                            <Card key={app.id}>
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle>{app.cat.name}</CardTitle>
                                        <Badge variant={
                                            app.status === 'APPROVED' ? 'default' :
                                                app.status === 'REJECTED' ? 'destructive' : 'secondary'
                                        }>
                                            {app.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>{app.cat.breed}</CardDescription>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 space-y-3">
                                    {app.message && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Message:</p>
                                            <p className="text-sm text-foreground/80 mt-1 italic">"{app.message}"</p>
                                        </div>
                                    )}

                                    {app.reviewNotes && (
                                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Message from Shelter:</p>
                                            <p className="text-sm text-foreground/90 mt-1">{app.reviewNotes}</p>
                                        </div>
                                    )}

                                    <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                                        Sent: {new Date(app.createdAt).toLocaleDateString()}
                                        {app.reviewedAt && ` • Reviewed: ${new Date(app.reviewedAt).toLocaleDateString()}`}
                                    </p>

                                    {/* Cancellation Section */}
                                    {app.status === 'PENDING' && (
                                        <div className="border-t pt-3 mt-3">
                                            {canCancelApplication(app.createdAt) ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        ⏱️ {getRemainingTime(app.createdAt)} to cancel
                                                    </p>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => setConfirmCancel(app.id)}
                                                    >
                                                        Cancel Application
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground text-center italic py-2">
                                                    Cancellation period expired
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Review Section for Completed Adoptions */}
                                    {app.status === 'COMPLETED' && (
                                        <div className="border-t pt-3 mt-3">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full gap-2"
                                                onClick={() => {
                                                    setSelectedApplication(app);
                                                    setIsReviewOpen(true);
                                                }}
                                            >
                                                <Star className="h-4 w-4" />
                                                Write a Review
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))} -
                    </div>
                </div>
            )}

            {/* Donation History Section */}
            <DonationHistory />

            {/* Available Cats Grid */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Available Cats</h2>
                {isCatsLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : availableCats.length === 0 ? (
                    <p className="text-muted-foreground">No cats available for adoption right now.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {availableCats.map((cat) => (
                            <Card key={cat.id} className="overflow-hidden flex flex-col">
                                {/* ... existing image ... */}
                                <div className="aspect-square relative bg-muted">
                                    {cat.imageUrl ? (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                            <FaCat className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4 pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{cat.name}</CardTitle>
                                        <Badge variant="outline">{cat.gender}</Badge>
                                    </div>
                                    <CardDescription>{cat.breed} • {cat.age} years</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 px-4 pb-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {cat.description || "No description provided."}
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {cat.location}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2 p-4 pt-0">
                                    {getApplicationForCat(cat.id) ? (
                                        <div className="flex flex-col gap-2 w-full">
                                            <Badge variant="secondary" className="w-full justify-center py-2 h-10">
                                                Application {getApplicationForCat(cat.id)?.status}
                                            </Badge>
                                            <Link href={`/chat?adoptionId=${getApplicationForCat(cat.id)?.id}`} className="w-full">
                                                <Button variant="outline" size="sm" className="w-full gap-2">
                                                    💬 Chat with Shelter
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <Dialog open={isApplicationOpen && selectedCat?.id === cat.id} onOpenChange={(open) => {
                                                setIsApplicationOpen(open);
                                                if (open) setSelectedCat(cat);
                                                else setSelectedCat(null);
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className="flex-1"
                                                        onClick={() => setSelectedCat(cat)}
                                                        disabled={cat.status !== 'AVAILABLE'}
                                                    >
                                                        {cat.status === 'AVAILABLE' ? 'Apply' : cat.status}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Adopt {cat.name}</DialogTitle>
                                                        <DialogDescription>
                                                            Tell the shelter why you'd be a great parent for {cat.name}.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <Form {...form}>
                                                        <form onSubmit={form.handleSubmit(onSubmitApplication)} className="space-y-4">
                                                            <FormField
                                                                control={form.control}
                                                                name="message"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Message *</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea placeholder="I have a big garden..." className="resize-none" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="homeType"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Home Type (Optional)</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="House, Apartment..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="otherPetsInfo"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Other Pets (Optional)</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="One dog, two birds..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button type="submit" className="w-full">
                                                                Submit Application
                                                            </Button>
                                                        </form>
                                                    </Form>
                                                </DialogContent>
                                            </Dialog>
                                            <DonationModal catId={cat.id} catName={cat.name} />
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                            Share your experience adopting {selectedApplication?.cat.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setReviewRating(rating)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${rating <= reviewRating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-muted-foreground"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Your Review</label>
                            <Textarea
                                placeholder="Tell us about your experience..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setIsReviewOpen(false);
                                    setReviewRating(5);
                                    setReviewText("");
                                    setSelectedApplication(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleSubmitReview}
                                disabled={!reviewText.trim() || reviewText.length < 10}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirm Cancel Dialog */}
            <ConfirmDialog
                open={!!confirmCancel}
                onOpenChange={(open) => !open && setConfirmCancel(null)}
                title="Cancel Application"
                description="Are you sure you want to cancel this adoption application? This action cannot be undone."
                confirmText="Yes, Cancel"
                cancelText="Keep Application"
                variant="destructive"
                onConfirm={() => {
                    if (confirmCancel) {
                        handleCancelApplication(confirmCancel);
                        setConfirmCancel(null);
                    }
                }}
            />
        </div>
    );
}