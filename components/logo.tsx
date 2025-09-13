"use client";

import { cn } from "@/lib/utils";
import icon from "@/app/icon.svg";

type LogoProps = {
  className?: string;
  withText?: boolean;
  iconClassName?: string;
};

export function Logo({ className, withText = true, iconClassName }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <img
        src={icon.src}
        alt="PassGen"
        className={cn("h-5 w-5 text-primary", iconClassName)}
      />
      {withText ? <span className="text-sm font-medium">PassGen</span> : null}
    </span>
  );
}
