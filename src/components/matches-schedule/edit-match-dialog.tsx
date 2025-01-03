"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Match } from "@/lib/definitions";
import { useState } from "react";
import { CalendarIcon, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { setMatchDetails } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface EditMatchDialogProps {
  match: Match;
  startDate: Date;
  endDate: Date;
  locations: string[];
  children: React.ReactNode;
}

const EditMatchDialog = ({
  match,
  startDate: startDate,
  endDate: endDate,
  locations,
  children,
}: EditMatchDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    match.match_date ? new Date(match.match_date) : undefined
  );
  const [location, setLocation] = useState<string | undefined>(
    match.location ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await setMatchDetails(match.match_id, date ?? null, location ?? null);
      router.refresh();
      toast({
        description: "Updated match details successfully!",
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Match Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Match Date</Label>
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < startDate || date > endDate}
                  fromDate={startDate}
                  toDate={endDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select match location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader className="animate-spin" />}
            Update Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMatchDialog;
