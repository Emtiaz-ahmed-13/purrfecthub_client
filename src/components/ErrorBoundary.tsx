"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
                    <div className="max-w-2xl w-full text-center">
                        {/* Error Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                    <AlertTriangle className="h-16 w-16 text-amber-500" />
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Something Went Wrong
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            আমরা এই সমস্যাটি ঠিক করার চেষ্টা করছি
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                size="lg"
                                className="rounded-full bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg transition-all"
                            >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Reload Page
                            </Button>
                            <Button
                                onClick={() => (window.location.href = "/")}
                                variant="outline"
                                size="lg"
                                className="rounded-full border-2"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
