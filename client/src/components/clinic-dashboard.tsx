import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users, CheckCircle, Clock } from "lucide-react";
import AppointmentCard from "./appointment-card";
import { useState } from "react";

//todo: remove mock functionality
const mockStats = [
  { label: "Today's Appointments", value: "12", icon: Calendar, color: "text-blue-600" },
  { label: "Total Patients", value: "248", icon: Users, color: "text-green-600" },
  { label: "Completed", value: "8", icon: CheckCircle, color: "text-purple-600" },
  { label: "Pending", value: "4", icon: Clock, color: "text-amber-600" },
];

//todo: remove mock functionality
const mockAppointments = [
  {
    petName: "Max",
    petImageUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=400&auto=format&fit=crop",
    clinicName: "Owner: John Smith",
    date: "Today",
    time: "2:00 PM",
    status: "pending" as const,
    notes: "Annual checkup and vaccination",
  },
  {
    petName: "Bella",
    petImageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop",
    clinicName: "Owner: Sarah Johnson",
    date: "Today",
    time: "3:30 PM",
    status: "confirmed" as const,
    notes: "Follow-up for skin condition",
  },
  {
    petName: "Rocky",
    petImageUrl: "https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?q=80&w=400&auto=format&fit=crop",
    clinicName: "Owner: Mike Davis",
    date: "Today",
    time: "4:45 PM",
    status: "pending" as const,
    notes: "Dental cleaning",
  },
];

export default function ClinicDashboard() {
  const [appointments, setAppointments] = useState(mockAppointments);
  
  const handleStatusChange = (index: number, newStatus: any) => {
    const updated = [...appointments];
    updated[index] = { ...updated[index], status: newStatus };
    setAppointments(updated);
    console.log(`Appointment ${index} status changed to ${newStatus}`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">Clinic Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage appointments and patient records
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6" data-testid={`card-stat-${index}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patients..." 
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-semibold">Today's Appointments</h2>
            <Button data-testid="button-add-record">
              Add Medical Record
            </Button>
          </div>
          
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <AppointmentCard
                key={index}
                {...appointment}
                onStatusChange={(status) => handleStatusChange(index, status)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
