import { FeatureIcon } from "@/models/types";
import {
    Cat,
    CreditCard,
    HeartHandshake,
    Stethoscope
} from "lucide-react";

const features: FeatureIcon[] = [
  {
    icon: Cat,
    title: "Seamless Adoption",
    description: "Browse curated profiles, apply online, and track your application status in real-time."
  },
  {
    icon: Stethoscope,
    title: "Medical Records",
    description: "Access complete vaccination history, health reports, and set up vet appointment reminders."
  },
  {
    icon: CreditCard,
    title: "Direct Donations",
    description: "Support shelters and specific cats directly with secure Stripe payments."
  },
  {
    icon: HeartHandshake,
    title: "Trusted Shelters",
    description: "Connect with verified shelters and foster parents committed to feline welfare."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Everything You Need for a Happy Cat
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to make cat adoption, care, and support easier than ever.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border/50 flex flex-col items-center text-center"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
