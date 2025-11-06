"use client";

import { useFormStatus } from "react-dom";
import {useActionState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Loader, Zap } from "lucide-react";
import { generateSampleData } from "@/lib/actions";
import {toast} from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader className="mr-2 h-5 w-5 animate-spin" />
          Generating Data...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-5 w-5" />
          Generate Sample Data
        </>
      )}
    </Button>
  );
}

export function GenerateDataButton({ userId }: { userId: string }) {
  const [state, formAction] = useActionState(() => generateSampleData(userId), { success: null, message: "" });

  useEffect(() => {
    if (state.success == null) return

    toast({
      variant: state.success ? "default" : "destructive",
      description: state.message
    })
  }, [state])

  return (
    <div className="p-6 bg-card border-2 border-dashed border-primary rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-3 flex items-center text-primary">
        <Zap className="mr-2 h-6 w-6" /> Need a Quick Start?
      </h3>
      <p className="text-muted-foreground mb-4">
        Click below to instantly populate your account with sample tournaments, teams, and players.
        Perfect for testing out CricScore's features!
      </p>

      <form action={formAction} className="space-y-4">
        <SubmitButton />
      </form>
    </div>
  );
}