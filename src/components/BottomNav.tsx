"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, History, SearchCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/today", label: "Today", icon: CalendarCheck },
  { href: "/history", label: "History", icon: History },
  { href: "/review", label: "Review", icon: SearchCheck },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800 bg-[#090b0c]/95 px-4 pb-3 pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-3xl text-xs font-medium text-zinc-500",
                active && "bg-emerald-500/12 text-emerald-300",
              )}
            >
              <Icon className="mb-1 h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
