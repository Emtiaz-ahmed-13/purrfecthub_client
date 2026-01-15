import { FeatureIcon } from "@/models/types";
import {
  Cat,
  CreditCard,
  HeartHandshake,
  MessageCircle,
  Shield,
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
  },
  {
    icon: Shield,
    title: "Verified & Safe",
    description: "All shelters are verified by our team to ensure the highest standards of care."
  },
  {
    icon: MessageCircle,
    title: "Direct Chat",
    description: "Message shelters directly to ask questions and schedule meet-and-greets."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Why Choose PurrfectHub?
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            Everything You Need for a{" "}
            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              Happy Cat
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to make cat adoption, care, and support easier than ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/50 flex flex-col items-start hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 border border-cyan-500/20">
                  <feature.icon className="h-7 w-7 text-cyan-500" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-500 to-primary group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
