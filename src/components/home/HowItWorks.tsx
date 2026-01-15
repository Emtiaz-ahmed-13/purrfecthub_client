"use client";

import { motion } from "framer-motion";
import { Check, FileCheck, Heart, Search, Sparkles } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Browse Cats",
        titleBn: "বিড়াল খুঁজুন",
        description: "Explore our verified shelters and find cats that match your preferences",
        descriptionBn: "আমাদের verified shelter থেকে আপনার পছন্দের বিড়াল খুঁজুন",
        color: "from-cyan-500 to-primary"
    },
    {
        number: "02",
        icon: FileCheck,
        title: "Apply Online",
        titleBn: "অনলাইনে আবেদন করুন",
        description: "Submit your adoption application with just a few clicks",
        descriptionBn: "কয়েক ক্লিকেই আপনার দত্তক আবেদন জমা দিন",
        color: "from-primary to-purple-500"
    },
    {
        number: "03",
        icon: Heart,
        title: "Meet & Greet",
        titleBn: "সাক্ষাৎ করুন",
        description: "Visit the shelter to meet your future companion in person",
        descriptionBn: "আপনার ভবিষ্যৎ সঙ্গীর সাথে সরাসরি দেখা করুন",
        color: "from-purple-500 to-pink-500"
    },
    {
        number: "04",
        icon: Sparkles,
        title: "Bring Home",
        titleBn: "বাড়িতে নিয়ে আসুন",
        description: "Complete the process and welcome your new family member",
        descriptionBn: "প্রক্রিয়া সম্পন্ন করুন এবং নতুন পরিবার সদস্যকে স্বাগতম",
        color: "from-pink-500 to-rose-500"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                            <Check className="h-4 w-4" />
                            <span>Simple Process</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
                            How It{" "}
                            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                                Works
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Four simple steps to find your purrfect companion
                        </p>
                        <p className="text-base text-muted-foreground mt-2">
                            আপনার পারফেক্ট সঙ্গী খুঁজতে মাত্র চারটি সহজ ধাপ
                        </p>
                    </motion.div>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line - Desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-amber-500 opacity-20 -translate-y-1/2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative group"
                            >
                                {/* Card */}
                                <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/50 h-full flex flex-col items-center text-center hover:-translate-y-2">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-primary flex items-center justify-center text-white font-bold text-lg shadow-xl z-10">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="relative mb-6">
                                        <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                            <step.icon className="h-10 w-10" />
                                        </div>
                                        <div className={`absolute -inset-2 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10`}></div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-base font-semibold text-primary/80 mb-4">
                                        {step.titleBn}
                                    </p>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                                        {step.description}
                                    </p>
                                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                                        {step.descriptionBn}
                                    </p>

                                    {/* Checkmark */}
                                    <div className="mt-auto pt-6">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Check className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>

                                    {/* Hover Glow */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                                </div>

                                {/* Arrow - Desktop Only */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                                        <div className="w-6 h-6 rotate-45 bg-gradient-to-br from-primary to-pink-500 opacity-30"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-16 p-6 rounded-2xl bg-primary/5 border border-primary/10"
                >
                    <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Need help?</span> Our AI chatbot and support team are available 24/7 to guide you through the process
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        সাহায্য প্রয়োজন? আমাদের AI chatbot এবং support team ২৪/৭ আপনাকে সাহায্য করতে প্রস্তুত
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
