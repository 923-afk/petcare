import { useState } from 'react';
import AppointmentCard from '../appointment-card';

export default function AppointmentCardExample() {
  const [status, setStatus] = useState<"pending" | "confirmed" | "completed" | "cancelled">("pending");
  
  return (
    <div className="p-6 max-w-2xl">
      <AppointmentCard
        petName="Max"
        petImageUrl="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=400&auto=format&fit=crop"
        clinicName="Sunshine Veterinary Clinic"
        date="Dec 15, 2024"
        time="2:00 PM"
        status={status}
        notes="Annual checkup and vaccination"
        onStatusChange={(newStatus) => {
          console.log('Status changed to:', newStatus);
          setStatus(newStatus);
        }}
      />
    </div>
  );
}
