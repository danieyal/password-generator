"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Shield } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto max-w flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <Shield className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Secure Password Generator</span>
          <span className="sm:hidden">PassGen</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
