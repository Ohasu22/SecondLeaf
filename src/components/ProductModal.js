import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { Star, Leaf, Calendar, Package, Shield, _X } from "lucide-react";

export default function ProductModal({ product, isOpen, onClose, onBuy }) {
  if (!product) return null;

  const getConditionColor = (condition) => {
    if (condition >= 4) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    if (condition >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
  };

  const getConditionText = (condition) => {
    if (condition >= 4) return "Excellent";
    if (condition >= 3) return "Good";
    if (condition >= 2) return "Fair";
    return "Poor";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid={`modal-product-${product.id}`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold pr-8" data-testid={`modal-title-${product.id}`}>
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
                data-testid={`modal-img-${product.id}`}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary" className={getConditionColor(product.condition)}>
                  {getConditionText(product.condition)}
                </Badge>
                {product.damaged && (
                  <Badge variant="destructive">
                    Damaged
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                  <Leaf className="h-3 w-3 mr-1" />
                  {product.co2Saved}kg CO₂
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Price and Rating */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid={`modal-price-${product.id}`}>
                ₹{product.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span data-testid={`modal-rating-${product.id}`}>{product.sellerRating.toFixed(1)} seller rating</span>
                </div>
                <Badge variant="outline" data-testid={`modal-category-${product.id}`}>
                  {product.category}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid={`modal-description-${product.id}`}>
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium" data-testid={`modal-years-${product.id}`}>{product.yearsUsed} years</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">{getConditionText(product.condition)} ({product.condition}/5)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Impact</p>
                  <p className="font-medium text-emerald-600">{product.co2Saved}kg saved</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {product.damaged ? (
                      <span className="text-orange-600">Has damage</span>
                    ) : (
                      <span className="text-green-600">No damage</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Environmental Impact */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2">
                Environmental Impact
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                By purchasing this item, you'll save {product.co2Saved}kg of CO₂ emissions compared to buying new. 
                That's equivalent to planting {Math.round(product.co2Saved / 22)} trees!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={() => onBuy?.(product)}
                className="flex-1"
                data-testid={`modal-button-buy-${product.id}`}
              >
                Request Item
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                data-testid={`modal-button-close-${product.id}`}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}