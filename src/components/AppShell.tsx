import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#050607] text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-5">
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
