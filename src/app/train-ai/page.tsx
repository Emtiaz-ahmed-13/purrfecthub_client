"use client";

import AITrainingService from "@/services/ai-training-service";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, BrainCircuit, CheckCircle2, ChevronRight, Globe, Heart, Info, MessageSquare, Send, Sparkles, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const FloatingIcon = ({ children, delay = 0, x = 0, y = 0 }: { children: React.ReactNode, delay?: number, x?: number, y?: number }) => (
    <motion.div
        animate={{
            y: [y, y - 20, y],
            x: [x, x + 10, x],
            rotate: [0, 5, -5, 0],
        }}
        transition={{
            duration: 6,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
        }}
        className="absolute opacity-20 pointer-events-none"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        {children}
    </motion.div>
);

export default function TrainAIPage() {
    const [formData, setFormData] = useState<{
        content: string;
        language: "bn" | "en" | "mixed";
        intent: "general" | "care" | "adoption" | "health";
        createdBy: string;
    }>({
        content: "",
        language: "bn",
        intent: "general",
        createdBy: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        setCharCount(formData.content.length);
    }, [formData.content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await AITrainingService.submitSuggestion(formData);
            setSubmitted(true);
            setFormData({ content: "", language: "bn", intent: "general", createdBy: "" });
            toast.success("আপনার প্রশ্নটি সফলভাবে জমা হয়েছে!");
            setTimeout(() => setSubmitted(false), 8000);
        } catch (error) {
            console.error("Failed to submit:", error);
            toast.error("দুঃখিত! আপনার প্রশ্ন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-primary/40 selection:text-white relative overflow-hidden">
            {/* dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />

                {/* Floating Decorative Icons */}
                <FloatingIcon x={10} y={20} delay={1}><BrainCircuit size={40} className="text-primary" /></FloatingIcon>
                <FloatingIcon x={85} y={15} delay={2}><Sparkles size={32} className="text-amber-400" /></FloatingIcon>
                <FloatingIcon x={75} y={80} delay={0.5}><Heart size={36} className="text-rose-500" /></FloatingIcon>
                <FloatingIcon x={15} y={75} delay={1.5}><MessageSquare size={44} className="text-emerald-400" /></FloatingIcon>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-lg shadow-primary/5"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>Empowering AI with Community Knowledge</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                        Help Make Our AI <br />
                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent italic">Smarter & Kinder</span>
                    </h1>

                    <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
                        আপনার প্রতিটি প্রশ্ন আমাদের চ্যাটবটকে আরও দক্ষ করে তোলে। চলুন একসাথে তৈরি করি একটি আরও সুন্দর ও সহায়তাকারী বিড়াল প্রেমী কমিউনিটি।
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Instructions Column */}
                    <div className="lg:col-span-5 space-y-8 h-full">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl shadow-2xl space-y-10"
                        >
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                    </div>
                                    The Roadmap
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { step: "01", title: "Select Mode", desc: "Choose your preferred language context." },
                                        { step: "02", title: "Categorize", desc: "Help us pinpoint the intent of your query." },
                                        { step: "03", title: "Inspire", desc: "Type naturally, like you're asking a friend." },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-slate-700/50">
                                                {item.step}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{item.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-primary/5 border border-indigo-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BrainCircuit size={80} />
                                </div>
                                <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Expert Strategy
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                                    "কিভাবে যত্ন নেব?" এবং "যত্ন নেওয়ার উপায় কি?" — একই কথা ভিন্নভাবে করলে বটের বোধশক্তি বাড়ে।
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                            className="relative group"
                        >
                            {/* Decorative Glow behind form */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                            <form onSubmit={handleSubmit} className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#0f172a] border border-slate-800 shadow-3xl overflow-hidden">
                                <AnimatePresence>
                                    {submitted && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.5, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/10"
                                            >
                                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                            </motion.div>
                                            <h2 className="text-4xl font-black mb-4 tracking-tight">Mission Success!</h2>
                                            <p className="text-slate-400 text-lg mb-10 max-w-xs mx-auto">
                                                আপনার প্রশ্নটি আমাদের ডাটাবেসে সুরক্ষিত আছে। শীঘ্রই এটি আমাদের বটের ব্রেইনে পৌঁছাবে।
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={() => setSubmitted(false)}
                                                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600"
                                            >
                                                Submit Another One <ChevronRight className="w-4 h-4" />
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-8">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Context Language</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <select
                                                    value={formData.language}
                                                    onChange={(e) => setFormData({ ...formData, language: e.target.value as "bn" | "en" | "mixed" })}
                                                    className="w-full bg-slate-900/50 border-slate-800 rounded-2xl pl-11 pr-4 py-4 focus:ring-2 focus:ring-primary/50 border-2 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer text-slate-200"
                                                >
                                                    <option value="bn">বাংলা (Bengali)</option>
                                                    <option value="en">English</option>
                                                    <option value="mixed">Benglish (Mixed)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Training Intent</label>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <select
                                                    value={formData.intent}
                                                    onChange={(e) => setFormData({ ...formData, intent: e.target.value as "general" | "care" | "adoption" | "health" })}
                                                    className="w-full bg-slate-900/50 border-slate-800 rounded-2xl pl-11 pr-4 py-4 focus:ring-2 focus:ring-primary/50 border-2 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer text-slate-200"
                                                >
                                                    <option value="general">সাধারন আলাপ (General)</option>
                                                    <option value="care">বিড়ালের যত্ন (Care)</option>
                                                    <option value="adoption">দত্তক প্রক্রিয়া (Adoption)</option>
                                                    <option value="health">স্বাস্থ্য সমস্যা (Health)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end ml-1">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Your Knowledge Submission</label>
                                            <span className={`text-[10px] font-bold ${charCount > 200 ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                {charCount} chars
                                            </span>
                                        </div>
                                        <textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="যেমন: বিড়াল কি নিয়মিত গোসল করানো উচিত?"
                                            className="w-full bg-slate-900/50 border-slate-800 rounded-[2rem] px-6 py-5 min-h-[160px] focus:ring-2 focus:ring-primary/50 border-2 focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 resize-none text-slate-200 leading-relaxed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Contributor Alias (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.createdBy}
                                            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                                            placeholder="আপনার নাম বা ছদ্মনাম"
                                            className="w-full bg-slate-900/50 border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/50 border-2 focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 text-slate-200"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.4)" }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting || charCount < 5}
                                        className="w-full bg-gradient-to-r from-primary to-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-white font-black text-lg py-5 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-1 group-hover:translate-y-0 transition-transform" />
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Processing Knowledge...</span>
                                            </div>
                                        ) : (
                                            <>
                                                Deploy Submission
                                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-24 text-center border-t border-slate-800/50 pt-10"
                >
                    <p className="text-slate-500 text-sm font-medium">
                        © 2026 PurrfectHub Neural Network Team. All submissions are processed through community review.
                    </p>
                </motion.div>
            </div>

            <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 8s linear infinite;
                }
            `}</style>
        </div>
    );
}
