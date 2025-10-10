import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import ThemeToggle from "@/components/theme-toggle";

interface NavbarProps {
  variant?: "landing" | "dashboard";
  onSignOut?: () => void;
}

export default function Navbar({ variant = "landing", onSignOut }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 -ml-3" data-testid="link-home">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="font-heading text-xl font-bold">Vetcepi</span>
            </a>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {variant === "landing" ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild data-testid="button-sign-in">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild data-testid="button-get-started">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={onSignOut}
                data-testid="button-sign-out"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
