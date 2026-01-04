"use client";

import { Button } from "@/components/ui/button";
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
import { MedicalRecord, MedicalRecordType } from "@/models/types";
import { MedicalRecordService } from "@/services/medical-record-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const medicalRecordSchema = z.object({
    type: z.nativeEnum(MedicalRecordType),
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    veterinarian: z.string().optional(),
    nextVisitDate: z.string().optional(),
    cost: z.number().min(0).optional(),
});

interface MedicalRecordFormProps {
    catId: string;
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: MedicalRecord;
}

export function MedicalRecordForm({ catId, onSuccess, onCancel, initialData }: MedicalRecordFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof medicalRecordSchema>>({
        resolver: zodResolver(medicalRecordSchema),
        defaultValues: {
            type: initialData?.type || MedicalRecordType.VET_VISIT,
            date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            description: initialData?.description || "",
            veterinarian: initialData?.veterinarian || "",
            nextVisitDate: initialData?.nextVisitDate ? new Date(initialData.nextVisitDate).toISOString().split('T')[0] : "",
            cost: initialData?.cost,
        },
    });

    async function onSubmit(values: z.infer<typeof medicalRecordSchema>) {
        setIsLoading(true);
        try {
            if (initialData) {
                await MedicalRecordService.updateRecord(initialData.id, values);
                toast.success("Medical record updated successfully!");
            } else {
                await MedicalRecordService.createRecord(catId, values);
                toast.success("Medical record created successfully!");
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${initialData ? "update" : "create"} record`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Record Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(MedicalRecordType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date *</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="veterinarian"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Veterinarian (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dr. Smith" {...field} />
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
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Vaccination details, checkup notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nextVisitDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Next Visit (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost (Optional)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="0.00" 
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Record" : "Add Record"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
