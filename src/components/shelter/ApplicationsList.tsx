"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdoptionApplication } from "@/models/types";
import { AdoptionService } from "@/services/adoption-service";
import { ChatService } from "@/services/chat-service";
import { Check, Loader2, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ApplicationsList() {
    const [applications, setApplications] = useState<AdoptionApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<AdoptionApplication | null>(null);
    const [reviewNotes, setReviewNotes] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [startingChatId, setStartingChatId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await AdoptionService.getShelterApplications();
            setApplications(response.data || []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selectedApp) return;

        setProcessingId(selectedApp.id);
        try {
            await AdoptionService.updateApplicationStatus(
                selectedApp.id,
                status,
                reviewNotes || undefined
            );

            toast.success(`Application ${status.toLowerCase()} successfully!`);
            setSelectedApp(null);
            setReviewNotes("");
            fetchApplications(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || `Failed to ${status.toLowerCase()} application`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleStartChat = async (adoptionId?: string) => {
        if (!adoptionId) {
            toast.error("Application information is missing");
            return;
        }

        setStartingChatId(adoptionId);
        try {
            const response = await ChatService.createConversation(adoptionId);
            const conversationId = response.data?.id || response.id;

            if (conversationId) {
                router.push(`/chat?conversationId=${conversationId}`);
                // Also pass adoptionId as fallback
            } else {
                router.push(`/chat?adoptionId=${adoptionId}`);
            }
            toast.success("Opening chat...");
        } catch (error: any) {
            console.error("Failed to start chat:", error);
            toast.error(error.message || "Failed to start chat");
        } finally {
            setStartingChatId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground">No adoption applications yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Applications will appear here when adopters apply for your cats.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                    <Card key={app.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{app.cat.name}</CardTitle>
                                    <CardDescription className="mt-1">
                                        Applicant: {app.adopterId || 'Unknown'}
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        app.status === 'APPROVED' ? 'default' :
                                            app.status === 'REJECTED' ? 'destructive' :
                                                'secondary'
                                    }
                                >
                                    {app.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {app.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                        {app.status === 'PENDING' ? (
                            <CardFooter className="p-4 pt-0 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setSelectedApp(app)}
                                >
                                    Review
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleStartChat(app.id)}
                                    disabled={startingChatId === app.id}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Chat
                                </Button>
                            </CardFooter>
                        ) : (
                            <CardFooter className="p-4 pt-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleStartChat(app.id)}
                                    disabled={startingChatId === app.id}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Message Adopter
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>

            {/* Review Dialog */}
            <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Application</DialogTitle>
                        <DialogDescription>
                            Review the adoption application for {selectedApp?.cat.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedApp && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Application Message:</h4>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    {selectedApp.message}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Review Notes (Optional)</label>
                                <Textarea
                                    placeholder="Add any notes about your decision..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedApp(null)}
                            disabled={processingId !== null || startingChatId !== null}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleStartChat(selectedApp?.id)}
                            disabled={processingId !== null || startingChatId !== null}
                        >
                            {startingChatId === selectedApp?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <MessageCircle className="h-4 w-4 mr-2" />
                            )}
                            Chat with Adopter
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleUpdateStatus('REJECTED')}
                            disabled={processingId !== null}
                        >
                            {processingId === selectedApp?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <X className="h-4 w-4 mr-2" />
                            )}
                            Reject
                        </Button>
                        <Button
                            onClick={() => handleUpdateStatus('APPROVED')}
                            disabled={processingId !== null}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {processingId === selectedApp?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Check className="h-4 w-4 mr-2" />
                            )}
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
