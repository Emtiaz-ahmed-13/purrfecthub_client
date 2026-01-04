"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatService } from "@/services/chat-service";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage?: {
      content: string;
      createdAt: string;
  };
  updatedAt: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // In a real app, you'd get the current user ID from context/token to style messages
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); 

  useEffect(() => {
    // Decode token to get current user ID for basic "me" vs "them" styling
    const token = localStorage.getItem("accessToken");
    if(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUserId(payload.id);
        } catch(e) { console.error("Error decoding token", e)}
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
      // Optional: Set up an interval for polling messages if no sockets
      const interval = setInterval(() => fetchMessages(activeConversation), 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  useEffect(() => {
      // Scroll to bottom when messages change
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await ChatService.getConversations();
      // Handle array vs object response structure
      setConversations(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Don't show toast on initial load error to avoid spam if empty
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await ChatService.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      await ChatService.sendMessage(activeConversation, newMessage);
      setNewMessage("");
      fetchMessages(activeConversation); // Refresh immediately
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center md:h-[calc(100vh-80px)] h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:h-[calc(100vh-80px)] h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" /> Messages
      </h1>

      <div className="grid md:grid-cols-[300px_1fr] gap-6 flex-1 h-[500px] md:h-full">
        {/* Sidebar: Conversations List */}
        <Card className="flex flex-col h-full border-muted/60 overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold">Inbox</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No conversations yet.
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                className={`flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b border-muted/30 ${
                                    activeConversation === conv.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                                }`}
                            >
                                <Avatar>
                                    <AvatarImage src="" />
                                    <AvatarFallback>{conv.participant?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="font-medium truncate">{conv.participant?.name || "User"}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {conv.lastMessage?.content || "Click to chat"}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Card>

        {/* Main: Chat Area */}
        <Card className="flex flex-col h-full border-muted/60 overflow-hidden relative">
            {!activeConversation ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-muted/10">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Select a conversation</h3>
                    <p className="max-w-xs mx-auto mt-2">Choose a contact from the list to start messaging.</p>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="p-4 border-b flex items-center gap-3 bg-muted/20">
                        <Avatar className="h-8 w-8">
                             <AvatarFallback>
                                {conversations.find(c => c.id === activeConversation)?.participant?.name?.[0] || "?"}
                             </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">
                            {conversations.find(c => c.id === activeConversation)?.participant?.name || "Chat"}
                        </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
                        {messages.length === 0 ? (
                            <div className="text-center text-xs text-muted-foreground py-10 opacity-70">
                                This is the start of your conversation.
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.senderId === currentUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-muted text-foreground rounded-bl-none"
                                            }`}
                                        >
                                            <p>{msg.content}</p>
                                            <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-background">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Input 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 rounded-full"
                            />
                            <Button size="icon" type="submit" disabled={sending || !newMessage.trim()} className="rounded-full">
                                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </Card>
      </div>
    </div>
  );
}
