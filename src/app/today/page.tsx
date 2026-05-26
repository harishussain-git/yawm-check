"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HabitGroup } from "@/components/HabitGroup";
import { HeaderProfile } from "@/components/HeaderProfile";
import { ProgressCard } from "@/components/ProgressCard";
import { formatTodayDate, getMockHijriDate } from "@/lib/dates";
import { habitGroups, habits, mockCurrentUser, mockTodayStatuses } from "@/lib/mock-data";

export default function TodayPage() {
  const [checkedIds, setCheckedIds] = useState(() => {
    return new Set(mockTodayStatuses.filter((status) => status.completed).map((status) => status.habitId));
  });

  const completed = checkedIds.size;
  const total = habits.length;
  const today = useMemo(() => formatTodayDate(), []);
  const hijriDate = useMemo(() => getMockHijriDate(), []);

  function handleToggle(habitId: string, checked: boolean) {
    setCheckedIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(habitId);
      } else {
        next.delete(habitId);
      }

      return next;
    });
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <HeaderProfile user={mockCurrentUser} date={today} hijriDate={hijriDate} />
        <ProgressCard completed={completed} total={total} />
        <div className="space-y-6">
          {habitGroups.map((group) => (
            <HabitGroup
              key={group.title}
              title={group.title}
              habits={group.habits}
              checkedIds={checkedIds}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
