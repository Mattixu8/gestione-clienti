import { cn } from "@/lib/utils";

interface NailIconProps {
  className?: string;
}

export function NailIcon({ className }: NailIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
    >
      {/* Nail shape - elegant oval nail */}
      <path d="M12 2C8 2 5 5.5 5 10c0 3.5 2 7 4 9.5c1 1.25 2 2.5 3 2.5s2-1.25 3-2.5c2-2.5 4-6 4-9.5c0-4.5-3-8-7-8z" />
      {/* Cuticle line */}
      <path d="M7 8c1.5-1 3-1.5 5-1.5s3.5.5 5 1.5" />
      {/* Shine reflection */}
      <path d="M9 5.5c.5-.3 1.5-.5 2-.5" />
    </svg>
  );
}
