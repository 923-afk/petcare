import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMedicalRecordSchema, type Pet, type MedicalRecord, type Vaccination, type InsertMedicalRecord, type Clinic } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, Plus, FileText, Syringe, Calendar } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

const medicalRecordFormSchema = insertMedicalRecordSchema.extend({
  recordDate: z.string().optional(),
  title: z.string().min(1, "Title is required"),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordFormSchema>;

export default function ClinicPatients() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: pets, isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  const { data: medicalRecords, isLoading: recordsLoading } = useQuery<MedicalRecord[]>({
    queryKey: ["/api/pets", selectedPet?.id, "medical-records"],
    enabled: !!selectedPet?.id,
  });

  const { data: vaccinations, isLoading: vaccinationsLoading } = useQuery<Vaccination[]>({
    queryKey: ["/api/pets", selectedPet?.id, "vaccinations"],
    enabled: !!selectedPet?.id,
  });

  const { data: clinicData } = useQuery<Clinic>({
    queryKey: ["/api/clinics/my"],
    enabled: user?.userType === "clinic",
  });

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordFormSchema),
    defaultValues: {
      petId: "",
      clinicId: "",
      recordType: "",
      title: "",
      description: "",
      diagnosis: "",
      treatment: "",
      medications: [],
      notes: "",
      recordDate: new Date().toISOString().split("T")[0],
    },
  });

  const addMedicalRecordMutation = useMutation({
    mutationFn: async (data: MedicalRecordFormData) => {
      return apiRequest<MedicalRecord>("POST", "/api/medical-records", {
        ...data,
        recordDate: data.recordDate ? new Date(data.recordDate).toISOString() : new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", selectedPet?.id, "medical-records"] });
      toast({
        title: "Success!",
        description: "Medical record added successfully.",
      });
      setIsAddRecordDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add medical record.",
        variant: "destructive",
      });
    },
  });

  const handleOpenPatientDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  const handleAddRecord = () => {
    if (selectedPet && clinicData) {
      form.setValue("petId", selectedPet.id);
      form.setValue("clinicId", clinicData.id);
      setIsAddRecordDialogOpen(true);
    }
  };

  const onSubmit = (data: MedicalRecordFormData) => {
    addMedicalRecordMutation.mutate(data);
  };

  const calculateAge = (birthDate: Date | string | null | undefined) => {
    if (!birthDate) return "Unknown age";
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months} months`;
    } else if (months < 0) {
      return `${years - 1} years`;
    }
    return `${years} years`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Patients</h1>
        <p className="text-muted-foreground">Manage patient records</p>
      </div>

      {petsLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pets && pets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className="hover-elevate transition-all cursor-pointer"
              onClick={() => handleOpenPatientDetails(pet)}
              data-testid={`card-patient-${pet.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <PawPrint className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1" data-testid={`text-patient-name-${pet.id}`}>
                      {pet.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-patient-breed-${pet.id}`}>
                      {pet.breed || pet.species}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Species:</span>
                    <span data-testid={`text-patient-species-${pet.id}`}>{pet.species}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Age:</span>
                    <Badge variant="secondary" data-testid={`badge-patient-age-${pet.id}`}>
                      {calculateAge(pet.birthDate)}
                    </Badge>
                  </div>
                  {pet.weight && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span>{pet.weight} kg</span>
                    </div>
                  )}
                </div>

                <Button className="w-full mt-4" variant="outline" data-testid={`button-view-patient-${pet.id}`}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <PawPrint className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground" data-testid="text-no-patients">No patients registered</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              {selectedPet?.name}'s Medical Records
            </DialogTitle>
          </DialogHeader>

          {selectedPet && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Species</p>
                    <p className="font-medium">{selectedPet.species}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Breed</p>
                    <p className="font-medium">{selectedPet.breed || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{calculateAge(selectedPet.birthDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{selectedPet.weight ? `${selectedPet.weight} kg` : "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Medical History</h3>
                <Dialog open={isAddRecordDialogOpen} onOpenChange={setIsAddRecordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddRecord} data-testid="button-add-medical-record">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Medical Record</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recordType">Record Type *</Label>
                        <Select onValueChange={(value) => form.setValue("recordType", value)}>
                          <SelectTrigger data-testid="select-record-type">
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="examination" data-testid="option-examination">Examination</SelectItem>
                            <SelectItem value="diagnosis" data-testid="option-diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="treatment" data-testid="option-treatment">Treatment</SelectItem>
                            <SelectItem value="lab-result" data-testid="option-lab-result">Lab Result</SelectItem>
                            <SelectItem value="note" data-testid="option-note">Note</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.recordType && (
                          <p className="text-sm text-destructive">{form.formState.errors.recordType.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Annual Checkup"
                          {...form.register("title")}
                          data-testid="input-title"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Textarea
                          id="diagnosis"
                          placeholder="Enter diagnosis..."
                          {...form.register("diagnosis")}
                          data-testid="input-diagnosis"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="treatment">Treatment</Label>
                        <Textarea
                          id="treatment"
                          placeholder="Enter treatment plan..."
                          {...form.register("treatment")}
                          data-testid="input-treatment"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Additional notes..."
                          {...form.register("notes")}
                          data-testid="input-notes"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recordDate">Record Date</Label>
                        <Input
                          id="recordDate"
                          type="date"
                          {...form.register("recordDate")}
                          data-testid="input-record-date"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddRecordDialogOpen(false)}
                          data-testid="button-cancel-record"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addMedicalRecordMutation.isPending}
                          data-testid="button-submit-record"
                        >
                          {addMedicalRecordMutation.isPending ? "Adding..." : "Add Record"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="records" className="w-full">
                <TabsList className="grid w-full grid-cols-2" data-testid="tabs-patient-details">
                  <TabsTrigger value="records" data-testid="tab-records">
                    <FileText className="mr-2 h-4 w-4" />
                    Medical Records
                  </TabsTrigger>
                  <TabsTrigger value="vaccinations" data-testid="tab-vaccinations">
                    <Syringe className="mr-2 h-4 w-4" />
                    Vaccinations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="records" className="space-y-4 mt-4">
                  {recordsLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : medicalRecords && medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                      <Card key={record.id} data-testid={`card-record-${record.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold" data-testid={`text-record-title-${record.id}`}>
                                {record.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {record.recordDate && format(new Date(record.recordDate), "PPP")}
                              </p>
                            </div>
                            <Badge variant="outline">{record.recordType}</Badge>
                          </div>
                          {record.diagnosis && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                            </p>
                          )}
                          {record.treatment && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Treatment:</span> {record.treatment}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground" data-testid="text-no-records">No medical records found</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="vaccinations" className="space-y-4 mt-4">
                  {vaccinationsLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : vaccinations && vaccinations.length > 0 ? (
                    vaccinations.map((vaccination) => (
                      <Card key={vaccination.id} data-testid={`card-vaccination-${vaccination.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{vaccination.vaccineName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Given: {format(new Date(vaccination.dateGiven), "PPP")}
                              </p>
                            </div>
                            {vaccination.nextDueDate && (
                              <Badge variant="secondary">
                                Next: {format(new Date(vaccination.nextDueDate), "PP")}
                              </Badge>
                            )}
                          </div>
                          {vaccination.veterinarian && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Veterinarian:</span> {vaccination.veterinarian}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Syringe className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground" data-testid="text-no-vaccinations">No vaccinations found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
