import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Join thousands of pet owners and veterinary clinics who trust Pet Palette for their pet care needs.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 border-2 border-white text-lg px-8"
            data-testid="button-get-started-free"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white backdrop-blur-sm bg-white/20 hover:bg-white/30 text-lg px-8"
            data-testid="button-sign-in-cta"
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
