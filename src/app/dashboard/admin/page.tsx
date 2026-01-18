"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Cat, User, UserStatus } from "@/models/types";
import { AdminService } from "@/services/admin-service";
import { CatService } from "@/services/cat-service";
import { Activity, Ban, CheckCircle, Shield, Star, Store, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AnalyticsData {
    totalUsers: number;
    totalCats: number;
    totalDonations: number;
    totalShelters: number;
    shelters: {
        id: string;
        name: string;
        email: string;
        catCount: number;
    }[];
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [cats, setCats] = useState<Cat[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersData, analyticsData, catsData] = await Promise.all([
                AdminService.getUsers(),
                AdminService.getAnalytics().catch(() => null),
                CatService.getCats({ limit: 100 }).catch(() => null)
            ]);

            setUsers(Array.isArray(usersData) ? usersData : usersData.data || []);
            setAnalytics(analyticsData?.data || analyticsData);
            setCats(catsData?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load admin data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (userId: string, status: UserStatus) => {
        try {
            await AdminService.updateUserStatus(userId, status);
            toast.success(`User updated to ${status}`);
            setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteCat = async (catId: string) => {
        if (!confirm("Are you sure you want to remove this cat listing?")) return;

        try {
            await CatService.deleteCat(catId);
            toast.success("Cat removed successfully");
            setCats(cats.filter(c => c.id !== catId));
            if (analytics) {
                setAnalytics({
                    ...analytics,
                    totalCats: analytics.totalCats - 1
                });
            }
        } catch (error) {
            toast.error("Failed to remove cat");
        }
    };

    const adopters = users.filter(u => u.role === "ADOPTER");
    const shelters = users.filter(u => u.role === "SHELTER");

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            </div>

            <div className="space-y-4">
                {/* Custom Tabs Navigation */}
                <div className="flex gap-2 border-b pb-2">
                    <Button
                        variant={activeTab === "overview" ? "default" : "ghost"}
                        onClick={() => setActiveTab("overview")}
                        className="rounded-none border-b-2 border-transparent hover:bg-muted"
                        style={{ borderColor: activeTab === "overview" ? "var(--primary)" : "transparent" }}
                    >
                        Overview
                    </Button>
                    <Button
                        variant={activeTab === "users" ? "default" : "ghost"}
                        onClick={() => setActiveTab("users")}
                        className="rounded-none border-b-2 border-transparent hover:bg-muted"
                        style={{ borderColor: activeTab === "users" ? "var(--primary)" : "transparent" }}
                    >
                        Users
                    </Button>
                    <Button
                        variant={activeTab === "shelters" ? "default" : "ghost"}
                        onClick={() => setActiveTab("shelters")}
                        className="rounded-none border-b-2 border-transparent hover:bg-muted"
                        style={{ borderColor: activeTab === "shelters" ? "var(--primary)" : "transparent" }}
                    >
                        Shelters
                    </Button>
                    <Button
                        variant={activeTab === "cats" ? "default" : "ghost"}
                        onClick={() => setActiveTab("cats")}
                        className="rounded-none border-b-2 border-transparent hover:bg-muted"
                        style={{ borderColor: activeTab === "cats" ? "var(--primary)" : "transparent" }}
                    >
                        Cats
                    </Button>
                    <Button
                        variant={activeTab === "reviews" ? "default" : "ghost"}
                        onClick={() => setActiveTab("reviews")}
                        className="rounded-none border-b-2 border-transparent hover:bg-muted"
                        style={{ borderColor: activeTab === "reviews" ? "var(--primary)" : "transparent" }}
                    >
                        Reviews
                    </Button>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in zoom-in duration-300">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics?.totalUsers || users.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Shelters</CardTitle>
                                <Store className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics?.totalShelters || shelters.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Cats</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics?.totalCats || "-"}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                                <span className="text-muted-foreground font-bold">$</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${analytics?.totalDonations || "0"}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <Card className="animate-in slide-in-from-left-2 duration-300">
                        <CardHeader>
                            <CardTitle>Adopters</CardTitle>
                            <CardDescription>Manage registered adopters on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adopters.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.status === UserStatus.BANNED ? "destructive" : "secondary"}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.status === UserStatus.BANNED ? (
                                                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(user.id, UserStatus.ACTIVE)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(user.id, UserStatus.BANNED)}>
                                                        <Ban className="mr-2 h-4 w-4" /> Ban
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Shelters Tab */}
                {activeTab === "shelters" && (
                    <Card className="animate-in slide-in-from-right-2 duration-300">
                        <CardHeader>
                            <CardTitle>Shelters</CardTitle>
                            <CardDescription>Manage shelter accounts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Shelter Details</TableHead>
                                        <TableHead>Cat Count</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {shelters.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-orange-100 text-orange-600">S</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                    {analytics?.shelters?.find(s => s.id === user.shelter?.id || s.email === user.email)?.catCount || 0} Cats
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.status === UserStatus.ACTIVE ? "default" : "outline"}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.status !== UserStatus.ACTIVE && (
                                                    <Button size="sm" onClick={() => handleStatusUpdate(user.id, UserStatus.ACTIVE)}>
                                                        <Shield className="mr-2 h-4 w-4" /> Verify
                                                    </Button>
                                                )}
                                                {user.status === UserStatus.ACTIVE && (
                                                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(user.id, UserStatus.BANNED)}>
                                                        <Ban className="mr-2 h-4 w-4" /> Suspend
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Cats Tab */}
                {activeTab === "cats" && (
                    <Card className="animate-in slide-in-from-bottom-2 duration-300">
                        <CardHeader>
                            <CardTitle>Cats Management</CardTitle>
                            <CardDescription>Manage all cat listings from all shelters.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cat</TableHead>
                                        <TableHead>Shelter</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cats.map((cat) => (
                                        <TableRow key={cat.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <img src={cat.images?.[0]} alt={cat.name} className="object-cover" />
                                                        <AvatarFallback>{cat.name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{cat.name}</span>
                                                        <span className="text-xs text-muted-foreground">{cat.breed} • {cat.age} months</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">{cat.shelter?.name || "Unknown"}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={cat.status === "AVAILABLE" || cat.status === "Available" ? "default" : "outline"}>
                                                    {cat.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteCat(cat.id)}>
                                                    <Ban className="mr-2 h-4 w-4" /> Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <ReviewsManagement />
                )}

            </div>
        </div>
    );
}

function ReviewsManagement() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://purrfecthub-server.render.com/api/v1'}/reviews/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            setReviews(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reviews");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://purrfecthub-server.render.com/api/v1'}/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.ok) {
                toast.success("Review deleted");
                setReviews(reviews.filter(r => r.id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const handleApproveReview = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://purrfecthub-server.render.com/api/v1'}/reviews/${id}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.ok) {
                toast.success("Review approved");
                setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: true } : r));
            } else {
                toast.error("Failed to approve review");
            }
        } catch (error) {
            toast.error("Failed to approve review");
        }
    };

    if (isLoading) return <div>Loading reviews...</div>;

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader>
                <CardTitle>Reviews Management</CardTitle>
                <CardDescription>Manage community reviews and success stories.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reviewer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col">
                                            <span>{review.reviewer?.name}</span>
                                            <span className="text-xs text-muted-foreground">{review.catName && `Adopted ${review.catName}`}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {review.rating} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-md truncate">
                                    {review.text}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={review.isApproved ? "default" : "outline"}>
                                        {review.isApproved ? "Approved" : "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {!review.isApproved && (
                                            <Button size="sm" variant="default" onClick={() => handleApproveReview(review.id)}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                            </Button>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteReview(review.id)}>
                                            Remove
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
