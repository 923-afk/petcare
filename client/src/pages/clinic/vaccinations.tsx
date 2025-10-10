import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Syringe, Plus, Search, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface VaccinationRecord {
  id: string;
  petId: string;
  petName: string;
  ownerName: string;
  vaccineName: string;
  lastGiven: string;
  nextDue: string;
  status: "upcoming" | "due" | "overdue" | "completed";
  notes: string;
}

export default function VaccinationsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock vaccination data
  const mockVaccinations: VaccinationRecord[] = [
    {
      id: "1",
      petId: "pet1",
      petName: "Buddy",
      ownerName: "John Smith",
      vaccineName: "Rabies",
      lastGiven: "2024-01-15",
      nextDue: "2025-01-15",
      status: "upcoming",
      notes: "Annual booster",
    },
    {
      id: "2",
      petId: "pet2",
      petName: "Luna",
      ownerName: "Sarah Johnson",
      vaccineName: "DHPP",
      lastGiven: "2024-10-01",
      nextDue: "2024-11-01",
      status: "overdue",
      notes: "Puppy series completion",
    },
    {
      id: "3",
      petId: "pet3",
      petName: "Max",
      ownerName: "Mike Davis",
      vaccineName: "Bordetella",
      lastGiven: "2024-08-20",
      nextDue: "2024-11-20",
      status: "due",
      notes: "Before boarding",
    },
    {
      id: "4",
      petId: "pet1",
      petName: "Buddy",
      ownerName: "John Smith",
      vaccineName: "Leptospirosis",
      lastGiven: "2024-09-10",
      nextDue: "2025-09-10",
      status: "upcoming",
      notes: "Annual",
    },
  ];

  const vaccinations = mockVaccinations.filter(record => {
    const matchesSearch = 
      record.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vaccineName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || record.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const upcomingCount = mockVaccinations.filter(v => v.status === "upcoming").length;
  const dueCount = mockVaccinations.filter(v => v.status === "due").length;
  const overdueCount = mockVaccinations.filter(v => v.status === "overdue").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case "due":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Due</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleScheduleVaccination = () => {
    toast({
      title: "Vaccination Scheduled",
      description: "Vaccination reminder has been set successfully.",
    });
    setIsScheduleDialogOpen(false);
  };

  const handleMarkComplete = (id: string) => {
    toast({
      title: "Vaccination Completed",
      description: "Vaccination record has been updated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vaccination Schedule</h1>
            <p className="text-muted-foreground">
              Track and manage pet vaccinations
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Vaccination
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Vaccination</DialogTitle>
                  <DialogDescription>
                    Add a new vaccination record
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pet">Pet Name</Label>
                    <Input id="pet" placeholder="Select or enter pet name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vaccine">Vaccine Type</Label>
                    <Input id="vaccine" placeholder="e.g., Rabies, DHPP" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastGiven">Last Given Date</Label>
                    <Input id="lastGiven" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nextDue">Next Due Date</Label>
                    <Input id="nextDue" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" placeholder="Additional notes" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleVaccination}>Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{mockVaccinations.length}</p>
              </div>
              <Syringe className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{dueCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "overdue" ? "destructive" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("overdue")}
              >
                Overdue
              </Button>
              <Button
                variant={filterStatus === "due" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("due")}
              >
                Due
              </Button>
              <Button
                variant={filterStatus === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("upcoming")}
              >
                Upcoming
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pet, owner, or vaccine..."
                className="pl-9 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Records */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccination Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vaccinations.length > 0 ? (
              vaccinations.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{record.petName}</h3>
                        {getStatusBadge(record.status)}
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Owner:</span> {record.ownerName}
                        </div>
                        <div>
                          <span className="font-medium">Vaccine:</span> {record.vaccineName}
                        </div>
                        <div>
                          <span className="font-medium">Last Given:</span>{" "}
                          {format(new Date(record.lastGiven), "MMM d, yyyy")}
                        </div>
                        <div>
                          <span className="font-medium">Next Due:</span>{" "}
                          {format(new Date(record.nextDue), "MMM d, yyyy")}
                        </div>
                        {record.notes && (
                          <div className="col-span-2">
                            <span className="font-medium">Notes:</span> {record.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkComplete(record.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Complete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Syringe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No vaccination records found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
