"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PenBox } from "lucide-react";

// ... existing imports

export function CatList({ shouldRefresh, onEdit }: { shouldRefresh: boolean; onEdit: (cat: Cat) => void }) {
    const router = useRouter();
    const [cats, setCats] = useState<Cat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCats = async () => {
        setIsLoading(true);
        try {
            const response = await CatService.getMyCats();
            // Assuming simplified response for now, adjust based on actual API
            const catsData = response.data?.cats || response.data || response;
            setCats(Array.isArray(catsData) ? catsData : []);
        } catch (error) {
            console.error("Failed to fetch cats:", error);
            // toast.error("Failed to load cats"); // Optional: suppress if initial load
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCats();
    }, [shouldRefresh]);

    const handleDelete = async (id: string) => {
        try {
            await CatService.deleteCat(id);
            toast.success("Cat deleted successfully");
            fetchCats(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to delete cat");
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading cats...</div>;
    }



    // ... existing code ...

    if (cats.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No cats found. Add your first cat!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cats.map((cat) => (
                <Card key={cat.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/dashboard/shelter/cats/${cat.id}`)}>
                    <div className="aspect-square relative bg-muted group">
                        {cat.imageUrl ? (
                            <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No Image
                            </div>
                        )}
                         <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button 
                                variant="secondary" 
                                size="icon" 
                                className="h-8 w-8 bg-white/80 hover:bg-white text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(cat);
                                }}
                             >
                                <PenBox className="h-4 w-4" />
                             </Button>
                        </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="flex justify-between items-center text-lg">
                            {cat.name}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                cat.status === 'Adopted' ? 'bg-green-100 text-green-800' : 
                                cat.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {cat.status}
                            </span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{cat.breed} • {cat.gender}</p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                        <p>Age: {cat.age} months</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete {cat.name} from the database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(cat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
