"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function DonationCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-xl text-center space-y-6">
                <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-12 w-12" />
                </div>
                <h1 className="text-3xl font-bold">Donation Cancelled</h1>
                <p className="text-muted-foreground">
                    Your donation process was cancelled. No charges were made to your account.
                </p>
                <div className="pt-6 space-y-3">
                    <Link href="/cats">
                        <Button className="w-full rounded-full h-12 text-lg">
                            Back to Cats
                        </Button>
                    </Link>
                    <Link href="/dashboard/adopter">
                        <Button variant="ghost" className="w-full rounded-full h-12">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
