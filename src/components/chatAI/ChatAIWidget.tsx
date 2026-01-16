"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AIChatService } from "@/services/ai-chat-service";
import { Bot, Loader2, MessageSquare, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export function ChatAIWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hello! I am MeowMate, your PurrfectHub assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await AIChatService.chatWithAI(input);

            const botMessage: Message = {
                text: response.data || "Sorry, I encountered an error. Please try again.",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    text: "I'm having trouble connecting right now. Please check back later!",
                    sender: "bot",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="w-80 md:w-96 h-[500px] mb-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border-primary/20 bg-background/95 backdrop-blur-sm">
                    <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6" />
                                <CardTitle className="text-lg font-bold">MeowMate</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-primary-foreground/20 text-primary-foreground h-8 w-8"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === "user" ? "bg-primary" : "bg-muted"
                                            }`}
                                    >
                                        {msg.sender === "user" ? (
                                            <User className="w-5 h-5 text-primary-foreground" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div
                                        className={`p-3 rounded-2xl text-sm break-words whitespace-pre-wrap ${msg.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none border"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 items-center text-muted-foreground">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                    <span className="text-xs">Purring for answers...</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t flex gap-2">
                        <Input
                            placeholder="Ask anything about cats..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            disabled={isLoading}
                            className="rounded-full focus-visible:ring-primary h-10"
                        />
                        <Button
                            size="icon"
                            disabled={isLoading || !input.trim()}
                            onClick={handleSendMessage}
                            className="rounded-full shrink-0 h-10 w-10"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            )}

            <Button
                size="lg"
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-all duration-300 ${isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </Button>
        </div>
    );
}
