import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPetSchema, type Pet, type InsertPet } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Plus } from "lucide-react";
import { Link } from "wouter";

export default function OwnerPets() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: pets, isLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  const form = useForm<InsertPet>({
    resolver: zodResolver(insertPetSchema),
    defaultValues: {
      ownerId: user?.id || "",
      name: "",
      species: "",
      breed: undefined,
      gender: undefined,
      color: undefined,
      weight: undefined,
      birthDate: undefined,
      photoUrl: undefined,
      microchipId: undefined,
      medicalNotes: undefined,
    },
  });

  const addPetMutation = useMutation({
    mutationFn: async (data: InsertPet) => {
      return apiRequest<Pet>("POST", "/api/pets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Success!",
        description: "Pet added successfully.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add pet.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPet) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add a pet.",
        variant: "destructive",
      });
      return;
    }
    addPetMutation.mutate({ ...data, ownerId: user.id });
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="page-title">My Pets</h1>
          <p className="text-muted-foreground">Manage your pet profiles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-pet">
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Pet</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Max, Luna"
                    {...form.register("name")}
                    data-testid="input-pet-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <Input
                    id="species"
                    placeholder="e.g., Dog, Cat"
                    {...form.register("species")}
                    data-testid="input-species"
                  />
                  {form.formState.errors.species && (
                    <p className="text-sm text-destructive">{form.formState.errors.species.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    placeholder="e.g., Golden Retriever"
                    {...form.register("breed")}
                    data-testid="input-breed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => form.setValue("gender", value)}>
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" data-testid="option-male">Male</SelectItem>
                      <SelectItem value="female" data-testid="option-female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...form.register("birthDate")}
                    data-testid="input-birth-date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Brown, White"
                    {...form.register("color")}
                    data-testid="input-color"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 25.5"
                    {...form.register("weight")}
                    data-testid="input-weight"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="microchipId">Microchip ID</Label>
                  <Input
                    id="microchipId"
                    placeholder="e.g., 123456789"
                    {...form.register("microchipId")}
                    data-testid="input-microchip"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalNotes">Medical Notes</Label>
                <Input
                  id="medicalNotes"
                  placeholder="Any important medical information"
                  {...form.register("medicalNotes")}
                  data-testid="input-medical-notes"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addPetMutation.isPending}
                  data-testid="button-submit-pet"
                >
                  {addPetMutation.isPending ? "Adding..." : "Add Pet"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pets && pets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className="overflow-hidden hover-elevate transition-all duration-200"
              data-testid={`card-pet-${pet.id}`}
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PawPrint className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1" data-testid={`text-pet-name-${pet.id}`}>
                      {pet.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-pet-breed-${pet.id}`}>
                      {pet.breed || pet.species}
                    </p>
                  </div>
                  <Badge variant="secondary" data-testid={`badge-age-${pet.id}`}>
                    {calculateAge(pet.birthDate)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Species:</span>
                    <span data-testid={`text-species-${pet.id}`}>{pet.species}</span>
                  </div>
                  {pet.gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gender:</span>
                      <span data-testid={`text-gender-${pet.id}`}>{pet.gender}</span>
                    </div>
                  )}
                  {pet.weight && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span data-testid={`text-weight-${pet.id}`}>{pet.weight} kg</span>
                    </div>
                  )}
                </div>

                <Link href={`/pet-profile/${pet.id}`}>
                  <Button className="w-full" variant="outline" data-testid={`button-view-details-${pet.id}`}>
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <PawPrint className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4" data-testid="text-no-pets">No pets added yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-pet">
              Add Your First Pet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
