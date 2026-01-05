"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Home, PawPrint } from "lucide-react";
import Link from "next/link";
import { FaDonate } from "react-icons/fa";

export default function DonatePage() {
    return (
        <div className="container mx-auto py-12 px-4 min-h-screen">
            <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                    <FaDonate className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Make a Difference Today
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Your generosity helps provide food, shelter, and medical care to countless cats waiting for their forever homes. Every donation, big or small, changes a life.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                <Card className="text-center border-none shadow-lg bg-gradient-to-b from-background to-muted/20">
                    <CardHeader>
                        <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-2">
                            <PawPrint className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-xl">Support a Cat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Directly sponsor a specific cat to help cover their food and vaccination costs while they wait for adoption.
                        </p>
                        <Link href="/cats">
                            <Button className="w-full">Find a Cat to Support</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="text-center border-none shadow-lg bg-gradient-to-b from-background to-muted/20">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-2">
                            <Home className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-xl">Help a Shelter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Donate to a local shelter to help them maintain their facilities and rescue more animals in need.
                        </p>
                        <Link href="/shelters">
                            <Button className="w-full" variant="outline">Browse Shelters</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="text-center border-none shadow-lg bg-gradient-to-b from-background to-muted/20">
                    <CardHeader>
                        <div className="mx-auto bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-2">
                            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-xl">Spread the Word</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Can't donate right now? Sharing our mission with your friends and family is just as valuable.
                        </p>
                        <Button variant="secondary" className="w-full" onClick={() => {
                            navigator.clipboard.writeText(window.location.origin);
                            import("sonner").then(mod => mod.toast.success("Link copied to clipboard!"));
                        }}>
                            Share PurrfectHub
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
