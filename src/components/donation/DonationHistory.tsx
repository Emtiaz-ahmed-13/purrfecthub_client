"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Donation } from "@/models/types";
import { DonationService } from "@/services/donation-service";
import { useEffect, useState } from "react";

export function DonationHistory() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const result = await DonationService.getMyDonations();
                setDonations(result.data || []);
            } catch (error) {
                console.error("Failed to fetch donations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonations();
    }, []);

    if (isLoading) {
        return <div className="text-center p-4">Loading donation history...</div>;
    }

    if (donations.length === 0) {
        return null; 
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Donations</CardTitle>
                <CardDescription>Thank you for your support!</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((donation) => (
                            <TableRow key={donation.id}>
                                <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {donation.cat ? `Cat: ${donation.cat.name}` : 
                                     donation.shelter ? `Shelter: ${donation.shelter.name}` : "General"}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: donation.currency }).format(donation.amount)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={donation.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                        {donation.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
