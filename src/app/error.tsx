"use client";

import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                            <div className="text-6xl">😿</div>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Oops! Something went wrong
                </h1>
                <p className="text-lg text-muted-foreground mb-2">
                    দুঃখিত! কিছু একটা সমস্যা হয়েছে
                </p>

                <div className="bg-muted/50 rounded-lg p-4 mb-8 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground font-mono">
                        {error.message || "An unexpected error occurred"}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={reset}
                        size="lg"
                        className="rounded-full bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg transition-all"
                    >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full border-2"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-sm text-muted-foreground mt-8">
                    If this problem persists, please contact our support team
                </p>
            </div>
        </div>
    );
}
