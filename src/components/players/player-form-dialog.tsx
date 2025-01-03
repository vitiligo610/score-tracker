"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertPlayer, updatePlayer } from "@/lib/actions";
import { BATTING_STYLES, BOWLING_STYLES, PLAYER_ROLES } from "@/lib/constants";
import { Player } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  date_of_birth: z.string().transform((str) => new Date(str)),
  batting_style: z.enum(BATTING_STYLES),
  bowling_style: z.enum(BOWLING_STYLES),
  player_role: z.enum(PLAYER_ROLES),
  jersey_number: z.string().transform((str) => parseInt(str, 10)),
});

interface PlayerDialogProps {
  player?: Player;
  children: React.ReactNode;
}

const PlayerFormDialog = ({ player, children }: PlayerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: player?.first_name ?? "",
      last_name: player?.last_name ?? "",
      // @ts-ignore
      date_of_birth: player?.date_of_birth
        ? format(new Date(player.date_of_birth), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      batting_style: player?.batting_style ?? "Right-hand",
      bowling_style: player?.bowling_style ?? "Right-arm Spin",
      player_role: player?.player_role ?? "Batsman",
      // @ts-ignore
      jersey_number: player?.jersey_number?.toString() ?? "0",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      !player
        ? await insertPlayer(values)
        : await updatePlayer({ player_id: player.player_id, ...values });
      setOpen(false);
      if (!player) form.reset();
      toast({
        description: `Player ${!player ? "added" : "updated"} successfully!`,
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{!player ? "Add New" : "Edit"} Player</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-6">
              {/* Left Column with Avatar */}
              <div className="w-1/3 flex flex-col items-center space-y-4">
                <UserRound className="h-32 w-32 text-primary border-8 p-2 border-primary rounded-full" />
                <FormField
                  control={form.control}
                  name="jersey_number"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Jersey #</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value}
                          className="text-center"
                          placeholder="00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-2/3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          max={format(new Date(), "yyyy-MM-dd")}
                          min="1900-01-01"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="batting_style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batting Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BATTING_STYLES.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
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
                    name="bowling_style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bowling Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOWLING_STYLES.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
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
                  name="player_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLAYER_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader className="animate-spin" />}{" "}
              {!player ? "Add" : "Update"} Player
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerFormDialog;
