"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        Have questions? We're here to help you and your feline friends.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground">support@purrfecthub.com</p>
                                        <p className="text-muted-foreground">info@purrfecthub.com</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Call Us</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                        <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                                        <p className="text-muted-foreground">123 Cat Lane, Whisker District</p>
                                        <p className="text-muted-foreground">New York, NY 10001</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-none shadow-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-5">
                                    <div className="md:col-span-2 bg-primary p-8 text-primary-foreground">
                                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                                        <p className="opacity-90 mb-8">
                                            Fill out the form and our team will get back to you within 24 hours.
                                        </p>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <MessageSquare className="w-5 h-5 opacity-70" />
                                                <span className="text-sm">Instant support available</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 p-8 bg-card">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Full Name</label>
                                                    <Input placeholder="John Doe" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Email Address</label>
                                                    <Input type="email" placeholder="john@example.com" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Subject</label>
                                                <Input placeholder="How can we help?" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Message</label>
                                                <Textarea
                                                    placeholder="Tell us more about your inquiry..."
                                                    className="min-h-[150px] resize-none"
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full h-12 text-lg font-semibold">
                                                Send Message
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
