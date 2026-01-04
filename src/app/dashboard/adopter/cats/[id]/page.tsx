"use client";

import { DonationModal } from "@/components/donation/DonationModal";
import { MedicalRecordList } from "@/components/medical/MedicalRecordList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Cat } from "@/models/types";
import { AdoptionService } from "@/services/adoption-service";
import { CatService } from "@/services/cat-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCat } from "react-icons/fa";
import { toast } from "sonner";
import * as z from "zod";

const applicationSchema = z.object({
    message: z.string().min(10, "Please provide a bit more detail"),
    homeType: z.string().optional(),
    hasOtherPets: z.boolean().default(false).optional(),
    otherPetsInfo: z.string().optional(),
    experience: z.string().optional(),
});

export default function AdopterCatDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [cat, setCat] = useState<Cat | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);

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
        if (id) fetchCat();
    }, [id]);

    const fetchCat = async () => {
        try {
            const result = await CatService.getCat(id);
            setCat(result.data);
        } catch (error) {
            console.error("Failed to load cat:", error);
            toast.error("Failed to load cat details");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitApplication = async (values: z.infer<typeof applicationSchema>) => {
        if (!cat) return;
        try {
            await AdoptionService.submitApplication({
                catId: cat.id,
                ...values
            });
            toast.success(`Application for ${cat.name} submitted!`);
            setIsApplicationOpen(false);
            form.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit application");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
    
    if (!cat) return <div className="p-8 text-center bg-muted/20 rounded-lg">Cat not found</div>;

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Cat Info Card - Left Column */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card>
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
                                    <p className="text-muted-foreground">Location</p>
                                    <div className="flex items-center gap-1 font-medium">
                                        <MapPin className="w-3 h-3" /> {cat.location}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">About</p>
                                <p className="text-sm">{cat.description}</p>
                            </div>

                            <div className="pt-4 space-y-2">
                                <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" disabled={cat.status !== 'Available'}>
                                            {cat.status === 'Available' ? 'Apply to Adopt' : 'Not Available'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Adopt {cat.name}</DialogTitle>
                                            <DialogDescription>
                                                Submit your application interest.
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
                                                                <Textarea placeholder="Why fit for this cat?" className="resize-none" {...field} />
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
                                                            <FormLabel>Home Type</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="House, Apartment..." {...field} />
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

                                <DonationModal 
                                    catId={cat.id} 
                                    catName={cat.name} 
                                    trigger={
                                        <Button variant="outline" className="w-full border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800">
                                            Donate to {cat.name}
                                        </Button>
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Medical Records & More */}
                <div className="flex-1 space-y-6">
                    <MedicalRecordList catId={cat.id} canEdit={false} />
                </div>
            </div>
        </div>
    );
}
