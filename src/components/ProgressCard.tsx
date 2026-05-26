import { CheckCircle2 } from "lucide-react";
import { getProgressPercent } from "@/lib/utils";

type ProgressCardProps = {
  completed: number;
  total: number;
  label?: string;
};

export function ProgressCard({ completed, total, label = "Completed today" }: ProgressCardProps) {
  const percent = getProgressPercent(completed, total);

  return (
    <section className="rounded-[24px] border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {completed}
            <span className="text-xl text-zinc-500">/{total}</span>
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}
