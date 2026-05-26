import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DateSwitcher } from "@/components/DateSwitcher";
import { ReviewHabitRow } from "@/components/ReviewHabitRow";
import { ReviewUserCard } from "@/components/ReviewUserCard";
import { habits, mockReviewStatuses, mockUsers } from "@/lib/mock-data";

export default function ReviewPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Review</h1>
          <button
            type="button"
            className="flex min-h-11 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-200"
          >
            Daily
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <DateSwitcher label="May 26, 2025" />

        <div className="grid grid-cols-2 gap-3">
          <ReviewUserCard user={mockUsers[0]} score="4/10" />
          <ReviewUserCard user={mockUsers[1]} score="7/10" />
        </div>

        <div className="space-y-3">
          {habits.map((habit) => {
            const statuses = Object.fromEntries(
              mockReviewStatuses
                .filter((status) => status.habitId === habit.id)
                .map((status) => [status.userId, status.completed]),
            );

            return <ReviewHabitRow key={habit.id} habit={habit} users={mockUsers} statuses={statuses} />;
          })}
        </div>
      </div>
    </AppShell>
  );
}
