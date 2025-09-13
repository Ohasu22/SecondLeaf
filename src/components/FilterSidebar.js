import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Slider } from "../components/ui/slider";
import { Filter, X } from "lucide-react";

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

const conditionOptions = [
  { value: 5, label: "Excellent (5★)" },
  { value: 4, label: "Very Good (4★)" },
  { value: 3, label: "Good (3★)" },
  { value: 2, label: "Fair (2★)" },
  { value: 1, label: "Poor (1★)" }
];

export default function FilterSidebar({ filters, onFiltersChange, onClose, className }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCategoryChange = (category, checked) => {
    const newCategory = checked ? category : "";
    
    onFiltersChange({
      ...filters,
      category: newCategory
    });
  };

  const handlePriceChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleConditionChange = (condition) => {
    onFiltersChange({
      ...filters,
      minCondition: condition
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: "",
      maxPrice: "",
      minCondition: 1,
      maxYearsUsed: ""
    });
  };

  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-clear-all-filters"
          >
            Clear All
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="md:hidden"
              data-testid="button-close-filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Category</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category === category}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                  data-testid={`checkbox-category-${category.toLowerCase()}`}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Maximum Price (₹)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="e.g., 50000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                data-testid="input-max-price"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Condition Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Minimum Condition</Label>
          <div className="space-y-2">
            {conditionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${option.value}`}
                  checked={filters.minCondition >= option.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleConditionChange(option.value);
                    } else if (filters.minCondition === option.value) {
                      handleConditionChange(option.value - 1);
                    }
                  }}
                  data-testid={`checkbox-condition-${option.value}`}
                />
                <Label
                  htmlFor={`condition-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Age Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Maximum Age</Label>
          <div>
            <Label htmlFor="maxAge" className="text-xs text-muted-foreground">
              Years Used
            </Label>
            <Input
              id="maxAge"
              type="number"
              placeholder="e.g., 5"
              value={filters.maxYearsUsed}
              onChange={(e) => handlePriceChange('maxYearsUsed', e.target.value)}
              data-testid="input-max-age"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}