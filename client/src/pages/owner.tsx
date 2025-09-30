import Navbar from "@/components/navbar";
import OwnerDashboard from "@/components/owner-dashboard";
import { useLocation } from "wouter";

export default function OwnerPage() {
  const [, setLocation] = useLocation();
  
  const handleSignOut = () => {
    console.log("Sign out clicked");
    setLocation("/");
  };
  
  return (
    <div className="min-h-screen">
      <Navbar variant="dashboard" onSignOut={handleSignOut} />
      <OwnerDashboard />
    </div>
  );
}
