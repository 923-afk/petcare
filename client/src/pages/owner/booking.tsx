import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type Pet, type Clinic, type Appointment, type InsertAppointment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, CheckCircle } from "lucide-react";
import { z } from "zod";

const bookingFormSchema = insertAppointmentSchema.extend({
  appointmentDate: z.string().min(1, "Appointment date is required"),
}).omit({ ownerId: true });

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function OwnerBooking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: pets, isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  const { data: clinics, isLoading: clinicsLoading } = useQuery<Clinic[]>({
    queryKey: ["/api/clinics"],
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      petId: "",
      clinicId: "",
      serviceType: "",
      appointmentDate: "",
      reason: "",
      status: "pending",
      doctorName: "",
      notes: "",
    },
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      // ownerId 會在 API 層自動設置
      return apiRequest<Appointment>("POST", "/api/appointments", {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success!",
        description: "Appointment booked successfully.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookAppointmentMutation.mutate(data);
  };

  const isLoading = petsLoading || clinicsLoading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Book Appointment</h1>
        <p className="text-muted-foreground">Schedule a visit for your pet</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule an Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : !pets || pets.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4" data-testid="text-no-pets">
                You need to add a pet before booking an appointment
              </p>
              <Button onClick={() => setLocation("/pets")} data-testid="button-add-pet-first">
                Add a Pet
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="petId">Select Pet *</Label>
                <Select onValueChange={(value) => form.setValue("petId", value)}>
                  <SelectTrigger data-testid="select-pet">
                    <SelectValue placeholder="Choose your pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets?.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id} data-testid={`option-pet-${pet.id}`}>
                        {pet.name} ({pet.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.petId && (
                  <p className="text-sm text-destructive">{form.formState.errors.petId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicId">Select Clinic *</Label>
                <Select onValueChange={(value) => form.setValue("clinicId", value)}>
                  <SelectTrigger data-testid="select-clinic">
                    <SelectValue placeholder="Choose a clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics?.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id} data-testid={`option-clinic-${clinic.id}`}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.clinicId && (
                  <p className="text-sm text-destructive">{form.formState.errors.clinicId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Appointment Type *</Label>
                <Select onValueChange={(value) => form.setValue("serviceType", value)}>
                  <SelectTrigger data-testid="select-appointment-type">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup" data-testid="option-checkup">Checkup</SelectItem>
                    <SelectItem value="vaccination" data-testid="option-vaccination">Vaccination</SelectItem>
                    <SelectItem value="surgery" data-testid="option-surgery">Surgery</SelectItem>
                    <SelectItem value="emergency" data-testid="option-emergency">Emergency</SelectItem>
                    <SelectItem value="consultation" data-testid="option-consultation">Consultation</SelectItem>
                    <SelectItem value="dental" data-testid="option-dental">Dental</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.serviceType && (
                  <p className="text-sm text-destructive">{form.formState.errors.serviceType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Appointment Date & Time *</Label>
                <Input
                  id="appointmentDate"
                  type="datetime-local"
                  {...form.register("appointmentDate")}
                  data-testid="input-appointment-date"
                />
                {form.formState.errors.appointmentDate && (
                  <p className="text-sm text-destructive">{form.formState.errors.appointmentDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  placeholder="Please describe the reason for your visit..."
                  rows={4}
                  {...form.register("reason")}
                  data-testid="input-reason"
                />
                {form.formState.errors.reason && (
                  <p className="text-sm text-destructive">{form.formState.errors.reason.message}</p>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={bookAppointmentMutation.isPending}
                  data-testid="button-submit-booking"
                >
                  {bookAppointmentMutation.isPending ? (
                    "Booking..."
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Book Appointment
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
