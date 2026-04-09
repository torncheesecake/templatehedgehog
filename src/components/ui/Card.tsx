import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6",
        hover && "transition-shadow hover:shadow-lg hover:border-border-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
