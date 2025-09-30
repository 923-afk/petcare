import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, PawPrint, Plus } from "lucide-react";
import { Link } from "wouter";

export default function OwnerDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="dashboard-title">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="opacity-90" data-testid="dashboard-subtitle">
                Manage your pets and appointments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/booking">
                <Button variant="secondary" data-testid="book-appointment-cta">
                  <Plus className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PawPrint className="mr-2 h-5 w-5 text-primary" />
              My Pets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <PawPrint className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No pets added yet</p>
              <Link href="/pets">
                <Button data-testid="add-first-pet">Add Your First Pet</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-secondary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No upcoming appointments</p>
              <Link href="/booking">
                <Button data-testid="book-first-appointment">Book Your First Appointment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
