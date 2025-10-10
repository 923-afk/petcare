import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

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

interface PetCardProps {
  pet: Pet;
  showActions?: boolean;
}

export default function PetCard({ pet, showActions = true }: PetCardProps) {
  const getAge = (birthDate: Date | string | null) => {
    if (!birthDate) return "Unknown age";
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInYears = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return `${ageInYears} years old`;
  };

  const getSpeciesEmoji = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'rabbit': return '🐰';
      case 'bird': return '🐦';
      default: return '🐾';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all" data-testid={`pet-card-${pet.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-12 h-12 rounded-full object-cover"
              data-testid={`pet-photo-${pet.id}`}
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
              {getSpeciesEmoji(pet.species)}
            </div>
          )}
          <div>
            <div className="font-semibold" data-testid={`pet-name-${pet.id}`}>
              {pet.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {pet.breed} • {getAge(pet.birthDate)}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Species:</span>
            <Badge variant="outline" className="capitalize">{pet.species}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gender:</span>
            <span className="capitalize">{pet.gender}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weight:</span>
            <span>{pet.weight} lbs</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Color:</span>
            <span className="capitalize">{pet.color}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <Link href={`/pets/${pet.id}`}>
              <Button size="sm" className="flex-1">
                View Details
              </Button>
            </Link>
            <Link href={`/booking?petId=${pet.id}`}>
              <Button size="sm" variant="outline" className="flex-1">
                <Calendar className="mr-1 h-3 w-3" />
                Book
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}