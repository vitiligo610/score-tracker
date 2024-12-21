"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface LocationInputProps {
  form: UseFormReturn<any>;
  locationInput: string;
  setLocationInput: (value: string) => void;
}

const LocationInput = ({
  form,
  locationInput,
  setLocationInput,
}: LocationInputProps) => {
  const addLocation = () => {
    if (!locationInput.trim()) return;
    const currentLocations = form.getValues("locations");
    form.setValue("locations", [...currentLocations, locationInput.trim()]);
    setLocationInput("");
  };

  const removeLocation = (index: number) => {
    const currentLocations: string[] = form.getValues("locations");
    form.setValue(
      "locations",
      currentLocations.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addLocation())
          }
          placeholder="Add location..."
        />
        <Button type="button" variant="secondary" onClick={addLocation}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {form.watch("locations").map((location: string, index: number) => (
          <Badge key={index} variant="secondary">
            {location}
            <Button
              type="button"
              variant="ghost"
              className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
              onClick={() => removeLocation(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default LocationInput;
