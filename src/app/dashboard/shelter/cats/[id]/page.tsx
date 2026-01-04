"use client";

import { MedicalRecordList } from "@/components/medical/MedicalRecordList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { ArrowLeft, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";

export default function CatDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [cat, setCat] = useState<Cat | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) fetchCat();
    }, [id]);

    const fetchCat = async () => {
        try {
            const result = await CatService.getCat(id);
            setCat(result.data);
        } catch (error) {
            console.error("Failed to load cat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading cat details...</div>;
    if (!cat) return <div className="p-8 text-center">Cat not found</div>;

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Cat Info Card */}
                <Card className="w-full md:w-1/3 h-fit">
                    <div className="aspect-square relative bg-muted rounded-t-lg overflow-hidden">
                        {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                <FaCat className="w-24 h-24" />
                            </div>
                        )}
                    </div>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl">{cat.name}</CardTitle>
                            <Badge>{cat.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Breed</p>
                                <p className="font-medium">{cat.breed}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Gender</p>
                                <p className="font-medium">{cat.gender}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Age</p>
                                <p className="font-medium">{cat.age} months</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Color</p>
                                <p className="font-medium">{cat.color || "-"}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Vaccinated</p>
                                <p className="font-medium">{cat.isVaccinated ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Neutered</p>
                                <p className="font-medium">{cat.isNeutered ? "Yes" : "No"}</p>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-muted-foreground text-sm mb-1">Description</p>
                            <p className="text-sm">{cat.description}</p>
                        </div>

                         <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                            <MapPin className="w-4 h-4" />
                            {cat.location}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Side: Medical Records & potentially other details */}
                <div className="flex-1 space-y-6">
                    <MedicalRecordList catId={cat.id} canEdit={true} />
                </div>
            </div>
        </div>
    );
}
