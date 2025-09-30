import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PetCard from "./pet-card";
import AppointmentCard from "./appointment-card";

//todo: remove mock functionality
const mockPets = [
  {
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    imageUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: "2 years",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: "5 years",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop",
  },
];

//todo: remove mock functionality
const mockAppointments = [
  {
    petName: "Max",
    petImageUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=400&auto=format&fit=crop",
    clinicName: "Sunshine Veterinary Clinic",
    date: "Dec 15, 2024",
    time: "2:00 PM",
    status: "confirmed" as const,
    notes: "Annual checkup and vaccination",
  },
  {
    petName: "Luna",
    petImageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=400&auto=format&fit=crop",
    clinicName: "City Pet Hospital",
    date: "Dec 18, 2024",
    time: "10:30 AM",
    status: "pending" as const,
    notes: "Dental cleaning appointment",
  },
];

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground text-lg">
            {mockPets.length} pets • {mockAppointments.length} upcoming appointments
          </p>
        </div>
        
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-semibold">Your Pets</h2>
            <Button data-testid="button-add-pet">
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPets.map((pet, index) => (
              <PetCard
                key={index}
                {...pet}
                onBookAppointment={() => console.log(`Book appointment for ${pet.name}`)}
                onViewRecords={() => console.log(`View records for ${pet.name}`)}
              />
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-semibold">Upcoming Appointments</h2>
            <Button variant="outline" data-testid="button-view-all">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockAppointments.map((appointment, index) => (
              <AppointmentCard
                key={index}
                {...appointment}
                onStatusChange={(status) => console.log(`Status changed to ${status}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
