import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Search, Package, AlertTriangle, TrendingDown, Edit, Trash2, Scan, Camera } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Medicine {
  id: string;
  name: string;
  dosage?: string;
  form?: string;
  species?: string;
  indication?: string;
  manufacturer?: string;
  barcode: string;
}

interface InventoryItem {
  id: string;
  medicineId?: string;
  medicine?: Medicine;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  supplier: string;
  cost: number;
  barcode?: string;
}

export default function InventoryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBarcodeDialogOpen, setIsBarcodeDialogOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [scannedMedicine, setScannedMedicine] = useState<Medicine | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state for adding inventory item
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "tablets",
    reorderLevel: "",
    expiryDate: "",
    supplier: "",
    cost: "",
    barcode: "",
  });

  // Mock data - in production this would come from API
  const mockInventory: InventoryItem[] = [
    {
      id: "1",
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      quantity: 150,
      unit: "tablets",
      reorderLevel: 50,
      expiryDate: "2025-06-30",
      supplier: "VetMed Supply Co",
      cost: 0.50,
      barcode: "1234567890123",
    },
    {
      id: "2",
      name: "Rabies Vaccine",
      category: "Vaccines",
      quantity: 25,
      unit: "doses",
      reorderLevel: 20,
      expiryDate: "2025-03-15",
      supplier: "PetVax Inc",
      cost: 15.00,
      barcode: "9876543210987",
    },
    {
      id: "3",
      name: "Surgical Gloves (Box)",
      category: "Supplies",
      quantity: 8,
      unit: "boxes",
      reorderLevel: 10,
      expiryDate: "2026-12-31",
      supplier: "MedSupply Direct",
      cost: 25.00,
    },
    {
      id: "4",
      name: "Flea Treatment",
      category: "Medications",
      quantity: 45,
      unit: "tubes",
      reorderLevel: 30,
      expiryDate: "2025-09-20",
      supplier: "VetMed Supply Co",
      cost: 8.50,
      barcode: "5555555555555",
    },
  ];

  const inventory = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.barcode && item.barcode.includes(searchQuery))
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const categories = [...new Set(inventory.map(item => item.category))];

  // Lookup medicine by barcode
  const lookupMedicineByBarcode = async (barcode: string) => {
    if (!barcode.trim()) {
      toast({
        title: "Invalid Barcode",
        description: "Please enter a valid barcode",
        variant: "destructive",
      });
      return;
    }

    setIsScanningBarcode(true);
    try {
      // Query medicines table via API
      const medicine = await apiRequest<Medicine>(
        "GET",
        `/api/medicines?barcode=${encodeURIComponent(barcode.trim())}`
      );
      
      if (medicine) {
        setScannedMedicine(medicine);
        // Pre-fill form with medicine data
        setFormData(prev => ({
          ...prev,
          name: medicine.name || "",
          category: medicine.indication || "",
          manufacturer: medicine.manufacturer || "",
          barcode: medicine.barcode || barcode.trim(),
        }));
        toast({
          title: "Medicine Found",
          description: `Found: ${medicine.name}`,
        });
      }
    } catch (error: any) {
      // 404 means medicine not found (not an error)
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        toast({
          title: "Medicine Not Found",
          description: "This medicine is not in the database. You can add it manually.",
          variant: "default",
        });
        setScannedMedicine(null);
        // Pre-fill barcode in form
        setFormData(prev => ({
          ...prev,
          barcode: barcode.trim(),
        }));
      } else {
        console.error("Barcode lookup error:", error);
        toast({
          title: "Lookup Failed",
          description: error.message || "Failed to lookup medicine. Please try again or add manually.",
          variant: "destructive",
        });
      }
    } finally {
      setIsScanningBarcode(false);
    }
  };

  // Handle barcode input (manual entry or scan)
  const handleBarcodeSubmit = () => {
    if (barcodeInput.trim()) {
      lookupMedicineByBarcode(barcodeInput.trim());
    }
  };

  // Open camera for barcode scanning (if available)
  const handleOpenCameraScanner = () => {
    // For web, we can use the browser's camera API
    // For mobile, this would use the mobile barcode scanner
    toast({
      title: "Camera Scanner",
      description: "For barcode scanning, please use the mobile app or enter barcode manually.",
    });
    // In a real implementation, you would:
    // 1. Request camera permission
    // 2. Open camera stream
    // 3. Use a barcode scanning library (like ZXing or QuaggaJS)
  };

  const handleAddItem = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Item Added",
      description: "Inventory item has been added successfully.",
    });
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "tablets",
      reorderLevel: "",
      expiryDate: "",
      supplier: "",
      cost: "",
      barcode: "",
    });
    setScannedMedicine(null);
    setIsAddDialogOpen(false);
  };

  const handleUpdateItem = () => {
    toast({
      title: "Item Updated",
      description: "Inventory item has been updated successfully.",
    });
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    toast({
      title: "Item Deleted",
      description: "Inventory item has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track medicines, vaccines, and supplies with barcode scanning
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {/* Barcode Scanner Button */}
            <Dialog open={isBarcodeDialogOpen} onOpenChange={setIsBarcodeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Scan className="mr-2 h-4 w-4" />
                  Scan Barcode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan or Enter Barcode</DialogTitle>
                  <DialogDescription>
                    Scan a medicine barcode to quickly add it to inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode (EAN/UPC)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="barcode"
                        placeholder="Enter or scan barcode"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleBarcodeSubmit();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        onClick={handleBarcodeSubmit}
                        disabled={isScanningBarcode || !barcodeInput.trim()}
                      >
                        {isScanningBarcode ? "Looking up..." : "Lookup"}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenCameraScanner}
                      className="w-full"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera Scanner
                    </Button>
                  </div>

                  {scannedMedicine && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        Medicine Found:
                      </p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {scannedMedicine.name}</p>
                        {scannedMedicine.dosage && <p><strong>Dosage:</strong> {scannedMedicine.dosage}</p>}
                        {scannedMedicine.form && <p><strong>Form:</strong> {scannedMedicine.form}</p>}
                        {scannedMedicine.manufacturer && <p><strong>Manufacturer:</strong> {scannedMedicine.manufacturer}</p>}
                      </div>
                      <Button
                        className="mt-3 w-full"
                        onClick={() => {
                          setIsBarcodeDialogOpen(false);
                          setIsAddDialogOpen(true);
                        }}
                      >
                        Add to Inventory
                      </Button>
                    </div>
                  )}

                  {!scannedMedicine && barcodeInput && !isScanningBarcode && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Medicine not found. You can add it manually using the "Add Item" button.
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBarcodeDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Item Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to your inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Barcode Field (pre-filled if scanned) */}
                  <div className="grid gap-2">
                    <Label htmlFor="barcode">Barcode (EAN/UPC)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="barcode"
                        placeholder="Enter barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddDialogOpen(false);
                          setIsBarcodeDialogOpen(true);
                        }}
                      >
                        <Scan className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Amoxicillin 500mg"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Antibiotics"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="100"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        placeholder="tablets"
                        value={formData.unit}
                        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reorder">Reorder Level</Label>
                    <Input
                      id="reorder"
                      type="number"
                      placeholder="50"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, reorderLevel: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      placeholder="Supplier name"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Cost per Unit ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="0.50"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
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
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-destructive">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} need reordering
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <Badge key={item.id} variant="destructive">
                  {item.name} ({item.quantity} {item.unit})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or barcode..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Item Name</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium">Barcode</th>
                  <th className="text-left py-3 px-4 font-medium">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-medium">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium">Value</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.name}</div>
                      {item.quantity <= item.reorderLevel && (
                        <Badge variant="destructive" className="mt-1">Low Stock</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={item.quantity <= item.reorderLevel ? 'text-destructive font-medium' : ''}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.barcode ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">{item.barcode}</code>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">{item.supplier}</td>
                    <td className="py-3 px-4 font-medium">
                      ${(item.quantity * item.cost).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
