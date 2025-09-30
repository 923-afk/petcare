import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Appointment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, PawPrint } from "lucide-react";
import { format } from "date-fns";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface AppointmentWithDetails extends Appointment {
  petName?: string;
  ownerName?: string;
}

export default function ClinicAppointments() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment status updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment status.",
        variant: "destructive",
      });
    },
  });

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (selectedTab === "all") return appointments;
    return appointments.filter((apt) => apt.status === selectedTab);
  }, [appointments, selectedTab]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const statusCounts = useMemo(() => {
    if (!appointments) return { all: 0, pending: 0, confirmed: 0, completed: 0 };
    return {
      all: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    };
  }, [appointments]);

  const AppointmentCard = ({ appointment }: { appointment: AppointmentWithDetails }) => (
    <Card key={appointment.id} className="hover-elevate transition-all" data-testid={`card-appointment-${appointment.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1" data-testid={`text-appointment-type-${appointment.id}`}>
                  {appointment.serviceType.charAt(0).toUpperCase() + appointment.serviceType.slice(1)}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span data-testid={`text-appointment-date-${appointment.id}`}>
                    {format(new Date(appointment.appointmentDate), "PPpp")}
                  </span>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(appointment.status)} data-testid={`badge-status-${appointment.id}`}>
                {appointment.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <PawPrint className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Pet:</span>
                <span className="font-medium" data-testid={`text-pet-name-${appointment.id}`}>
                  {appointment.petName || "Unknown"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium" data-testid={`text-owner-name-${appointment.id}`}>
                  {appointment.ownerName || "Unknown"}
                </span>
              </div>

              {appointment.doctorName && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{appointment.doctorName}</span>
                </div>
              )}

              {appointment.reason && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Reason:</p>
                  <p className="text-sm mt-1" data-testid={`text-reason-${appointment.id}`}>{appointment.reason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-48">
            <label className="text-sm font-medium mb-2 block">Update Status</label>
            <Select
              value={appointment.status}
              onValueChange={(value) => updateStatusMutation.mutate({ id: appointment.id, status: value })}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger data-testid={`select-status-${appointment.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" data-testid={`option-status-pending-${appointment.id}`}>Pending</SelectItem>
                <SelectItem value="confirmed" data-testid={`option-status-confirmed-${appointment.id}`}>Confirmed</SelectItem>
                <SelectItem value="completed" data-testid={`option-status-completed-${appointment.id}`}>Completed</SelectItem>
                <SelectItem value="cancelled" data-testid={`option-status-cancelled-${appointment.id}`}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Appointments</h1>
        <p className="text-muted-foreground">Manage clinic appointments</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList data-testid="tabs-status-filter">
          <TabsTrigger value="all" data-testid="tab-all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="confirmed" data-testid="tab-confirmed">
            Confirmed ({statusCounts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed ({statusCounts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground" data-testid="text-no-appointments">
                  {selectedTab === "all" ? "No appointments scheduled" : `No ${selectedTab} appointments`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
