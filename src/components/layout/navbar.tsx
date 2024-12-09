"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/statistics", label: "Statistics" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="px-16 border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <Trophy className="h-6 w-6 text-primary text-white" />
            <span className="font-bold text-xl hidden md:inline-block">CricScore</span>
          </Link>
        </div>
        <NavigationMenu className="ml-auto">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}