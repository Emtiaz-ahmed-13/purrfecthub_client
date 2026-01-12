"use client";

import { CatCardSkeleton } from "@/components/cat/CatCardSkeleton";
import { DonationModal } from "@/components/donation/DonationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
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
import { formatCatAgeShort } from "@/lib/utils";
import { Cat } from "@/models/types";
import { AdoptionService } from "@/services/adoption-service";
import { CatService } from "@/services/cat-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, MapPin, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function PublicCatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [availableCats, setAvailableCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [isCatsLoading, setIsCatsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
    fetchCats();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCats(availableCats);
      return;
    }
    const lower = searchQuery.toLowerCase();
    const filtered = availableCats.filter(cat =>
      cat.name.toLowerCase().includes(lower) ||
      cat.breed.toLowerCase().includes(lower) ||
      cat.location.toLowerCase().includes(lower)
    );
    setFilteredCats(filtered);
  }, [searchQuery, availableCats]);

  const fetchCats = async () => {
    try {
      const result = await CatService.getCats({ status: "AVAILABLE" });
      setAvailableCats(result.data || []);
      setFilteredCats(result.data || []);
    } catch (error) {
      console.error("Failed to fetch cats:", error);
      toast.error("Failed to load available cats");
    } finally {
      setIsCatsLoading(false);
    }
  };

  const onSubmitApplication = async (values: z.infer<typeof applicationSchema>) => {
    if (!selectedCat) return;

    if (!user) {
      toast.error("Please login to submit an adoption application");
      router.push("/login");
      return;
    }

    try {
      await AdoptionService.submitApplication({
        catId: selectedCat.id,
        ...values
      });
      toast.success(`Application for ${selectedCat.name} submitted!`);
      setIsApplicationOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    }
  };

  const handleApplyClick = (cat: Cat) => {
    if (!user) {
      toast.info("Please login to adopt a cat");
      router.push("/login?redirect=/cats");
      return;
    }
    setSelectedCat(cat);
    setIsApplicationOpen(true);
  };

  const toggleFavorite = (catId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(catId)) {
        newSet.delete(catId);
      } else {
        newSet.add(catId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-pink-500/10 to-purple-600/10"></div>
        <div className="absolute top-10 right-10 text-primary/20 animate-pulse">
          <Sparkles className="h-24 w-24" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Heart className="h-4 w-4 fill-current" />
              <span>{availableCats.length} Cats Looking for Homes</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Purrfect
              </span>{" "}
              Companion
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our available cats and give them the forever home they deserve. Each adoption changes a life.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, breed, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-full border-2 bg-background/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cats Grid */}
      <div className="container mx-auto px-4 pb-20">
        {isCatsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <CatCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCats.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-lg">
            <FaCat className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? "No cats found" : "No cats available right now"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "Please check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCats.map((cat, index) => (
              <div
                key={cat.id}
                className="group relative animate-in fade-in zoom-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-border hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
                  {/* Image */}
                  <Link href={`/cats/${cat.id}`} className="relative aspect-square overflow-hidden bg-muted">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 bg-muted/50">
                        <FaCat className="w-16 h-16" />
                      </div>
                    )}

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Badge */}
                    <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm border-0 shadow-lg">
                      Available
                    </Badge>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(cat.id);
                      }}
                      className="absolute top-3 left-3 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg z-10"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${favorites.has(cat.id)
                          ? "fill-pink-500 text-pink-500"
                          : "text-muted-foreground"
                          }`}
                      />
                    </button>
                  </Link>

                  {/* Content */}
                  <CardContent className="flex-1 p-6 bg-gradient-to-b from-card to-card/50">
                    <Link href={`/cats/${cat.id}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium">{cat.breed}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          {formatCatAgeShort(cat.age)}
                        </div>
                      </div>
                    </Link>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {cat.description || "A lovely cat looking for a forever home."}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{cat.location}</span>
                    </div>
                  </CardContent>

                  {/* Footer Buttons */}
                  <CardFooter className="grid grid-cols-2 gap-3 p-4 pt-0 bg-card">
                    <Button
                      className="w-full rounded-full bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg transition-all duration-300"
                      onClick={() => handleApplyClick(cat)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Adopt
                    </Button>

                    <DonationModal
                      catId={cat.id}
                      catName={cat.name}
                      trigger={
                        <Button variant="outline" className="w-full rounded-full border-2 hover:bg-muted/50">
                          Donate
                        </Button>
                      }
                    />
                  </CardFooter>

                  {/* Decorative Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Dialog */}
      <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adopt {selectedCat?.name}</DialogTitle>
            <DialogDescription>
              Tell the shelter why you'd be a great parent for {selectedCat?.name}.
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
                      <Textarea placeholder="I have a big garden and love cats..." className="resize-none" {...field} />
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
              <Button type="submit" className="w-full rounded-full h-12">
                Submit Application
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
