import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface AppointmentCardProps {
  petName: string;
  petImageUrl?: string;
  clinicName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  onStatusChange?: (status: AppointmentStatus) => void;
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

export default function AppointmentCard({
  petName,
  petImageUrl,
  clinicName,
  date,
  time,
  status,
  notes,
  onStatusChange,
}: AppointmentCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid={`card-appointment-${petName.toLowerCase()}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={petImageUrl} alt={petName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {petName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-semibold text-lg" data-testid="text-pet-name">{petName}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {clinicName}
              </p>
            </div>
            <Badge className={statusConfig[status].className} data-testid="badge-status">
              {statusConfig[status].label}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span data-testid="text-date">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span data-testid="text-time">{time}</span>
            </div>
          </div>
          
          {notes && (
            <p className="text-sm text-muted-foreground mb-4">{notes}</p>
          )}
          
          {status === "pending" && onStatusChange && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onStatusChange("confirmed")}
                data-testid="button-confirm"
              >
                Confirm
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onStatusChange("cancelled")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
