"use client";

import { MedicalRecordList } from "@/components/medical/MedicalRecordList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Cat } from "@/models/types";
import { CatService } from "@/services/cat-service";
import { Activity, ChevronRight, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MedicalRecordsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCats();
  }, []);

  useEffect(() => {
      if (!searchQuery) {
          setFilteredCats(cats);
          return;
      }
      const lower = searchQuery.toLowerCase();
      const filtered = cats.filter(c => c.name.toLowerCase().includes(lower));
      setFilteredCats(filtered);
  }, [searchQuery, cats]);

  const fetchCats = async () => {
    try {
      // Assuming shelters want to see their own cats to manage records
      // Using existing service method if available, otherwise fallback to generic
      // Based on previous chats, CatService.getMyCats() exists for Shelters.
      const result = await CatService.getMyCats(1, 100); // Fetch mostly all for list
      setCats(Array.isArray(result) ? result : result.data || []);
      setFilteredCats(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch cats");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
            <p className="text-muted-foreground">Manage vaccinations and health history for your cats.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6 flex-1 overflow-hidden">
          {/* Sidebar: Cat List */}
          <Card className="flex flex-col h-full border-muted/60 bg-muted/10">
              <div className="p-4 border-b space-y-4">
                  <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                          placeholder="Search cats..." 
                          className="pl-9 bg-background"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)} 
                      />
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {isLoading ? (
                      <div className="flex justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                  ) : filteredCats.length === 0 ? (
                      <div className="text-center p-4 text-sm text-muted-foreground">
                          No cats found.
                      </div>
                  ) : (
                      filteredCats.map(cat => (
                          <button
                              key={cat.id}
                              onClick={() => setSelectedCat(cat)}
                              className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors hover:bg-background border border-transparent ${
                                  selectedCat?.id === cat.id ? "bg-background shadow-sm border-muted" : ""
                              }`}
                          >
                              <Avatar className="h-10 w-10">
                                  <AvatarImage src={cat.imageUrl} className="object-cover" />
                                  <AvatarFallback>{cat.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 overflow-hidden">
                                  <div className="font-medium truncate">{cat.name}</div>
                                  <div className="text-xs text-muted-foreground truncate">{cat.breed}</div>
                              </div>
                              {selectedCat?.id === cat.id && <ChevronRight className="h-4 w-4 text-primary" />}
                          </button>
                      ))
                  )}
              </div>
          </Card>

          {/* Main Content: Records List */}
          <Card className="flex flex-col h-full overflow-hidden border-muted/60">
              {selectedCat ? (
                  <MedicalRecordList catId={selectedCat.id} />
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-muted/5">
                      <Activity className="h-16 w-16 mb-4 opacity-20" />
                      <h3 className="text-lg font-medium">No cat selected</h3>
                      <p className="max-w-xs mx-auto mt-2">Select a cat from the list to view and manage their medical records.</p>
                  </div>
              )}
          </Card>
      </div>
    </div>
  );
}
