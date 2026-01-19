"use client";

import { SubmitCatModal } from "@/components/shelter/SubmitCatModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { ShelterService } from "@/services/shelter-service";
import { ArrowLeft, Loader2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { toast } from "sonner";

interface ShelterDetails {
    id: string;
    name: string;
    location: string;
    city: string;
    phone?: string;
    email?: string;
    description?: string;
    logo?: string;
    createdAt: string;
}

export default function ShelterDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const shelterId = params.id as string;

    const [shelter, setShelter] = useState<ShelterDetails | null>(null);
    const [cats, setCats] = useState<Cat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (shelterId) {
            fetchShelterDetails();
            fetchShelterCats();
        }
    }, [shelterId]);

    const fetchShelterDetails = async () => {
        try {
            const result = await ShelterService.getShelterById(shelterId);
            setShelter(result);
        } catch (error) {
            console.error("Failed to fetch shelter details:", error);
            toast.error("Failed to load shelter details");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShelterCats = async () => {
        try {
            const result = await CatService.getCats({ shelterId });
            const data = Array.isArray(result) ? result : (result.data || []);
            setCats(data);
        } catch (error) {
            console.error("Failed to fetch shelter cats:", error);
        }
    };

    const openSubmitModal = () => {
        if (!user) {
            toast.error("Please login to submit a request");
            return;
        }
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!shelter) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <FaHome className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Shelter Not Found</h2>
                <p className="text-muted-foreground mb-6">The shelter you're looking for doesn't exist.</p>
                <Button onClick={() => router.push("/shelters")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Shelters
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
            <div className="container mx-auto py-10 px-4">
                {/* Back Button */}
                <Link href="/shelters">
                    <Button variant="ghost" className="mb-6 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shelters
                    </Button>
                </Link>

                {/* Shelter Header */}
                <div className="mb-8">
                    <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-purple-600/10 p-8">
                            <div className="flex items-start gap-6">
                                <div className="bg-primary/20 p-6 rounded-2xl overflow-hidden">
                                    {shelter.logo ? (
                                        <img
                                            src={shelter.logo}
                                            alt={`${shelter.name} logo`}
                                            className="h-12 w-12 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <FaHome className="h-12 w-12 text-primary" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                                        {shelter.name}
                                    </h1>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-foreground/80">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <span className="font-medium">{shelter.city || shelter.location}</span>
                                        </div>
                                        {shelter.phone && (
                                            <div className="flex items-center gap-2 text-foreground/80">
                                                <Phone className="h-5 w-5 text-primary" />
                                                <span className="font-medium">{shelter.phone}</span>
                                            </div>
                                        )}
                                        {shelter.email && (
                                            <div className="flex items-center gap-2 text-foreground/80">
                                                <Mail className="h-5 w-5 text-primary" />
                                                <span className="font-medium">{shelter.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        size="lg"
                                        className="rounded-full shadow-lg hover:shadow-primary/25 transition-all font-semibold"
                                        onClick={openSubmitModal}
                                    >
                                        Submit Cat Request
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* About Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">About This Shelter</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {shelter.description || "A dedicated shelter committed to animal welfare and finding loving homes for cats in need."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                                    <span className="text-muted-foreground">Available Cats</span>
                                    <span className="text-2xl font-bold text-primary">{cats.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-pink-500/5 rounded-lg">
                                    <span className="text-muted-foreground">Member Since</span>
                                    <span className="font-semibold">
                                        {new Date(shelter.createdAt).getFullYear()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Available Cats Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Available Cats</h2>
                    {cats.length === 0 ? (
                        <Card className="p-12 text-center">
                            <p className="text-muted-foreground text-lg">
                                This shelter currently has no cats available for adoption.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cats.map((cat) => (
                                <Card
                                    key={cat.id}
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                    onClick={() => router.push(`/cats/${cat.id}`)}
                                >
                                    <div className="aspect-square overflow-hidden rounded-t-lg">
                                        {cat.images && cat.images.length > 0 ? (
                                            <img
                                                src={cat.images[0]}
                                                alt={cat.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center">
                                                <span className="text-6xl">🐱</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-xl mb-2">{cat.name}</h3>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                            <span>{cat.breed}</span>
                                            <span>•</span>
                                            <span>{cat.age} {cat.age === 1 ? 'year' : 'years'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Cat Modal */}
            {shelter && (
                <SubmitCatModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    shelterId={shelter.id}
                    shelterName={shelter.name}
                />
            )}
        </div>
    );
}
