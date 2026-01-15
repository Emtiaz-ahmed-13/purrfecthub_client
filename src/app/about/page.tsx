"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cat, Heart, Shield, Users } from "lucide-react";

const values = [
    {
        icon: Heart,
        title: "Compassion",
        description: "We believe every cat deserves a loving home and the best medical care possible.",
        color: "text-pink-500",
        bg: "bg-pink-500/10"
    },
    {
        icon: Shield,
        title: "Integrity",
        description: "Transparency and honesty are at the heart of everything we do.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: Users,
        title: "Community",
        description: "Building a supportive network of shelters, adopters, and volunteers.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        icon: Cat,
        title: "Animal Welfare",
        description: "Committed to ending feline homelessness and improving living conditions.",
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
                    >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Our Mission</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                    >
                        Connecting Hearts, One Purr at a Time
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        PurrfectHub is a dedicated platform designed to bridge the gap between animal shelters and potential adopters, making the journey of finding a forever home seamless and joyful.
                    </motion.p>
                </div>

                {/* Content Section */}
                <div className="grid gap-12 md:grid-cols-2 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <div className="space-y-4 text-lg text-muted-foreground">
                            <p>
                                Started by a group of passionate cat lovers, PurrfectHub began with a simple observation: many incredible cats in shelters were struggling to find homes simply because they weren't being seen.
                            </p>
                            <p>
                                We decided to build a digital bridge—a place where technology meets compassion. Today, we support dozens of shelters across the country, providing them with the tools they need to manage listings, handle applications, and connect with their community.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80"
                                alt="Cat"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>

                {/* Values Selection */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <Card className="h-full border-none shadow-lg bg-card/50 backdrop-blur-sm hover:translate-y-[-4px] transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className={`w-12 h-12 rounded-2xl ${value.bg} flex items-center justify-center mb-4`}>
                                            <value.icon className={`w-6 h-6 ${value.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                        <p className="text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA or Final Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center bg-primary/5 rounded-3xl p-12 border border-primary/10"
                >
                    <h2 className="text-3xl font-bold mb-4">Together, We Can Save Lives</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Whether you're looking to adopt, volunteer, or support a shelter, there's a place for you in our community.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
