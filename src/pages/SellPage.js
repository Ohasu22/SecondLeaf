import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Package, Edit, Trash2, Eye, DollarSign } from "lucide-react";

// Mock user listings - todo: remove mock functionality
const mockListings = [
  {
    id: '1',
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop, barely used.',
    price: 74000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300',
    condition: 4,
    yearsUsed: 1,
    category: 'Electronics',
    sellerRating: 4.8,
    co2Saved: 150,
    damaged: false,
    status: 'Available'
  },
  {
    id: '2',
    name: 'Wooden Dining Table',
    description: 'Solid wood dining table for 6 people.',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=300',
    condition: 3,
    yearsUsed: 5,
    category: 'Furniture',
    sellerRating: 4.8,
    co2Saved: 200,
    damaged: false,
    status: 'Requested'
  }
];

export default function SellPage() {
  const [activeTab, setActiveTab] = useState("new-listing");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    condition: 5,
    yearsUsed: 0,
    damaged: false,
    image: ""
  });

  const categories = [
    "Electronics",
    "Furniture", 
    "Clothing",
    "Books",
    "Appliances",
    "Vehicles",
    "Sports",
    "Toys & Games"
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Creating listing:', formData);
    // todo: Implement actual listing creation
    setIsCreateModalOpen(false);
    // Reset form
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      condition: 5,
      yearsUsed: 0,
      damaged: false,
      image: ""
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Requested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Sold':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-sell">
            Sell Your Items
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Turn your unused items into cash while helping others find great second-hand products.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-listing" data-testid="tab-new-listing">New Listing</TabsTrigger>
            <TabsTrigger value="my-listings" data-testid="tab-my-listings">My Listings</TabsTrigger>
          </TabsList>

          {/* New Listing Tab */}
          <TabsContent value="new-listing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Listing
                </CardTitle>
                <CardDescription>
                  List your item for sale and reach thousands of potential buyers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          placeholder="e.g., iPhone 12 Pro"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          data-testid="input-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 25000"
                          value={formData.price || ""}
                          onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                          required
                          data-testid="input-price"
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Condition and Details */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="condition">Condition (1-5) *</Label>
                        <Select 
                          value={formData.condition.toString()} 
                          onValueChange={(value) => handleInputChange('condition', parseInt(value))}
                        >
                          <SelectTrigger data-testid="select-condition">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 - Excellent</SelectItem>
                            <SelectItem value="4">4 - Very Good</SelectItem>
                            <SelectItem value="3">3 - Good</SelectItem>
                            <SelectItem value="2">2 - Fair</SelectItem>
                            <SelectItem value="1">1 - Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="yearsUsed">Years Used *</Label>
                        <Input
                          id="yearsUsed"
                          type="number"
                          placeholder="e.g., 2"
                          value={formData.yearsUsed || ""}
                          onChange={(e) => handleInputChange('yearsUsed', parseInt(e.target.value) || 0)}
                          required
                          data-testid="input-years-used"
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          data-testid="input-image"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item's condition, features, and any defects..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                      data-testid="input-description"
                    />
                  </div>

                  {/* Damaged Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="damaged"
                      checked={formData.damaged}
                      onCheckedChange={(checked) => handleInputChange('damaged', checked)}
                      data-testid="checkbox-damaged"
                    />
                    <Label htmlFor="damaged" className="text-sm">
                      This item has damage or defects
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" data-testid="button-create-listing">
                    Create Listing
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="my-listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Listings</h2>
              <Badge variant="secondary">
                {mockListings.length} {mockListings.length === 1 ? 'listing' : 'listings'}
              </Badge>
            </div>

            {mockListings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first listing to start selling!</p>
                  <Button onClick={() => setActiveTab("new-listing")}>
                    Create Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockListings.map((listing) => (
                  <Card key={listing.id} className="hover-elevate transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={listing.image} 
                        alt={listing.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {listing.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-primary">
                          ₹{listing.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {listing.yearsUsed} years old
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}