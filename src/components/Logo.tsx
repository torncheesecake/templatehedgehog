import Image from "next/image";
import { TEMPLATE_CONFIG } from "@/config/template";

interface LogoProps {
  variant?: "wordmark" | "mark";
  className?: string;
}

export function Logo({ variant = "wordmark", className }: LogoProps) {
  const [brandLineOne, ...brandRest] = TEMPLATE_CONFIG.brandName.split(" ");
  const brandLineTwo = brandRest.join(" ");

  if (variant === "mark") {
    return (
      <Image
        src="/brand/hedgehog-mark-core-blue.svg"
        alt={TEMPLATE_CONFIG.brandName}
        width={122}
        height={94}
        className={`drop-shadow-[0_12px_18px_rgba(222, 210, 204,0.28)] ${className ?? ""}`}
        priority
      />
    );
  }

  return (
    <div className={`inline-flex items-center gap-5 ${className ?? ""}`}>
      <Image
        src="/brand/hedgehog-mark-core-blue.svg"
        alt={`${TEMPLATE_CONFIG.brandName} logo mark`}
        width={138}
        height={106}
        className="drop-shadow-[0_12px_18px_rgba(222, 210, 204,0.28)]"
        priority
      />
      <div className="leading-none">
        <p className="text-[1.5rem] font-bold tracking-[0.01em] text-(--hedgehog-core-navy) sm:text-[1.7rem]">
          {brandLineOne}
        </p>
        {brandLineTwo ? (
          <p className="text-[1.5rem] font-bold tracking-[0.01em] text-(--accent-primary) sm:text-[1.7rem]">
            {brandLineTwo}
          </p>
        ) : null}
      </div>
    </div>
  );
}
