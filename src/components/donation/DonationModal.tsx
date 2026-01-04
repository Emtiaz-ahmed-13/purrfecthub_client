"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DonationService } from "@/services/donation-service";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface DonationModalProps {
    catId?: string;
    shelterId?: string;
    catName?: string;
    shelterName?: string;
    trigger?: React.ReactNode;
}

function CheckoutForm({ clientSecret, onSuccess, onCancel }: { clientSecret: string, onSuccess: () => void, onCancel: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard/adopter?payment_status=success`, 
            },
            redirect: "if_required", 
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                toast.success("Donation successful! Thank you!");
                onSuccess();
            } catch (err) {
                console.error(err);
                toast.error("Donation processing error");
            }
            setIsLoading(false);
        } else {
             setMessage("Payment status: " + paymentIntent.status);
             setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {message && <div className="text-red-500 text-sm">{message}</div>}
             <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !stripe || !elements}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Pay Now
                </Button>
            </div>
        </form>
    );
}

export function DonationModal({ catId, shelterId, catName, shelterName, trigger }: DonationModalProps) {
    const [amount, setAmount] = useState<number>(10); // Default $10
    const [isOpen, setIsOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sessionId, setSessionId] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    
    // Stripe instance
    // Note: useStripe() only works inside Elements provider, which wraps the modal content conditionally below
    // So we invoke stripe promise manually for redirect flow initialization

    const handleInitialize = async () => {
        setIsLoading(true);
        try {
            const result = await DonationService.initializeDonation({
                amount,
                catId,
                shelterId
            });
            
            // If API returns sessionId, use Checkout flow
            if (result.sessionId) {
                 const stripeInstance = await stripePromise;
                 if (stripeInstance) {
                     const { error } = await (stripeInstance as any).redirectToCheckout({
                         sessionId: result.sessionId
                     });
                     if (error) toast.error(error.message);
                 }
                 setIsOpen(false); 
                 return;
            }

            // Fallback to Elements if clientSecret provided
            if (result.clientSecret) {
                setClientSecret(result.clientSecret);
            }
        } catch (error: any) {
             toast.error(error.message || "Failed to initialize donation");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setClientSecret(null);
                setAmount(10);
            }
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="default" size="sm" className="bg-pink-600 hover:bg-pink-700">
                        <Heart className="w-4 h-4 mr-2" />
                        Donate
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Donate to {catName || shelterName || "Shelter"}</DialogTitle>
                    <DialogDescription>
                        Your contribution helps provide food, shelter, and medical care.
                    </DialogDescription>
                </DialogHeader>

                {!clientSecret ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <div className="flex gap-2">
                                {[10, 25, 50, 100].map((val) => (
                                    <Button
                                        key={val}
                                        type="button"
                                        variant={amount === val ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setAmount(val)}
                                    >
                                        ${val}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Button onClick={handleInitialize} disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Proceed to Payment
                        </Button>
                    </div>
                ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm 
                            clientSecret={clientSecret} 
                            onSuccess={() => {
                                setIsOpen(false);
                            }} 
                            onCancel={() => setClientSecret(null)}
                        />
                    </Elements>
                )}
            </DialogContent>
        </Dialog>
    );
}
