"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/statistics", label: "Statistics" },
  // { href: "", label: "About" },
];

const AboutDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <NavigationMenuLink
        className={cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent text-primary hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        )}
      >
        About
      </NavigationMenuLink>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>CricScore - Database Systems Project</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          CricScore is a comprehensive cricket scoring and statistics platform.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Submitted By:</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Ahmed Javed</li>
            <li>Abdul Rehman</li>
            <li>Sabahat Ul Hasan</li>
            <li>Capt. Awais</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export function Navbar() {
  return (
    <header className="px-16 border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden md:inline-block text-primary">CricScore</span>
          </Link>
        </div>
        <NavigationMenu className="ml-auto">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent text-primary hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <AboutDialog />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}