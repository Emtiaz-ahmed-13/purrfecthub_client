"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/lib/config";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { ArrowLeft, Heart, Home, PawPrint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";
import { toast } from "sonner";

export default function ApplyForAdoptionPage() {
    const params = useParams();
    const router = useRouter();
    const catId = params.id as string;

    const [cat, setCat] = useState<Cat | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        message: "",
        homeType: "",
        hasOtherPets: false,
        otherPetsInfo: "",
        experience: "",
    });

    useEffect(() => {
        fetchCatDetails();
    }, [catId]);

    const fetchCatDetails = async () => {
        try {
            const result = await CatService.getCat(catId);
            const catData = result.data || result;
            setCat(catData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load cat details");
            router.push("/cats");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                toast.error("Please login as an adopter to apply");
                router.push("/login");
                return;
            }

            const response = await fetch(API_ENDPOINTS.ADOPTIONS.ALL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    catId: catId,
                    ...formData,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Adoption application submitted successfully!");
                router.push("/profile/my-applications");
            } else {
                toast.error(result.message || "Failed to submit application");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!cat) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Cat not found</h2>
                    <Link href="/cats">
                        <Button>Back to Cats</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <Link href={`/cats/${catId}`}>
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to {cat.name}
                    </Button>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Cat Info */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                                    {cat.imageUrl ? (
                                        <Image
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <FaCat className="w-20 h-20 text-muted-foreground/20" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                                <p className="text-muted-foreground mb-4">{cat.breed}</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <PawPrint className="h-4 w-4 text-primary" />
                                        <span>{cat.age} months old</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-primary" />
                                        <span>{cat.location}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Application Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl flex items-center gap-2">
                                    <Heart className="h-8 w-8 text-primary" />
                                    Adoption Application
                                </CardTitle>
                                <CardDescription>
                                    Fill out this form to apply for adopting {cat.name}. The shelter will review your application and contact you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">
                                            Why do you want to adopt {cat.name}? *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us why you'd be a great match for this cat..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                            rows={4}
                                        />
                                    </div>

                                    {/* Home Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="homeType">Home Type *</Label>
                                        <Input
                                            id="homeType"
                                            placeholder="e.g., Apartment, House, Condo"
                                            value={formData.homeType}
                                            onChange={(e) =>
                                                setFormData({ ...formData, homeType: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Other Pets */}
                                    <div className="space-y-2">
                                        <Label htmlFor="hasOtherPets">Do you have other pets?</Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="hasOtherPets"
                                                    checked={formData.hasOtherPets === true}
                                                    onChange={() =>
                                                        setFormData({ ...formData, hasOtherPets: true })
                                                    }
                                                    className="w-4 h-4"
                                                />
                                                <span>Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="hasOtherPets"
                                                    checked={formData.hasOtherPets === false}
                                                    onChange={() =>
                                                        setFormData({ ...formData, hasOtherPets: false })
                                                    }
                                                    className="w-4 h-4"
                                                />
                                                <span>No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Other Pets Info */}
                                    {formData.hasOtherPets && (
                                        <div className="space-y-2">
                                            <Label htmlFor="otherPetsInfo">
                                                Tell us about your other pets
                                            </Label>
                                            <Textarea
                                                id="otherPetsInfo"
                                                placeholder="What kind of pets do you have? How many?"
                                                value={formData.otherPetsInfo}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        otherPetsInfo: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                            />
                                        </div>
                                    )}

                                    {/* Experience */}
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">
                                            Previous Pet Experience *
                                        </Label>
                                        <Textarea
                                            id="experience"
                                            placeholder="Have you had cats before? Tell us about your experience..."
                                            value={formData.experience}
                                            onChange={(e) =>
                                                setFormData({ ...formData, experience: e.target.value })
                                            }
                                            required
                                            rows={4}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="flex-1"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Heart className="mr-2 h-5 w-5" />
                                                    Submit Application
                                                </>
                                            )}
                                        </Button>
                                        <Link href={`/cats/${catId}`}>
                                            <Button type="button" variant="outline" size="lg">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
