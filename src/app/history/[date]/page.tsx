import { AppShell } from "@/components/AppShell";
import { HabitGroup } from "@/components/HabitGroup";
import { ProgressCard } from "@/components/ProgressCard";
import { formatShortDate, getMockHijriDate } from "@/lib/dates";
import { habitGroups, habits, mockDetailStatuses } from "@/lib/mock-data";

type HistoryDetailPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { date } = await params;
  const checkedIds = new Set(mockDetailStatuses.filter((status) => status.completed).map((status) => status.habitId));

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-emerald-300">Yawm Check</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{formatShortDate(`${date}T00:00:00`)}</h1>
          <p className="mt-1 text-sm text-zinc-500">{getMockHijriDate(`${date}T00:00:00`)}</p>
        </header>

        <ProgressCard completed={checkedIds.size} total={habits.length} label="Completed" />

        <div className="space-y-6">
          {habitGroups.map((group) => (
            <HabitGroup key={group.title} title={group.title} habits={group.habits} checkedIds={checkedIds} readOnly />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
