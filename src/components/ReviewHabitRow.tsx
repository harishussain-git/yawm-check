import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit, User } from "@/types/app";

type ReviewHabitRowProps = {
  habit: Habit;
  users: User[];
  statuses: Record<string, boolean>;
};

export function ReviewHabitRow({ habit, users, statuses }: ReviewHabitRowProps) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-base font-semibold leading-snug text-zinc-100">{habit.title}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {users.map((user) => {
          const completed = statuses[user.id];

          return (
            <div key={user.id} className="flex items-center justify-between rounded-[20px] bg-zinc-900 px-3 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-200">
                  {user.initials}
                </div>
                <span className="truncate text-sm font-medium text-zinc-300">{user.name}</span>
              </div>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  completed ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300",
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
