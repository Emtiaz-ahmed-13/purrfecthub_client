import { Button } from "@/components/ui/button";
import { Cat } from "@/models/types";
import { Info, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock Data matching backend schema partially
const featuredCats: Cat[] = [
  {
    id: "1",
    name: "Luna",
    breed: "Siamese",
    age: 2,
    gender: "Female",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=800&auto=format&fit=crop",
    status: "Available"
  },
  {
    id: "2",
    name: "Oliver",
    breed: "Maine Coon",
    age: 4,
    gender: "Male",
    location: "Brooklyn, NY",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop",
    status: "Available"
  },
  {
    id: "3",
    name: "Milo",
    breed: "Tabby",
    age: 1,
    gender: "Male",
    location: "Queens, NY",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=800&auto=format&fit=crop",
    status: "Available"
  },
  {
    id: "4",
    name: "Bella",
    breed: "Persian",
    age: 3,
    gender: "Female",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop",
    status: "Available"
  }
];

export function FeaturedCats() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
              Meet Your Future Best Friend
            </h2>
            <p className="text-lg text-muted-foreground">
              These adorable cats are waiting for a loving home like yours.
            </p>
          </div>
          <Link href="/cats" className="hidden sm:block">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All Cats &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCats.map((cat) => (
            <div key={cat.id} className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider text-foreground">
                  {cat.status}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.breed}</p>
                  </div>
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {cat.age} yrs
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4 mr-1" />
                  {cat.location}
                </div>

                <Link href={`/cats/${cat.id}`} className="mt-auto w-full">
                  <Button className="w-full" variant="secondary">
                    Details <Info className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center sm:hidden">
           <Link href="/cats">
            <Button variant="outline" className="w-full">
              View All Cats
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
