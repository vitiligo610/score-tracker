"use client";

import TeamSelect from "@/components/shared/team-select";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertSeries } from "@/lib/actions";
import { MATCH_FORMATS, SERIES_ROUNDS, SERIES_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import LocationInput from "@/components/shared/location-input";

const formSchema = z
  .object({
    name: z.string().min(3, "Series name must be at least 3 characters"),
    format: z.enum(MATCH_FORMATS),
    type: z.enum(SERIES_TYPES),
    total_rounds: z.string().transform(Number),
    dateRange: z.object({
      from: z.date({
        required_error: "Start date is required",
      }),
      to: z.date({
        required_error: "End date is required",
      }),
    }),
    team_ids: z.array(z.number()),
    locations: z.array(z.string()).min(1, "At least 1 location is required"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "bilateral" && data.team_ids.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bilateral series must have exactly 2 teams",
        path: ["team_ids"],
      });
    }

    if (data.type === "trilateral" && data.team_ids.length !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Trilateral series must have exactly 3 teams",
        path: ["team_ids"],
      });
    }
  });

type SeriesFormValues = z.infer<typeof formSchema>;

const CreateSeriesDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SeriesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      format: "T20",
      type: "bilateral",
      // @ts-ignore
      total_rounds: "3",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      team_ids: [],
      locations: [],
    },
  });

  const onSubmit = async (values: SeriesFormValues) => {
    try {
      setIsSubmitting(true);
      await insertSeries({
        ...values,
        start_date: values.dateRange.from,
        end_date: values.dateRange.to,
      });
      form.reset();
      setOpen(false);
      toast({
        description: "Series added successfully!",
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
          New Series
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Series</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Series Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter series name" {...field} />
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
                  <FormLabel>Series Format</FormLabel>
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

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Series Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERIES_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
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
                name="total_rounds"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Rounds</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                      disabled={form.getValues("type") === "trilateral"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select total rounds" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERIES_ROUNDS.map((round) => (
                          <SelectItem key={round} value={String(round)}>
                            {round}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Series Dates</FormLabel>
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
                        numberOfMonths={1}
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
                      maxTeams={form.getValues("type") === "bilateral" ? 2 : 3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locations"
              render={() => (
                <FormItem>
                  <FormLabel>Locations</FormLabel>
                  <FormControl>
                    <LocationInput
                      form={form}
                      locationInput={locationInput}
                      setLocationInput={setLocationInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader className="animate-spin" />} Create
              Series
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSeriesDialog;
