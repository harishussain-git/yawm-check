import type { User } from "@/types/app";

type HeaderProfileProps = {
  user: User;
  date: string;
  hijriDate: string;
};

export function HeaderProfile({ user, date, hijriDate }: HeaderProfileProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-emerald-300">Yawm Check</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Assalamu alaikum</h1>
        <p className="mt-1 text-sm text-zinc-400">{date}</p>
        <p className="text-sm text-zinc-500">{hijriDate}</p>
      </div>
      <div className="flex items-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-950 px-3 py-2">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-200">
          {user.initials}
        </div>
        <span className="text-sm font-medium text-zinc-200">{user.name}</span>
      </div>
    </header>
  );
}
