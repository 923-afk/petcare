import { Card } from "@/components/ui/card";
import { Calendar, FileText, Video, AlertCircle, Users, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Booking",
    description: "AI-powered appointment scheduling with real-time availability and automatic reminders.",
  },
  {
    icon: FileText,
    title: "Digital Health Records",
    description: "Complete medical history, vaccination tracking, and secure document storage.",
  },
  {
    icon: Video,
    title: "Virtual Consultations",
    description: "Connect with veterinarians remotely for quick consultations and follow-ups.",
  },
  {
    icon: AlertCircle,
    title: "Emergency Care",
    description: "24/7 emergency support with instant clinic location and urgent care booking.",
  },
  {
    icon: Users,
    title: "Multi-Pet Profiles",
    description: "Manage multiple pets with individual profiles, schedules, and health tracking.",
  },
  {
    icon: TrendingUp,
    title: "Health Analytics",
    description: "Advanced insights and trends to keep your pets healthy and happy.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Everything for Your Pet's Health
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive pet care management designed for modern pet owners and veterinary professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover-elevate transition-all duration-200"
                data-testid={`card-feature-${index}`}
              >
                <div className="flex flex-col h-full">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
