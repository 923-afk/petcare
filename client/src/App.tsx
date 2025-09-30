import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import Landing from "@/pages/landing";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import OwnerDashboard from "@/pages/owner/dashboard";
import OwnerBooking from "@/pages/owner/booking";
import OwnerPets from "@/pages/owner/pets";
import PetProfile from "@/pages/owner/pet-profile";
import ClinicDashboard from "@/pages/clinic/dashboard";
import ClinicAppointments from "@/pages/clinic/appointments";
import ClinicPatients from "@/pages/clinic/patients";
import Navigation from "@/components/navigation";
import { Chatbot } from "@/components/chatbot";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const isAuthPage = location === '/login' || location === '/register';

  useEffect(() => {
    const themes = ['owner-theme', 'clinic-theme', 'vet-theme'];
    themes.forEach(theme => document.documentElement.classList.remove(theme));
    
    if (user?.userType === 'owner') {
      document.documentElement.classList.add('owner-theme');
    } else if (user?.userType === 'clinic') {
      document.documentElement.classList.add('clinic-theme');
    } else if (user?.userType === 'vet') {
      document.documentElement.classList.add('vet-theme');
    }
    
    return () => {
      themes.forEach(theme => document.documentElement.classList.remove(theme));
    };
  }, [user?.userType]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        {/* Owner routes */}
        {isAuthenticated && user?.userType === 'owner' && (
          <>
            <Route path="/dashboard" component={OwnerDashboard} />
            <Route path="/booking" component={OwnerBooking} />
            <Route path="/pets" component={OwnerPets} />
            <Route path="/pets/:id" component={PetProfile} />
          </>
        )}

        {/* Clinic routes */}
        {isAuthenticated && user?.userType === 'clinic' && (
          <>
            <Route path="/dashboard" component={ClinicDashboard} />
            <Route path="/appointments" component={ClinicAppointments} />
            <Route path="/patients" component={ClinicPatients} />
          </>
        )}

        <Route component={NotFound} />
      </Switch>
      
      {/* Floating Chatbot - only show when authenticated */}
      {isAuthenticated && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
