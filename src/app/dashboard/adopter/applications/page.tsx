"use client";

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
import { AdoptionService } from "@/services/adoption-service";
// import { format } from "date-fns";
import { Loader2, PawPrint } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Basic interface for application, adjust based on actual API response
interface Application {
    id: string;
    cat: {
        id: string;
        name: string;
        breed: string;
    };
    shelter: {
        name: string;
    };
    status: "PENDING" | "APPROVED" | "REJECTED";
    message: string;
    createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const result = await AdoptionService.getMyApplications();
      setApplications(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">My Adoption Requests</h2>
            <p className="text-muted-foreground">Track the status of your applications.</p>
        </div>
        <Link href="/cats">
            <Button>
                <PawPrint className="mr-2 h-4 w-4" /> Browse More Cats
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>A list of all your submitted adoption forms.</CardDescription>
        </CardHeader>
        <CardContent>
            {applications.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    You haven't applied for any cats yet.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cat</TableHead>
                            <TableHead>Shelter</TableHead>
                            <TableHead>Date Applied</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/cats/${app.cat.id}`} className="hover:underline text-primary">
                                        {app.cat.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">{app.cat.breed}</div>
                                </TableCell>
                                <TableCell>{app.shelter.name}</TableCell>
                                <TableCell>{new Date(app.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                                <TableCell>
                                    <Badge 
                                        variant={
                                            app.status === "APPROVED" ? "default" : 
                                            app.status === "REJECTED" ? "destructive" : "secondary"
                                        }
                                    >
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
