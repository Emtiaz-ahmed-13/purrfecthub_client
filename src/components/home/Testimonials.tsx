"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
    {
        name: "সারাহ আহমেদ",
        location: "ঢাকা",
        image: "/images/testimonials/sarah.jpg",
        catName: "মিষ্টি",
        rating: 5,
        text: "PurrfectHub এর মাধ্যমে আমি মিষ্টিকে দত্তক নিয়েছি। পুরো প্রক্রিয়াটি অত্যন্ত সহজ এবং স্বচ্ছ ছিল। এখন মিষ্টি আমার পরিবারের অবিচ্ছেদ্য অংশ!",
        date: "2 months ago"
    },
    {
        name: "Rafiq Hassan",
        location: "Chattogram",
        image: "/images/testimonials/rafiq.jpg",
        catName: "Tiger",
        rating: 5,
        text: "The medical records feature is amazing! I could see Tiger's complete vaccination history before adoption. The shelter staff was very responsive through the chat feature.",
        date: "3 weeks ago"
    },
    {
        name: "নুসরাত জাহান",
        location: "সিলেট",
        image: "/images/testimonials/nusrat.jpg",
        catName: "লুলু",
        rating: 5,
        text: "আমি প্রথমবার বিড়াল পালছি। AI chatbot থেকে অনেক সাহায্য পেয়েছি। লুলু এখন আমার সবচেয়ে ভালো বন্ধু। ধন্যবাদ PurrfectHub!",
        date: "1 month ago"
    },
    {
        name: "Kamal Ahmed",
        location: "Rajshahi",
        image: "/images/testimonials/kamal.jpg",
        catName: "Raja",
        rating: 5,
        text: "I was looking for a Maine Coon and found Raja through PurrfectHub. The platform made it so easy to filter by breed and location. Highly recommended!",
        date: "2 weeks ago"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-sm font-semibold mb-4">
                            <Star className="h-4 w-4 fill-current" />
                            <span>Success Stories</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
                            Happy Tails from{" "}
                            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                                Our Community
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Real stories from real families who found their purrfect companions through our platform.
                        </p>
                    </motion.div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/50 hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Quote className="h-16 w-16" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 text-base">
                                "{testimonial.text}"
                            </p>

                            {/* User Info */}
                            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Adopted {testimonial.catName} • {testimonial.location}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {testimonial.date}
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground text-lg">
                        Join{" "}
                        <span className="font-bold text-primary">10,000+ happy families</span>{" "}
                        who found their perfect companion
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
