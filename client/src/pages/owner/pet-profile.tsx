import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PetProfile() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pet Profile</h1>
        <p className="text-muted-foreground">View and manage pet details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading pet profile...</p>
        </CardContent>
      </Card>
    </div>
  );
}
