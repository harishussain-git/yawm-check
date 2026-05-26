import Link from "next/link";
import { getProgressPercent } from "@/lib/utils";
import type { DaySummary } from "@/types/app";

type HistoryDayCardProps = {
  day: DaySummary;
};

export function HistoryDayCard({ day }: HistoryDayCardProps) {
  const dayNumber = new Date(`${day.date}T00:00:00`).getDate();
  const percent = getProgressPercent(day.completed, day.total);

  return (
    <Link
      href={`/history/${day.date}`}
      className="block rounded-[24px] border border-zinc-800 bg-zinc-950 p-4"
    >
      <div className="flex gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-zinc-900 text-3xl font-semibold">
          {dayNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-zinc-100">{day.dayName}</p>
              <p className="mt-1 text-sm text-zinc-400">{day.fullDate}</p>
              <p className="text-sm text-zinc-500">{day.hijriDate}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-emerald-300">
              {day.completed}/{day.total}
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
