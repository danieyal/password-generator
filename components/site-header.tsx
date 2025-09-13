"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto max-w flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
