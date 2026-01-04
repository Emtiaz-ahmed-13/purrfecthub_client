"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CatService, CreateCatData } from "@/services/cat-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const catFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.number().min(0, "Age must be positive"),
  gender: z.enum(["MALE", "FEMALE"]),
  color: z.string().optional(),
  weight: z.number().optional(),
  description: z.string().optional(),
  isVaccinated: z.boolean(),
  isNeutered: z.boolean(),
  specialNeeds: z.string().optional(),
});


import { Cat } from "@/models/types";

// ... existing imports

interface CatFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Cat;
}

export function CatForm({ onSuccess, onCancel, initialData }: CatFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const form = useForm<z.infer<typeof catFormSchema>>({
        resolver: zodResolver(catFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            breed: initialData?.breed || "",
            age: initialData?.age || 0,
            gender: (initialData?.gender as "MALE" | "FEMALE") || "MALE",
            color: initialData?.color || "",
            description: initialData?.description || "",
            isVaccinated: initialData?.isVaccinated || false,
            isNeutered: initialData?.isNeutered || false,
            specialNeeds: initialData?.specialNeeds || "",
            weight: initialData?.weight,
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

    async function onSubmit(values: z.infer<typeof catFormSchema>) {
        setIsLoading(true);
        try {
            if (initialData) {
                await CatService.updateCat(initialData.id, values);
                toast.success("Cat updated successfully!");
            } else {
                await CatService.createCat(values as CreateCatData, selectedImages);
                toast.success("Cat created successfully!");
            }
            onSuccess();
        } catch (error: any) {
             toast.error(error.message || `Failed to ${initialData ? "update" : "create"} cat`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Luna" {...field} />
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
                                    <Input placeholder="British Shorthair" {...field} />
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
                                        placeholder="12" 
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
                
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="Grey" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        step="0.1" 
                                        placeholder="4.5" 
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                                    />
                                </FormControl>
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
                                <Textarea placeholder="Tell us about the cat..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="isVaccinated"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Vaccinated
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isNeutered"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Neutered
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                 <FormField
                        control={form.control}
                        name="specialNeeds"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Special Needs (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="None" {...field} />
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
                                    <div className="w-20 h-20 rounded-md overflow-hidden border">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </FormItem>


                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Cat" : "Create Cat"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
