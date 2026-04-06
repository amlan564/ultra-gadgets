import { filterOptions } from "@/config";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

const ProductFilterDrawer = ({ filters, handleFilter }) => {
  // Define the price range bounds
  const MIN_PRICE = 0;
  const MAX_PRICE = 200000;

  // Initialize price range state with default values from filters or bounds
  const [priceRange, setPriceRange] = useState(
    filters.price || [MIN_PRICE, MAX_PRICE]
  );

  // Handle price range changes from the slider
  const handlePriceChange = (value) => {
    setPriceRange(value);
    // Update the filters with the new price range
    handleFilter("price", value);
  };

  // Handle reset button click
  const handleReset = () => {
    // Reset price range to default
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    // Clear all filters (category and price)
    handleFilter("reset", {});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm lg:fixed lg:top-24 lg:w-[250px] z-10 overflow-y-auto">
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-sm"
        >
          Reset
        </Button>
      </div>
      <Separator />
      <div className="p-4 space-y-4">
        {/* Price Range Filter */}
        <div>
          <h3 className="text-base font-bold">Price Range</h3>
          <div className="my-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>৳{priceRange[0]}</span>
              <span>৳{priceRange[1]}</span>
            </div>
          </div>
          <Separator />
        </div>
        {/* Category Filter */}
        {Object.keys(filterOptions).map((item, index) => (
          <div key={index}>
            <div>
              <h3 className="text-base font-bold">Category</h3>
              <div className="grid gap-2 my-2">
                {filterOptions[item].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-2 font-medium text-base mt-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[item] &&
                        filters[item].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(item, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilterDrawer;
