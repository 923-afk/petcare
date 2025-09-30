import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

export default function OwnerPets() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Pets</h1>
        <p className="text-muted-foreground">Manage your pet profiles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Pets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <PawPrint className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No pets added yet</p>
            <Button>Add Your First Pet</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
