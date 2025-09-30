import Navbar from "@/components/navbar";
import ClinicDashboard from "@/components/clinic-dashboard";
import { useLocation } from "wouter";

export default function ClinicPage() {
  const [, setLocation] = useLocation();
  
  const handleSignOut = () => {
    console.log("Sign out clicked");
    setLocation("/");
  };
  
  return (
    <div className="min-h-screen">
      <Navbar variant="dashboard" onSignOut={handleSignOut} />
      <ClinicDashboard />
    </div>
  );
}
