import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  href: string;
  label: string;
}

const BackLink = ({ href, label }: Props) => {
  return (
    <Button variant="link" className="px-0">
      <ChevronLeft />
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}

export default BackLink;