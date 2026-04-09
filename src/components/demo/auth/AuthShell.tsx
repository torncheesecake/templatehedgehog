import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-[#06111b] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-[#1b3549] bg-[radial-gradient(circle_at_22%_12%,#1a4563,transparent_44%),linear-gradient(160deg,#0a1b2a,#08131f)] p-10 lg:block">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#3aa9da]/20 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-72 w-72 rounded-full bg-[#2b89b9]/15 blur-3xl" />

        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-between">
          <Link href="/" className="inline-flex items-center gap-3 text-[#cdeaff]">
            <Image src="/brand/hedgehog-uxwing-logo.svg" alt="TemplateHedgehog" width={42} height={42} />
            <span className="text-lg font-semibold">TemplateHedgehog</span>
          </Link>

          <div>
            <p className="text-sm uppercase tracking-[0.1em] text-[#8fc9e8]">SaaS Admin Pro</p>
            <h2 className="mt-2 text-4xl font-bold text-[#ecf7ff]">Production-ready auth flows for premium B2B products</h2>
            <p className="mt-4 text-base leading-8 text-[#b7d4e6]">
              Sign in, password recovery, invite acceptance, and role-led onboarding patterns with consistent visual hierarchy.
            </p>
          </div>

          <div className="rounded-xl border border-[#25506c] bg-[#10293c] p-4">
            <p className="text-sm text-[#9dc5dc]">Included in this template package</p>
            <ul className="mt-2 space-y-2 text-sm text-[#d8ecfa]">
              <li>Sign-in and authentication states</li>
              <li>Password reset request flow</li>
              <li>Invite acceptance with role context</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md rounded-2xl border border-[#214761] bg-[#0d2232] p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-[#ecf7ff]">{title}</h1>
          <p className="mt-2 text-sm text-[#9fc3da]">{subtitle}</p>

          <div className="mt-6">{children}</div>

          {footer ? <div className="mt-6 border-t border-[#214761] pt-4 text-sm text-[#a8c8de]">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
