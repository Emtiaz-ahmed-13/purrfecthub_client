"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShelterRequestService } from "@/services/shelter-request-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const submitCatSchema = z.object({
    catName: z.string().min(1, "Cat name is required"),
    breed: z.string().min(1, "Breed is required"),
    age: z.number().min(0, "Age must be positive"),
    gender: z.enum(["MALE", "FEMALE"]),
    description: z.string().optional(),
});

interface SubmitCatModalProps {
    shelterId: string;
    shelterName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function SubmitCatModal({ shelterId, shelterName, isOpen, onClose }: SubmitCatModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const form = useForm<z.infer<typeof submitCatSchema>>({
        resolver: zodResolver(submitCatSchema),
        defaultValues: {
            catName: "",
            breed: "",
            age: 0,
            gender: "MALE",
            description: "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            if (selectedImages.length + filesArray.length > 5) {
                toast.error("You can only upload up to 5 images");
                return;
            }
            setSelectedImages((prev) => [...prev, ...filesArray]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    async function onSubmit(values: z.infer<typeof submitCatSchema>) {
        setIsLoading(true);
        try {
            await ShelterRequestService.createRequest(
                { ...values, shelterId },
                selectedImages
            );
            toast.success("Your request has been submitted to the shelter!");
            form.reset();
            setSelectedImages([]);
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit request");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Submit Cat to {shelterName}</DialogTitle>
                    <DialogDescription>
                        Provide details about the cat you'd like to request this shelter to take in.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="catName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cat Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Whiskers" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="breed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Breed *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tabby" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age (Months) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell the shelter about the cat's background..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Images (Max 5)</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                            </FormControl>
                            {selectedImages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-16 h-16 rounded-md overflow-hidden border">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FormItem>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
