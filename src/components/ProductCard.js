import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Star, Leaf } from "lucide-react";

export default function ProductCard({ product, onClick, onBuy }) {
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
    <Card className="group hover-elevate cursor-pointer transition-all duration-300 hover:shadow-lg bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30" onClick={() => onClick?.(product)} data-testid={`card-product-${product.id}`}>
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          data-testid={`img-product-${product.id}`}
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant="secondary" className={getConditionColor(product.condition)}>
            {getConditionText(product.condition)}
          </Badge>
          {product.damaged && (
            <Badge variant="destructive">
              Damaged
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
            <Leaf className="h-3 w-3 mr-1" />
            {product.co2Saved}kg CO₂
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1" data-testid={`text-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            ₹{product.price.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span data-testid={`text-rating-${product.id}`}>{product.sellerRating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span data-testid={`text-years-${product.id}`}>{product.yearsUsed} years old</span>
          <span data-testid={`text-category-${product.id}`}>{product.category}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onBuy?.(product);
          }}
          data-testid={`button-buy-${product.id}`}
        >
          Request Item
        </Button>
      </CardFooter>
    </Card>
  );
}