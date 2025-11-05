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
import ClinicsPage from "@/pages/clinics";
import OwnerDashboard from "@/pages/owner/dashboard";
import OwnerBooking from "@/pages/owner/booking";
import OwnerPets from "@/pages/owner/pets";
import PetProfile from "@/pages/owner/pet-profile";
import ClinicDashboard from "@/pages/clinic/dashboard";
import ClinicAppointments from "@/pages/clinic/appointments";
import ClinicPatients from "@/pages/clinic/patients";
import ClinicInventory from "@/pages/clinic/inventory";
import ClinicVaccinations from "@/pages/clinic/vaccinations";
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
    
        // 從用戶數據獲取用戶類型
        const userType = user?.userType;
        if (userType === 'owner') {
          document.documentElement.classList.add('owner-theme');
        } else if (userType === 'clinic') {
          document.documentElement.classList.add('clinic-theme');
        } else if (userType === 'vet') {
          document.documentElement.classList.add('vet-theme');
        }
    
    return () => {
      themes.forEach(theme => document.documentElement.classList.remove(theme));
    };
  }, [user?.userType]);

  // Dashboard component that routes based on user type
  const Dashboard = () => {
    if (!isAuthenticated || !user) {
      return <NotFound />;
    }
    if (user.userType === 'owner') {
      return <OwnerDashboard />;
    }
    if (user.userType === 'clinic') {
      return <ClinicDashboard />;
    }
    return <NotFound />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/clinics" component={ClinicsPage} />

        {/* Dashboard - routes based on user type */}
        {isAuthenticated && <Route path="/dashboard" component={Dashboard} />}

        {/* Owner routes */}
        {isAuthenticated && user?.userType === 'owner' && (
          <>
            <Route path="/booking" component={OwnerBooking} />
            <Route path="/pets" component={OwnerPets} />
            <Route path="/pets/:id" component={PetProfile} />
          </>
        )}

        {/* Clinic routes */}
        {isAuthenticated && user?.userType === 'clinic' && (
          <>
            <Route path="/appointments" component={ClinicAppointments} />
            <Route path="/patients" component={ClinicPatients} />
            <Route path="/inventory" component={ClinicInventory} />
            <Route path="/vaccinations" component={ClinicVaccinations} />
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
