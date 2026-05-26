import { HabitCheckbox } from "@/components/HabitCheckbox";
import type { Habit } from "@/types/app";

type HabitGroupProps = {
  title: string;
  habits: Habit[];
  checkedIds: Set<string>;
  onToggle?: (habitId: string, checked: boolean) => void;
  readOnly?: boolean;
};

export function HabitGroup({ title, habits, checkedIds, onToggle, readOnly = false }: HabitGroupProps) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-zinc-500">{title}</h2>
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitCheckbox
            key={habit.id}
            habit={habit}
            checked={checkedIds.has(habit.id)}
            onChange={onToggle ? (checked) => onToggle(habit.id, checked) : undefined}
            readOnly={readOnly}
          />
        ))}
      </div>
    </section>
  );
}
