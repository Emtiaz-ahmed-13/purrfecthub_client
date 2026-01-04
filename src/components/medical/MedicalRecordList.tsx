"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MedicalRecord } from "@/models/types";
import { MedicalRecordService } from "@/services/medical-record-service";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MedicalRecordForm } from "./MedicalRecordForm";

interface MedicalRecordListProps {
    catId: string;
    canEdit?: boolean;
}

export function MedicalRecordList({ catId, canEdit = false }: MedicalRecordListProps) {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<MedicalRecord | undefined>(undefined);

    useEffect(() => {
        fetchRecords();
    }, [catId]);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const result = await MedicalRecordService.getCatRecords(catId);
            setRecords(result.data || []);
        } catch (error) {
            console.error("Failed to fetch records:", error);
            // toast.error("Failed to load medical records");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            await MedicalRecordService.deleteRecord(id);
            toast.success("Record deleted");
            fetchRecords();
        } catch (error) {
            toast.error("Failed to delete record");
        }
    };

    const handleSuccess = () => {
        setIsAddOpen(false);
        setEditingRecord(undefined);
        fetchRecords();
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading records...</div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Medical History</CardTitle>
                    <CardDescription>Health records and vaccination history</CardDescription>
                </div>
                {canEdit && (
                    <Dialog open={isAddOpen} onOpenChange={(open) => {
                        setIsAddOpen(open);
                        if (!open) setEditingRecord(undefined);
                    }}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setEditingRecord(undefined)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingRecord ? "Edit Record" : "Add Medical Record"}</DialogTitle>
                            </DialogHeader>
                            <MedicalRecordForm 
                                catId={catId} 
                                onSuccess={handleSuccess} 
                                onCancel={() => setIsAddOpen(false)} 
                                initialData={editingRecord}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent>
                {records.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No medical records found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Veterinarian</TableHead>
                                {canEdit && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{record.type}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={record.description}>
                                        {record.description}
                                    </TableCell>
                                    <TableCell>{record.veterinarian || "-"}</TableCell>
                                    {canEdit && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => {
                                                        setEditingRecord(record);
                                                        setIsAddOpen(true);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(record.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
