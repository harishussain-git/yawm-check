"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/app";

type HabitCheckboxProps = {
  habit: Habit;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  readOnly?: boolean;
};

export function HabitCheckbox({ habit, checked, onChange, readOnly = false }: HabitCheckboxProps) {
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "flex min-h-16 w-full items-center gap-4 rounded-[22px] border px-4 py-3 text-left transition",
        checked
          ? "border-emerald-500/40 bg-emerald-500/10 text-zinc-50"
          : "border-zinc-800 bg-zinc-950 text-zinc-300",
        readOnly && "cursor-default",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full border",
          checked ? "border-emerald-400 bg-emerald-400 text-zinc-950" : "border-zinc-700 bg-zinc-900",
        )}
      >
        {checked && <Check className="h-5 w-5" aria-hidden="true" />}
      </span>
      <span className="text-base font-medium leading-snug">{habit.title}</span>
    </button>
  );
}
