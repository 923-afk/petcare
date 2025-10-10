import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  weight: number;
  color: string;
  medicalNotes: string;
  photoUrl?: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface Appointment {
  id: string;
  petId: string;
  clinicId: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "in-progress";
  reason: string;
  cost?: number;
}

interface AppointmentCardProps {
  appointment: Appointment;
  pet?: Pet;
  clinic?: Clinic;
  showActions?: boolean;
  userType?: 'owner' | 'clinic';
  onStatusChange?: (appointmentId: string, status: string) => void;
}

export default function AppointmentCard({
  appointment,
  pet,
  clinic,
  showActions = true,
  userType = 'owner',
  onStatusChange,
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-secondary/10 text-secondary';
      case 'pending': return 'bg-accent/10 text-accent';
      case 'in-progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'checkup':
      case 'general checkup': return '🩺';
      case 'vaccination': return '💉';
      case 'dental': return '🦷';
      case 'surgery': return '🏥';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return timeString;
    } catch {
      return timeString;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all" data-testid={`appointment-card-${appointment.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getServiceIcon(appointment.serviceType)}</div>
            <div>
              <div className="font-semibold" data-testid={`appointment-service-${appointment.id}`}>
                {appointment.serviceType}
              </div>
              <div className="text-sm text-muted-foreground">
                {userType === 'owner' ? clinic?.name : pet?.name}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              className={getStatusColor(appointment.status)}
              data-testid={`appointment-status-${appointment.id}`}
            >
              {appointment.status}
            </Badge>
            {showActions && onStatusChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(appointment.id, 'confirmed')}
                    disabled={appointment.status === 'confirmed'}
                  >
                    Confirm
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(appointment.id, 'in-progress')}
                    disabled={appointment.status === 'in-progress'}
                  >
                    Start
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(appointment.id, 'completed')}
                    disabled={appointment.status === 'completed'}
                  >
                    Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(appointment.id, 'cancelled')}
                    disabled={appointment.status === 'cancelled'}
                    className="text-destructive"
                  >
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(appointment.appointmentDate)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {formatTime(appointment.appointmentTime)}
          </div>
          {clinic?.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {clinic.address}
            </div>
          )}
          {appointment.reason && (
            <div className="text-sm text-muted-foreground">
              <strong>Reason:</strong> {appointment.reason}
            </div>
          )}
          {appointment.cost && (
            <div className="text-sm font-medium">
              <strong>Cost:</strong> ${appointment.cost}
            </div>
          )}
        </div>

        {userType === 'clinic' && pet && (
          <div className="border-t pt-3">
            <div className="text-sm">
              <strong>Pet Details:</strong> {pet.name} ({pet.breed})
            </div>
          </div>
        )}

        {userType === 'owner' && clinic && (
          <div className="border-t pt-3">
            <div className="text-sm">
              <strong>Clinic:</strong> {clinic.name}
            </div>
            {clinic.phone && (
              <div className="text-sm text-muted-foreground">
                <strong>Phone:</strong> {clinic.phone}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}