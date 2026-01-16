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
  participants: {
    user: {
      id: string;
      name: string;
      avatar: string | null;
      role: string;
    };
  }[];
  cat?: {
    id: string;
    name: string;
    images: string[];
  };
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount?: number;
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
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (e) { console.error("Error decoding token", e) }
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const catId = urlParams.get('catId');

    if (userId && currentUserId) {
      handleAutoOpenConversation(userId, catId || undefined);
    }
  }, [currentUserId]);

  const handleAutoOpenConversation = async (participantId: string, catId?: string) => {
    try {
      // Try to start/get conversation
      const result = await ChatService.createConversation(participantId, catId);
      const convId = result.id || result.data?.id;

      if (convId) {
        // Re-fetch conversations to refresh the list and then set as active
        await fetchConversations();
        setActiveConversation(convId);
      }
    } catch (error) {
      console.error("Failed to auto-open conversation:", error);
      toast.error("Could not open chat with this user");
    }
  };

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
      // Check if user is authenticated
      const token = localStorage.getItem("accessToken");
      if (!token || token === "undefined") {
        toast.error("Please login to access chat");
        window.location.href = "/login?redirect=/chat";
        return;
      }

      const data = await ChatService.getConversations();
      // Handle array vs object response structure
      setConversations(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (error: any) {
      console.error("Chat error:", error);
      setLoading(false);

      // Check if it's an authentication error
      if (error.message?.includes("jwt") || error.message?.includes("401") || error.message?.includes("unauthorized")) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("accessToken");
        window.location.href = "/login?redirect=/chat";
      } else {
        toast.error("Could not load conversations. Please try again later.");
      }
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
                {conversations.map((conv) => {
                  const otherParticipant = conv.participants?.find(p => p.user.id !== currentUserId)?.user;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv.id)}
                      className={`flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b border-muted/30 ${activeConversation === conv.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                        }`}
                    >
                      <Avatar>
                        <AvatarImage src={otherParticipant?.avatar || ""} />
                        <AvatarFallback>{otherParticipant?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate flex justify-between items-center gap-2">
                          <span className="truncate">{otherParticipant?.name || "User"}</span>
                          {conv.unreadCount ? (
                            <span className="bg-primary text-primary-foreground text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        {conv.cat && (
                          <div className="text-[10px] text-primary flex items-center gap-1 font-semibold uppercase tracking-wider mb-1">
                            🐱 {conv.cat.name}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage || "Click to chat"}
                        </div>
                      </div>
                    </button>
                  );
                })}
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
              <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={conversations.find(c => c.id === activeConversation)?.participants?.find(p => p.user.id !== currentUserId)?.user.avatar || ""} />
                    <AvatarFallback>
                      {conversations.find(c => c.id === activeConversation)?.participants?.find(p => p.user.id !== currentUserId)?.user.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold leading-tight">
                      {conversations.find(c => c.id === activeConversation)?.participants?.find(p => p.user.id !== currentUserId)?.user.name || "Chat"}
                    </span>
                    {conversations.find(c => c.id === activeConversation)?.cat && (
                      <span className="text-[10px] text-primary font-medium">
                        Discussing: {conversations.find(c => c.id === activeConversation)?.cat?.name}
                      </span>
                    )}
                  </div>
                </div>
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
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                            }`}
                        >
                          <p>{msg.content}</p>
                          <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
