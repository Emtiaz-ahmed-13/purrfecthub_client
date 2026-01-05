"use client";

import { Button } from "@/components/ui/button";
import { DonationService } from "@/services/donation-service";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function DonationSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [isVerifying, setIsVerifying] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (sessionId) {
            verifyPayment();
        } else {
            setIsVerifying(false);
        }
    }, [sessionId]);

    const verifyPayment = async () => {
        try {
            await DonationService.verifyPayment(sessionId!);
            setIsSuccess(true);
            toast.success("Payment verified successfully!");
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to verify payment. Please contact support.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-xl text-center space-y-6">
                {isVerifying ? (
                    <>
                        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                        <h1 className="text-2xl font-bold">Verifying your donation...</h1>
                        <p className="text-muted-foreground">Please wait while we confirm your payment with Stripe.</p>
                    </>
                ) : isSuccess ? (
                    <>
                        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h1 className="text-3xl font-bold">Thank You!</h1>
                        <p className="text-muted-foreground">
                            Your donation has been successfully processed. Your support means the world to us and the cats!
                        </p>
                        <div className="pt-6">
                            <Link href="/dashboard/adopter">
                                <Button className="w-full rounded-full h-12 text-lg">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl font-bold">!</span>
                        </div>
                        <h1 className="text-2xl font-bold">Something went wrong</h1>
                        <p className="text-muted-foreground">
                            We couldn't verify your payment automatically. If you've been charged, please contact us.
                        </p>
                        <div className="pt-6 space-y-3">
                            <Link href="/dashboard/adopter">
                                <Button variant="outline" className="w-full rounded-full h-12">
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function DonationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        }>
            <DonationSuccessContent />
        </Suspense>
    );
}
