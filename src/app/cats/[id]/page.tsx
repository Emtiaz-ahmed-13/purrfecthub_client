"use client";

import { DonationModal } from "@/components/donation/DonationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Heart,
  MapPin,
  Shield,
  Stethoscope,
  Weight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";
import { toast } from "sonner";

export default function CatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const catId = params.id as string;

  const [cat, setCat] = useState<Cat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCatDetails();
  }, [catId]);

  const fetchCatDetails = async () => {
    try {
      const result = await CatService.getCat(catId);
      setCat(result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cat details");
      router.push("/cats");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cat details...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/cats">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Cats
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-muted border border-border">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 bg-muted/50">
                  <FaCat className="w-32 h-32" />
                </div>
              )}
              <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-lg px-4 py-2">
                {cat.status}
              </Badge>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{cat.name}</h1>
              <p className="text-xl text-muted-foreground">{cat.breed}</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Age</div>
                  <div className="font-semibold">{cat.age} years</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="font-semibold">{cat.gender}</div>
                </div>
              </div>
              {cat.weight && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                  <Weight className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Weight</div>
                    <div className="font-semibold">{cat.weight} lbs</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">{cat.location}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {cat.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About {cat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{cat.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Health Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vaccinated</span>
                  {cat.isVaccinated ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Neutered/Spayed</span>
                  {cat.isNeutered ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </div>
                {cat.specialNeeds && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-muted-foreground block mb-2">Special Needs</span>
                      <p className="text-sm">{cat.specialNeeds}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/cats/${cat.id}/apply`} className="flex-1">
                <Button size="lg" className="w-full h-14 text-lg rounded-full bg-gradient-to-r from-primary to-pink-600">
                  <Heart className="mr-2 h-5 w-5" />
                  Apply for Adoption
                </Button>
              </Link>
              <DonationModal
                catId={cat.id}
                catName={cat.name}
                trigger={
                  <Button size="lg" variant="outline" className="flex-1 h-14 text-lg rounded-full border-2">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
