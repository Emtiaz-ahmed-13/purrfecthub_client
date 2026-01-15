"use client";

import { ApplicationsList } from "@/components/shelter/ApplicationsList";
import { CatForm } from "@/components/shelter/CatForm";
import { CatList } from "@/components/shelter/CatList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/config";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { ShelterService } from "@/services/shelter-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// ... existing imports

const profileSchema = z.object({
    name: z.string().min(1, "Shelter name is required"),
    city: z.string().min(1, "City/Location is required"),
    description: z.string().optional(),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().optional(),
});

export default function ShelterDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isAddCatOpen, setIsAddCatOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [editingCat, setEditingCat] = useState<Cat | undefined>(undefined);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);

    // Profile Form
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            city: "",
            description: "",
            phone: "",
            address: "",
        }
    });

    useEffect(() => {
        if (!isLoading && user && user.role === UserRole.SHELTER) {
            checkProfile();
        }
    }, [user, isLoading]);

    const checkProfile = async () => {
        try {
            const profile = await ShelterService.getMyProfile();
            if (profile) {
                setHasProfile(true);
            } else {
                setHasProfile(false);
            }
        } catch (error) {
            console.error("Failed to check profile:", error);
            // Assume no profile or error, user can try to create
            setHasProfile(false);
        } finally {
            setIsCheckingProfile(false);
        }
    };

    const onCreateProfile = async (values: z.infer<typeof profileSchema>) => {
        try {
            await ShelterService.createProfile(values);
            toast.success("Profile created successfully!");
            setHasProfile(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to create profile");
        }
    };

    // Toggle to trigger list refresh
    const handleCatCreated = () => {
        setIsAddCatOpen(false);
        setEditingCat(undefined);
        setRefreshTrigger(prev => !prev);
    };

    const handleEdit = (cat: Cat) => {
        setEditingCat(cat);
        setIsAddCatOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsAddCatOpen(open);
        if (!open) setEditingCat(undefined);
    };

    useEffect(() => {
        if (!isLoading && user && user.role !== UserRole.SHELTER) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading || isCheckingProfile) {
        return <div className="flex h-[50vh] items-center justify-center">Loading...</div>;
    }

    if (!user || user.role !== UserRole.SHELTER) {
        return null;
    }

    if (!hasProfile) {
        return (
            <div className="flex flex-col items-center justify-center p-4 py-10">
                <Card className="w-full max-w-2xl shadow-2xl border-none bg-white/95 backdrop-blur-sm dark:bg-zinc-900/90">
                    <CardHeader className="text-center space-y-2 pb-8">
                        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <FaCat className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Complete Your Profile
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Help adopters find you by providing your shelter details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onCreateProfile)} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormField
                                        control={profileForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Shelter Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Happy Paws Shelter" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">City / Location *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. New York, NY" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormField
                                        control={profileForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Phone Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1 234 567 890" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/80">Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 123 Love Street" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={profileForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/80">About Your Shelter</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us about your mission, history, and the cats you care for..."
                                                    className="min-h-[120px] bg-background/50 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" size="lg" className="w-full text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all">
                                    Save & Continue to Dashboard
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shelter Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your cats and shelter profile</p>
                </div>
                <Dialog open={isAddCatOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setEditingCat(undefined)}>
                            <span className="mr-2 text-xl">+</span> Add New Cat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingCat ? "Edit Cat" : "Add New Cat"}</DialogTitle>
                            <DialogDescription>
                                {editingCat ? "Update the details of your cat listing." : "Enter the details of the cat you want to list for adoption."}
                            </DialogDescription>
                        </DialogHeader>
                        <CatForm
                            onSuccess={handleCatCreated}
                            onCancel={() => handleOpenChange(false)}
                            initialData={editingCat}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Shelter Info Card */}
                <Card className="bg-gradient-to-br from-primary/10 to-pink-500/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Shelter</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <FaCat className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ShelterStats />
                    </CardContent>
                </Card>

                {/* Total Cats Card */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cats</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <FaCat className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CatStats />
                    </CardContent>
                </Card>

                {/* Applications Card */}
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Applications</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-lg">📋</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ApplicationStats />
                    </CardContent>
                </Card>
            </div>

            {/* Adoption Applications Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Adoption Applications</h2>
                </div>
                <ApplicationsList />
            </div>

            {/* My Cats Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">My Cats</h2>
                    {/* Optional search/filter here */}
                </div>
                <CatList shouldRefresh={refreshTrigger} onEdit={handleEdit} />
            </div>
        </div>
    );
}

// Shelter Stats Component
function ShelterStats() {
    const [shelter, setShelter] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShelter = async () => {
            try {
                const data = await ShelterService.getMyProfile();
                setShelter(data);
            } catch (error) {
                console.error("Failed to fetch shelter:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShelter();
    }, []);

    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;
    if (!shelter) return <div className="text-sm text-muted-foreground">No data</div>;

    return (
        <>
            <div className="text-2xl font-bold">{shelter.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-1">
                {shelter.city || "Location not set"}
                {shelter.isVerified && <span className="ml-2 text-green-600">✓ Verified</span>}
            </p>
        </>
    );
}

// Cat Stats Component
function CatStats() {
    const [stats, setStats] = useState({ total: 0, available: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await CatService.getMyCats(1, 100); // Get all cats
                const cats = response.data?.cats || [];
                const available = cats.filter((cat: any) => cat.status === "AVAILABLE").length;
                setStats({ total: cats.length, available });
            } catch (error) {
                console.error("Failed to fetch cat stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;

    return (
        <>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
                {stats.available} available for adoption
            </p>
        </>
    );
}

// Application Stats Component  
function ApplicationStats() {
    const [stats, setStats] = useState({ total: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/adoptions/shelter/applications`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const applications = data.data || [];
                    const pending = applications.filter((app: any) => app.status === "PENDING").length;
                    setStats({ total: applications.length, pending });
                }
            } catch (error) {
                console.error("Failed to fetch application stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;

    return (
        <>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
                {stats.pending} pending review
            </p>
        </>
    );
}
