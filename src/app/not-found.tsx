import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="text-9xl font-bold bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent">
                            404
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20">
                            🐱
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg text-muted-foreground mb-2">
                    এই পেজটি খুঁজে পাওয়া যায়নি
                </p>
                <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link href="/">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg transition-all"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Go to Homepage
                        </Button>
                    </Link>
                    <Link href="/cats">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full border-2"
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Browse Cats
                        </Button>
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="border-t border-border pt-8">
                    <p className="text-sm text-muted-foreground mb-4">Quick Links:</p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <Link href="/shelters" className="text-primary hover:underline">
                            Shelters
                        </Link>
                        <Link href="/about" className="text-primary hover:underline">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-primary hover:underline">
                            Contact
                        </Link>
                        <Link href="/donate" className="text-primary hover:underline">
                            Donate
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
