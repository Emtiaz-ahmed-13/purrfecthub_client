"use client";

import { DonationHistory } from "@/components/donation/DonationHistory";
import { DonationModal } from "@/components/donation/DonationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
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
  const { user, isLoading } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableCats, setAvailableCats] = useState<Cat[]>([]);
  const [myApplications, setMyApplications] = useState<AdoptionApplication[]>([]);
  const [isCatsLoading, setIsCatsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
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
    if (!isLoading && user && user.role !== UserRole.ADOPTER) {
      router.push("/");
    }
  }, [user, isLoading, router]);

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
                  // Clean up URL
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
          const result = await CatService.getCats({ status: "AVAILABLE" }); 
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

  if (isLoading || !user || user.role !== UserRole.ADOPTER) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Find Your Companion</h1>
          {/* Search inputs could go here */}
      </div>

       {/* My Applications Section */}
       {myApplications.length > 0 && (
           <div className="space-y-4">
               <h2 className="text-2xl font-semibold">My Applications</h2>
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   {myApplications.map((app) => (
                       <Card key={app.id}>
                           {/* ... existing card content ... */}
                            <CardHeader className="pb-2">
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
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    Sent: {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                       </Card>
                   ))}
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
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{cat.name}</CardTitle>
                                <Badge variant="outline">{cat.gender}</Badge>
                            </div>
                            <CardDescription>{cat.breed} • {cat.age} years</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {cat.description || "No description provided."}
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {cat.location}
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Dialog open={isApplicationOpen && selectedCat?.id === cat.id} onOpenChange={(open) => {
                                setIsApplicationOpen(open);
                                if (open) setSelectedCat(cat);
                                else setSelectedCat(null);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex-1" onClick={() => setSelectedCat(cat)}>Apply</Button>
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
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
