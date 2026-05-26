import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HistoryDayCard } from "@/components/HistoryDayCard";
import { mockHistoryDays } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-emerald-300">Yawm Check</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">History</h1>
        </header>

        <div className="flex items-center justify-between rounded-[24px] border border-zinc-800 bg-zinc-950 p-2">
          <button className="grid h-11 w-11 place-items-center rounded-full bg-zinc-900 text-zinc-300" type="button">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Previous month</span>
          </button>
          <p className="text-base font-semibold text-zinc-100">May 2025</p>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-zinc-900 text-zinc-300" type="button">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Next month</span>
          </button>
        </div>

        <div className="space-y-3">
          {mockHistoryDays.map((day) => (
            <HistoryDayCard key={day.date} day={day} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
