import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 bg-primary/5 border-y border-primary/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you adopt, foster, or donate, your contribution changes lives. Join our community of cat lovers today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-lg rounded-full">
              Create an Account
            </Button>
          </Link>
          <Link href="/donate">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full bg-background">
              Make a Donation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
