"use client";

import React, { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../lib/utils";

const Avatar = forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      `
      after:content-[''] after:block after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:border after:border-black/10 dark:after:border-white/10
      relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full
      `,
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
