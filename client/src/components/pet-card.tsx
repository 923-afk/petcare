import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Calendar, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PetCardProps {
  name: string;
  species: string;
  breed: string;
  age: string;
  imageUrl?: string;
  onBookAppointment?: () => void;
  onViewRecords?: () => void;
}

export default function PetCard({
  name,
  species,
  breed,
  age,
  imageUrl,
  onBookAppointment,
  onViewRecords,
}: PetCardProps) {
  const initials = name.substring(0, 2).toUpperCase();
  
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-pet-${name.toLowerCase()}`}>
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">{species === 'Dog' ? '🐕' : species === 'Cat' ? '🐈' : '🐾'}</div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" data-testid={`button-menu-${name.toLowerCase()}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="menu-edit">Edit Profile</DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-delete" className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-1" data-testid={`text-pet-name-${name.toLowerCase()}`}>{name}</h3>
            <p className="text-sm text-muted-foreground">{breed}</p>
          </div>
          <Badge variant="secondary" data-testid={`badge-age-${name.toLowerCase()}`}>{age}</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={onBookAppointment}
            data-testid={`button-book-${name.toLowerCase()}`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onViewRecords}
            data-testid={`button-records-${name.toLowerCase()}`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Records
          </Button>
        </div>
      </div>
    </Card>
  );
}
