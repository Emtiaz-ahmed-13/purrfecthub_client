"use client";

import { SubmitCatModal } from "@/components/shelter/SubmitCatModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { Shelter } from "@/models/types";
import { ShelterService } from "@/services/shelter-service";
import { Loader2, MapPin, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { toast } from "sonner";

// Extended interface if needed, or stick to imported Shelter 
interface ExtendedShelter extends Shelter {
    city: string;
    phone?: string;
    description?: string;
    email?: string;
}

export default function SheltersPage() {
    const { user } = useAuth();
    const [shelters, setShelters] = useState<ExtendedShelter[]>([]);
    const [filteredShelters, setFilteredShelters] = useState<ExtendedShelter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [selectedShelter, setSelectedShelter] = useState<{ id: string; name: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchShelters();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredShelters(shelters);
            return;
        }
        const lower = searchQuery.toLowerCase();
        const filtered = shelters.filter(s =>
            s.name.toLowerCase().includes(lower) ||
            s.city?.toLowerCase().includes(lower)
        );
        setFilteredShelters(filtered);
    }, [searchQuery, shelters]);

    const openSubmitModal = (shelter: ExtendedShelter) => {
        if (!user) {
            toast.error("Please login to submit a request");
            return;
        }
        setSelectedShelter({ id: shelter.id, name: shelter.name });
        setIsModalOpen(true);
    };

    const fetchShelters = async () => {
        try {
            const result = await ShelterService.getShelters();
            // Adjust based on actual API response structure (e.g. result.data or result directly)
            const data = Array.isArray(result) ? result : (result.data || []);
            setShelters(data);
            setFilteredShelters(data);
        } catch (error) {
            console.error("Failed to fetch shelters:", error);
            toast.error("Failed to load shelters");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="flex flex-col space-y-4 mb-10 text-center items-center">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Our Partner Shelters
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Meet the dedicated organizations working tirelessly to find homes for every cat.
                </p>

                <div className="w-full max-w-md relative mt-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or city..."
                        className="pl-9 h-11 bg-muted/40"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {selectedShelter && (
                <SubmitCatModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    shelterId={selectedShelter.id}
                    shelterName={selectedShelter.name}
                />
            )}

            {isLoading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : filteredShelters.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg">
                    <FaHome className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-medium">No shelters found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredShelters.map((shelter) => (
                        <Card key={shelter.id} className="hover:shadow-lg transition-all duration-300 border-muted/60 flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <FaHome className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{shelter.name}</CardTitle>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {shelter.city || shelter.location || "Unknown Location"}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                    {shelter.description || "A dedicated shelter committed to animal welfare."}
                                </p>
                                {shelter.phone && (
                                    <div className="flex items-center gap-2 mt-4 text-sm font-medium text-foreground/80">
                                        <Phone className="h-4 w-4 text-primary" />
                                        {shelter.phone}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button
                                    className="w-full"
                                    onClick={() => openSubmitModal(shelter)}
                                >
                                    Submit Cat Request
                                </Button>
                                <Button className="w-full" variant="outline" disabled>
                                    View Details (Coming Soon)
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
