"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TeamSelect from "@/components/tournaments/team-select";
import { Loader, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { MATCH_FORMATS } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { insertTournament } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(3, "Tournament name must be at least 3 characters"),
    format: z.enum(MATCH_FORMATS),
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),
    team_ids: z.array(z.number()).min(4, "At least 4 teams are required"),
    locations: z.array(z.string()).min(1, "At least 1 location is required"),
  });

type TournamentFormValues = z.infer<typeof formSchema>;

export default function CreateTournamentDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      format: "T20",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      team_ids: [],
      locations: [],
    },
  });

  const addLocation = () => {
    if (!locationInput.trim()) return;
    const currentLocations = form.getValues("locations");
    form.setValue("locations", [...currentLocations, locationInput.trim()]);
    setLocationInput("");
  };

  const removeLocation = (index: number) => {
    const currentLocations = form.getValues("locations");
    form.setValue(
      "locations",
      currentLocations.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await insertTournament({
        ...values,
        start_date: values.dateRange.from,
        end_date: values.dateRange.to,
      });
      form.reset();
      setOpen(false);
      toast({
        description: "Tournament added successfully!",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="h-5 w-5" />
          New Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tournament</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tournament name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MATCH_FORMATS.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.charAt(0).toUpperCase() + format.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tournament Dates</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="team_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Teams</FormLabel>
                  <FormControl>
                    <TeamSelect
                      value={field.value}
                      onChange={(values: any) =>
                        field.onChange(values.map(Number))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locations</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Enter location"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addLocation();
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={addLocation}
                        variant="secondary"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((location, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1"
                        >
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
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader className="animate-spin" />} Create Tournament
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
