import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import { Link } from "wouter";

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  services?: string[];
}

export default function ClinicsPage() {
  const { data: clinics = [], isLoading } = useQuery<Clinic[]>({
    queryKey: ['/api/clinics'],
    queryFn: async () => {
      const response = await fetch('/api/clinics');
      if (!response.ok) throw new Error('Failed to fetch clinics');
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Veterinary Clinics</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover trusted veterinary clinics near you. Book appointments and manage your pet's health with ease.
        </p>
      </div>

      {/* Clinics Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clinics.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No clinics available at the moment.</p>
            <Link href="/register">
              <Button>Register Your Clinic</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{clinic.name}</span>
                  <Badge variant="outline" className="ml-2">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    4.8
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{clinic.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{clinic.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{clinic.email}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Mon-Fri: 9AM-6PM</span>
                  </div>
                </div>

                {clinic.services && clinic.services.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {clinic.services.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Book Appointment</Button>
                  </Link>
                  <Link href={`/clinics/${clinic.id}`}>
                    <Button variant="outline">Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-12">
            <h2 className="text-2xl font-bold mb-4">Are you a veterinary clinic?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our platform and connect with pet owners. Manage appointments, patient records, and grow your practice.
            </p>
            <Link href="/register">
              <Button size="lg">Register Your Clinic</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
