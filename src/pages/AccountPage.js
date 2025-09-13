import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { User, Leaf, ShoppingBag, Star, Calendar, Award, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Package } from "lucide-react";


// Mock user data - todo: remove mock functionality
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  username: 'sarah.eco',
  joinedAt: '2023-06-15',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150'
};

// Mock purchases - todo: remove mock functionality  
const mockPurchases = [
  {
    id: '1',
    productName: 'iPhone 12 Pro',
    productImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150',
    price: 41000,
    purchaseDate: '2024-01-15',
    co2Saved: 70,
    seller: 'TechSeller',
    sellerRating: 4.8,
    userRating: 5,
    userComment: 'Great condition, exactly as described!'
  },
  {
    id: '2',
    productName: 'Vintage Leather Chair',
    productImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150',
    price: 20500,
    purchaseDate: '2024-01-10',
    co2Saved: 120,
    seller: 'VintageDeals',
    sellerRating: 4.2,
    userRating: 4,
    userComment: 'Beautiful piece, some minor wear but great value.'
  },
  {
    id: '3',
    productName: 'MacBook Air M1',
    productImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150',
    price: 66000,
    purchaseDate: '2024-01-05',
    co2Saved: 200,
    seller: 'AppleDeals',
    sellerRating: 4.9
  }
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = mockPurchases.reduce((sum, purchase) => sum + purchase.price, 0);
  const totalCO2Saved = mockPurchases.reduce((sum, purchase) => sum + purchase.co2Saved, 0);
  const membershipDuration = Math.floor((new Date() - new Date(mockUser.joinedAt)) / (1000 * 60 * 60 * 24));

  const handleSubmitRating = (purchaseId) => {
    console.log('Submitting rating:', { purchaseId, rating: newRating, comment: newComment });
    // todo: Implement actual rating submission
    setNewRating(5);
    setNewComment("");
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="heading-account">
              My Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your profile and track your sustainable purchases
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-2xl">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1" data-testid="text-username">{mockUser.name}</h2>
                <p className="text-muted-foreground mb-2" data-testid="text-email">{mockUser.email}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatDate(mockUser.joinedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{membershipDuration} days</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" data-testid="button-edit-profile">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases" data-testid="tab-purchases">Purchase History</TabsTrigger>
            <TabsTrigger value="impact" data-testid="tab-impact">Environmental Impact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Spent */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold" data-testid="text-total-spent">₹{totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Purchased */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items Purchased</p>
                      <p className="text-2xl font-bold" data-testid="text-items-count">{mockPurchases.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CO2 Saved */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                      <p className="text-2xl font-bold" data-testid="text-co2-saved">{totalCO2Saved}kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest purchases and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPurchases.slice(0, 3).map((purchase) => (
                    <div key={purchase.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={purchase.productImage} 
                        alt={purchase.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{purchase.productName}</p>
                        <p className="text-sm text-muted-foreground">Purchased on {formatDate(purchase.purchaseDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{purchase.price.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600">{purchase.co2Saved}kg CO₂ saved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Purchase History
                </CardTitle>
                <CardDescription>All your purchases on SecondLeaf</CardDescription>
              </CardHeader>
              <CardContent>
                {mockPurchases.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">No purchases yet</p>
                    <p className="text-muted-foreground">Start shopping to see your purchase history here!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockPurchases.map((purchase) => (
                      <div key={purchase.id} className="border rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <img 
                            src={purchase.productImage} 
                            alt={purchase.productName}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">{purchase.productName}</h3>
                              <p className="text-muted-foreground">
                                Purchased from {purchase.seller} on {formatDate(purchase.purchaseDate)}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-semibold">₹{purchase.price.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">CO₂ Saved: </span>
                                <span className="font-semibold text-emerald-600">{purchase.co2Saved}kg</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Seller Rating: </span>
                                {renderStars(purchase.sellerRating)}
                                <span className="ml-1 text-sm">({purchase.sellerRating})</span>
                              </div>
                            </div>

                            {/* User Rating Section */}
                            {purchase.userRating ? (
                              <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium">Your Rating:</span>
                                  {renderStars(purchase.userRating)}
                                </div>
                                {purchase.userComment && (
                                  <p className="text-sm text-muted-foreground italic">"{purchase.userComment}"</p>
                                )}
                              </div>
                            ) : (
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm font-medium mb-3">Rate this purchase:</p>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">Rating:</span>
                                    {renderStars(newRating, true, setNewRating)}
                                  </div>
                                  <Textarea
                                    placeholder="Share your experience (optional)"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={2}
                                  />
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleSubmitRating(purchase.id)}
                                    data-testid={`button-submit-rating-${purchase.id}`}
                                  >
                                    Submit Rating
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environmental Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  Your Environmental Impact
                </CardTitle>
                <CardDescription>Track how your sustainable shopping helps the planet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CO2 Impact */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">CO₂ Emissions Saved</h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      {totalCO2Saved}kg CO₂
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mb-4">
                    <p>By choosing second-hand products, you've helped prevent {totalCO2Saved}kg of CO₂ emissions!</p>
                    <p className="text-sm mt-1">That's equivalent to:</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="font-semibold">{Math.round(totalCO2Saved * 2.3)} km</p>
                      <p className="text-sm text-muted-foreground">Car driving distance</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="font-semibold">{Math.round(totalCO2Saved / 22)} trees</p>
                      <p className="text-sm text-muted-foreground">Trees planted equivalent</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="font-semibold">{Math.round(totalCO2Saved / 5)} days</p>
                      <p className="text-sm text-muted-foreground">Average person's emissions</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Sustainability Goals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sustainability Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">CO₂ Saved Goal (500kg)</span>
                        <span className="text-sm text-muted-foreground">{totalCO2Saved}/500kg</span>
                      </div>
                      <Progress value={(totalCO2Saved / 500) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Items Purchased Goal (20)</span>
                        <span className="text-sm text-muted-foreground">{mockPurchases.length}/20</span>
                      </div>
                      <Progress value={(mockPurchases.length / 20) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}