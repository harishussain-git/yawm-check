import type { DaySummary, Habit, HabitStatus, ReviewStatus, User } from "@/types/app";

export const mockCurrentUser: User = {
  id: "me",
  name: "Me",
  initials: "M",
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "hashim",
    name: "Hashim",
    initials: "H",
  },
];

export const habits: Habit[] = [
  { id: "sleep-early", title: "Sleep early after Isha", category: "Night" },
  { id: "phone-away", title: "Keep phone away after Isha", category: "Night" },
  { id: "screen-time", title: "Avoid useless digital screen time", category: "Night" },
  { id: "wake-fajr", title: "Wake before Fajr / Tahajjud", category: "Morning" },
  { id: "fajr", title: "Fajr in masjid", category: "Salah" },
  { id: "dhuhr", title: "Dhuhr in masjid", category: "Salah" },
  { id: "asr", title: "Asr in masjid", category: "Salah" },
  { id: "maghrib", title: "Maghrib in masjid", category: "Salah" },
  { id: "isha", title: "Isha in masjid", category: "Salah" },
  { id: "learning", title: "Qur'an & Hadith learning - 5-10 min", category: "Learning" },
  { id: "exercise", title: "Walk / exercise - 15-20 min", category: "Health" },
  { id: "project", title: "Project / business discussion - 15-20 min", category: "Work" },
  { id: "food", title: "Healthy, moderate food", category: "Health" },
  { id: "tongue", title: "Control tongue: no gossip, anger, useless talk", category: "Character" },
];

export const habitGroups = [
  { title: "Night", habits: habits.filter((habit) => habit.category === "Night") },
  { title: "Morning", habits: habits.filter((habit) => habit.category === "Morning") },
  { title: "Salah", habits: habits.filter((habit) => habit.category === "Salah") },
  { title: "Learning", habits: habits.filter((habit) => habit.category === "Learning") },
  { title: "Health", habits: habits.filter((habit) => habit.category === "Health") },
  { title: "Work", habits: habits.filter((habit) => habit.category === "Work") },
  { title: "Character", habits: habits.filter((habit) => habit.category === "Character") },
];

export const mockTodayStatuses: HabitStatus[] = habits.map((habit, index) => ({
  habitId: habit.id,
  completed: index < 4,
}));

export const mockHistoryDays: DaySummary[] = [
  {
    date: "2025-05-26",
    dayName: "Monday",
    fullDate: "May 26, 2025",
    hijriDate: "28 Dhul Qa'dah 1446",
    completed: 9,
    total: habits.length,
  },
  {
    date: "2025-05-25",
    dayName: "Sunday",
    fullDate: "May 25, 2025",
    hijriDate: "27 Dhul Qa'dah 1446",
    completed: 7,
    total: habits.length,
  },
  {
    date: "2025-05-24",
    dayName: "Saturday",
    fullDate: "May 24, 2025",
    hijriDate: "26 Dhul Qa'dah 1446",
    completed: 11,
    total: habits.length,
  },
  {
    date: "2025-05-23",
    dayName: "Friday",
    fullDate: "May 23, 2025",
    hijriDate: "25 Dhul Qa'dah 1446",
    completed: 6,
    total: habits.length,
  },
];

export const mockDetailStatuses: HabitStatus[] = habits.map((habit, index) => ({
  habitId: habit.id,
  completed: [0, 1, 3, 4, 5, 7, 9, 10, 12].includes(index),
}));

export const mockReviewStatuses: ReviewStatus[] = habits.flatMap((habit, index) => [
  {
    habitId: habit.id,
    userId: "me",
    completed: index < 4,
  },
  {
    habitId: habit.id,
    userId: "hashim",
    completed: index < 7,
  },
]);
