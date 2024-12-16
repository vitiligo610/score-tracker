import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TeamLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Button variant="link" className="px-0">
        <ChevronLeft />
        <Link href="/teams">
        All Teams
        </Link>
      </Button>
      {children}
    </div>
  )
}

export default TeamLayout;