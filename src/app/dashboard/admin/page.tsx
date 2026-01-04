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
import { User, UserStatus } from "@/models/types";
import { AdminService } from "@/services/admin-service";
import { Activity, Ban, CheckCircle, Shield, Store, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AnalyticsData {
  totalUsers: number;
  totalCats: number;
  totalDonations: number;
  totalShelters: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, analyticsData] = await Promise.all([
        AdminService.getUsers(),
        AdminService.getAnalytics().catch(() => null)
      ]);
      
      setUsers(Array.isArray(usersData) ? usersData : usersData.data || []);
      setAnalytics(analyticsData?.data || analyticsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admin data");
    }
  };

  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
      try {
          // Convert enum to string if service expects string, or update service type
          await AdminService.updateUserStatus(userId, status);
          toast.success(`User updated to ${status}`);
          setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
      } catch (error) {
          toast.error("Failed to update status");
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

      </div>
    </div>
  );
}
