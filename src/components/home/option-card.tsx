"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface OptionCardProps {
  title: string;
  href: string;
  description: string;
  className?: string;
}

export function OptionCard({ title, href, description, className }: OptionCardProps) {
  return (
    <Link href={href} className="block">
      <Card className={cn(
        "group transition-all duration-300 hover:shadow-lg hover:border-primary",
        "transform hover:-translate-y-1",
        className
      )}>
        <CardHeader>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}