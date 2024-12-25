"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MatchButtonProps {
  match_id: number | string;
  disabled: boolean;
};

const MatchButton = ({ match_id, disabled }: MatchButtonProps) => {
  const router = useRouter();

  return (
    <Button className="w-full gap-2" disabled={!disabled}>
      <Link href={`/match/${match_id}`}>
        <PlayIcon className="h-4 w-4" />
        Start Match
      </Link>
    </Button>
  )
}

export default MatchButton;